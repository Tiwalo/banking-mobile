# M1-01 — API contract and integration foundation

Status: implemented and verified locally on 2026-11-25

Branch `feat/mobile-api-contract`, base `c881cb6de850c684b1da36c9f951bfd53bb6f59e`

## Goal and acceptance criteria

Deliver a schema-validated Expo banking read adapter, reproducible contract generation, safe Problem Details handling, lossless PHP strings, and an isolated TanStack Query foundation. A clean checkout must pass generation drift checks, lint, typecheck, and deterministic tests with synthetic fixtures and without a banking runtime.

## Prerequisites and sources

Pin API 1.1.0, OpenAPI 3.1.1, at `banking-core-api` commit `fc06aebdc53ae2e4a28e54aaeb875294e317e8c1`. The original `api/openapi/banking-v1.yaml` SHA-256 is `b3247ef65918185e10281d1162407a0cb9d623a4da62ebcbc8ef89bdde16bb49`. The six operations in the contract are marked available and have backend handlers. The documented local API and Keycloak ports refused connections during planning. Live acceptance awaits a reachable API and issuer with an authorized synthetic customer. [Pinned contract](https://github.com/Tiwalo/banking-core-api/blob/fc06aebdc53ae2e4a28e54aaeb875294e317e8c1/api/openapi/banking-v1.yaml)

## Decisions

- Use `expo/fetch`, `openapi-typescript`, Ajv standalone validators, and TanStack Query for session-scoped memory only. Keep the backend artifact, generated output, and dependency resolutions pinned. Keep fixtures in the Jest transport harness.

## Scope

- Generate the whole contract and expose `listAccounts`, `getAccount`, and `getTransferReceipt` for a known receipt ID. M2–M4 own live authentication, screen integration, transfer submission, and replay. Backend reconciliation remains operator-only.

## Steps

1. Vendor the immutable Git blob, generate declarations and validators, and compare current artifacts in CI. Treat changes to the pin, generated output, and adapter as one rollback unit.
2. Resolve the public API base URL on adapter construction. Validate parameters before dispatch, require an explicit caller-supplied bearer token, and bound GETs to 15 seconds through body reading. Validate successful JSON and map recognized RFC 9457 statuses and codes to safe failures.
3. Reuse the PHP string utilities for canonical centavos and signed-long bounds. Compile and verify the positive transfer amount constraint and the POST conflict, decline, and contention examples offline.
4. Provide one query client per authenticated session and API environment. Pass the query cancellation signal into the adapter. Cancel and clear the old cache on disposal. Disable retry, focus/reconnect refetch, and offline replay.

## Safety and privacy

- Keep credentials, identifiers, raw server errors, and financial payloads out of diagnostics. Use signed-long bounds and string operations for money. Keep the fixture transport isolated from app entry points. Transfer idempotency and recovery apply to the deferred submission feature.

## Verification

- Run `npm run contract:check`, `npm run lint`, `npm run typecheck`, and `npm test -- --runInBand` after a clean dependency install. Demonstrate that changing the artifact or generated output causes the drift check to fail.
- Test typed pagination, owner-scoped resource failures, malformed and unknown problems, mismatched detail IDs, syntax and precision bounds, timeout before headers and during body reads, and caller cancellation. Confirm single dispatch and verify that cache disposal drops pending and late results.
- Validate production exports with the API URL unset and check that fixture modules are absent. Record native device and live evidence separately. Obtain an independent read-only review before delivery.

## Completion report (after execution)

- Contract and generation files are `.gitattributes`, `api/openapi/banking-v1.yaml`, `api/openapi/pin.json`, `scripts/contract/generate.mjs`, `scripts/contract/package.json`, and `scripts/contract/package-lock.json`.
- Adapter and money files are `src/api/banking-api.ts`, `src/api/problem.ts`, `src/api/query-client.ts`, `src/api/generated/banking.d.ts`, `src/api/generated/validate.cjs`, `src/api/generated/validate.d.cts`, and `src/ui/php-money.ts`.
- Test files are `tests/banking-api.test.ts`, `tests/banking-query.test.ts`, `tests/fixtures/banking-api.ts`, and `tests/php-money.test.ts`. Configuration and documentation files are `.env.example`, `.github/workflows/verify.yml`, `eslint.config.js`, `package.json`, `package-lock.json`, `README.md`, `docs/adr/0003-banking-api-contract.md`, and this plan.
- Isolated the generator and its TypeScript 5 peer in `scripts/contract` after npm confirmed that `openapi-typescript` 7.13.0 requires TypeScript 5. The Expo app uses its existing TypeScript 6 toolchain. Both lockfile installs passed.
- Passed `npm run contract:generate`, `npm run contract:check`, `npm run lint`, `npm run typecheck`, and `npm test -- --runInBand` on Windows with Node 26.1.0 and npm 11.14.0. All 132 tests passed in six suites. The drift check rejected intentional changes to the spec and each of the three generated files.
- Offline Expo production exports succeeded for Android, iOS and web with the API URL unset. All 23 exported source maps excluded the M1-01 fixture transport and its tests. These are bundling results. Device runs and hosted CI are unverified.
- Independent read-only review identified Ajv's acceptance of UUID URNs. The validator now requires the plain UUID form, with regression tests for request IDs and account pages.
- Live integration remains blocked. The local API and Keycloak ports returned no HTTP response. M2 needs a reachable service and issuer, authorized synthetic customers, and device verification. M1-01 is ready for human review. Merge still requires hosted CI and human approval.

## Durable documentation updates

Contract ownership, toolchain, privacy, and PHP decisions are recorded in [ADR 0003](../docs/adr/0003-banking-api-contract.md).
