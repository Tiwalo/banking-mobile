import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';

import Ajv2020 from 'ajv/dist/2020.js';
import standalone from 'ajv/dist/standalone/index.js';
import addFormats from 'ajv-formats';
import openapiTS, { astToString } from 'openapi-typescript';
import { parse } from 'yaml';

const root = new URL('../../', import.meta.url);
const pin = JSON.parse(await readFile(new URL('api/openapi/pin.json', root), 'utf8'));
if (!/^[a-f0-9]{40}$/.test(pin.revision) || !/^[a-f0-9]{64}$/.test(pin.sha256) ||
    pin.repository !== 'https://github.com/Tiwalo/banking-core-api' ||
    pin.path !== 'api/openapi/banking-v1.yaml') {
  throw new Error('Expected an immutable banking-core-api contract pin.');
}

const source = await readFile(new URL(pin.path, root));
const digest = createHash('sha256').update(source).digest('hex');
if (digest !== pin.sha256) throw new Error('Vendored OpenAPI bytes differ from the pin.');

const spec = parse(source.toString('utf8'));
if (spec.openapi !== pin.openapi || spec.info.version !== pin.apiVersion ||
    spec.servers[0]?.url !== '/api/v1') {
  throw new Error('OpenAPI metadata differs from the pin or banking API base path.');
}

// Keep the original JSON Schema for runtime validation. Make the equivalent
// constraints explicit for the TypeScript generator, as in the web client.
const typeInput = JSON.parse(JSON.stringify(spec, (_key, value) => {
  if (value?.$ref !== '#/components/schemas/Problem' || !value.properties) return value;
  const { $ref, ...constraints } = value;
  return { allOf: [{ $ref }, { type: 'object', ...constraints }] };
}));
const minorUnits = typeInput.components.schemas.MinorUnits;
minorUnits.anyOf = minorUnits.anyOf.map((bound) => ({ type: minorUnits.type, ...bound }));

const schemaId = 'urn:tiwalo:banking-v1';
const ajv = new Ajv2020({ strict: false, code: { source: true, lines: true } });
addFormats(ajv);
// JSON Schema's UUID format and the Spring paths use the plain UUID form.
ajv.addFormat('uuid', /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i);
ajv.addSchema(spec, schemaId);

function registerSchema(name, pointer) {
  const id = `${schemaId}:${name}`;
  ajv.addSchema({ $ref: `${schemaId}#${pointer}` }, id);
  return id;
}

const accountList = '/paths/~1accounts/get';
const transferPost = '/paths/~1transfers/post';
const validators = {
  isId: ['/components/schemas/Id', 'Id'],
  isAccountLimit: [`${accountList}/parameters/0/schema`, 'AccountLimit'],
  isCursor: ['/components/schemas/Cursor', 'Cursor'],
  isAccountPage: [`${accountList}/responses/200/content/application~1json/schema`, 'AccountPage'],
  isAccount: ['/components/schemas/Account', 'Account'],
  isTransferReceipt: ['/components/schemas/TransferReceipt', 'TransferReceipt'],
  isProblem: ['/components/schemas/Problem', 'Problem'],
};
const accountLimit = spec.paths['/accounts'].get.parameters[0];
if (accountLimit?.name !== 'limit' || accountLimit.in !== 'query') {
  throw new Error('The account limit schema moved. Update the generated validator pointer.');
}

// Exercise the pinned POST examples offline, without exposing a mutation.
const transfer = spec.paths['/transfers'].post;
const fixtureSchemas = {
  transferRequest: [
    '/components/schemas/TransferRequest', transfer.requestBody.content['application/json'].example,
  ],
  transferConflict: [
    `${transferPost}/responses/409/content/application~1problem+json/schema`,
    transfer.responses['409'].content['application/problem+json'].example,
  ],
  transferDecline: [
    `${transferPost}/responses/422/content/application~1problem+json/schema`,
    spec.components.examples.InsufficientFunds.value,
  ],
  transferBusy: [
    `${transferPost}/responses/503/content/application~1problem+json/schema`,
    transfer.responses['503'].content['application/problem+json'].example,
  ],
};
for (const [name, [pointer, example]] of Object.entries(fixtureSchemas)) {
  const validate = ajv.getSchema(registerSchema(name, pointer));
  if (!validate(example)) throw new Error(`Pinned example failed validation: ${name}.`);
}

const directory = new URL('src/api/generated/', root);
const check = process.argv[2] === '--check';
if (!check) await mkdir(directory, { recursive: true });

async function output(name, contents) {
  const file = new URL(name, directory);
  if (check) {
    const existing = await readFile(file, 'utf8').catch((error) => {
      if (error.code === 'ENOENT') return null;
      throw error;
    });
    if (existing !== contents) throw new Error(`${name} has drifted. Run npm run contract:generate.`);
    return;
  }
  await writeFile(file, contents);
}

const header = `/* Generated from banking-core-api@${pin.revision}. Run npm run contract:generate. */\n`;
const exports = Object.fromEntries(Object.entries(validators).map(([name, [pointer]]) => [
  name, registerSchema(name, pointer),
]));
const declarations = Object.entries(validators).map(([name, [, type]]) => (
  `export function ${name}(value: unknown): value is ${type};`
));

await output('banking.d.ts', header + astToString(await openapiTS(typeInput)));
await output('validate.cjs', header + standalone.default(ajv, exports) + '\n');
await output('validate.d.cts', header + [
  "import type { components, operations } from './banking';",
  '',
  "type AccountPage = operations['listAccounts']['responses'][200]['content']['application/json'];",
  "type AccountLimit = NonNullable<NonNullable<operations['listAccounts']['parameters']['query']>['limit']>;",
  ...['Id', 'Cursor', 'Account', 'TransferReceipt', 'Problem'].map((type) => (
    `type ${type} = components['schemas']['${type}'];`
  )),
  '',
  ...declarations,
  '',
].join('\n'));
console.log(`${check ? 'Verified' : 'Generated'} API ${pin.apiVersion} at ${pin.revision} (${digest}).`);
