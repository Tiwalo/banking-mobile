import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = new URL('../', import.meta.url);
const manifest = new URL('node_modules/expo-secure-store/package.json', root);
const { version } = JSON.parse(readFileSync(manifest, 'utf8'));
if (version !== '58.0.3') {
  throw new Error(`Review the SecureStore backport before using expo-secure-store ${version}.`);
}

const patch = 'patches/expo-secure-store-58.0.3.patch';
const options = { cwd: fileURLToPath(root) };
const apply = ['-c', 'core.longpaths=true', 'apply'];
const installed = spawnSync('git', [...apply, '--reverse', '--check', patch], options);
if (installed.error) throw installed.error;

if (installed.status !== 0) {
  const applied = spawnSync('git', [...apply, '--whitespace=nowarn', patch], { ...options, stdio: 'inherit' });
  if (applied.error) throw applied.error;
  if (applied.status !== 0) throw new Error('Failed to apply the Android SecureStore backport.');
}
