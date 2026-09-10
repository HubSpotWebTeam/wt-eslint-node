#!/usr/bin/env node
/**
 * Runs gplint against the shared config bundled in this package, so consumer repos need no
 * local .gplintrc. gplint has no `extends` and only reads a config from the current working
 * directory, so the merged config is written to a temp file and passed with --config.
 *
 * Usage: gherkin-tag-lint [paths...] [gplint flags]     (paths default to cypress/e2e)
 */

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

import { loadLintConfig } from '../gherkin/load-config.js';
import { findFeatureFiles } from '../gherkin/suite-coverage.js';

const here = path.dirname(fileURLToPath(import.meta.url));

// gplint's package `exports` points at a file it does not publish, so it cannot be imported
// or even resolved by subpath. Walk up for the installed bin instead.
function resolveGplintBin() {
  let dir = here;
  for (;;) {
    const candidate = path.join(dir, 'node_modules', 'gplint', 'bin', 'gplint.js');
    if (fs.existsSync(candidate)) return candidate;
    const parent = path.dirname(dir);
    if (parent === dir) return null;
    dir = parent;
  }
}

const args = process.argv.slice(2);
const hasOwnConfig = args.some(arg => arg === '-c' || arg === '--config' || arg.startsWith('--config='));
// gplint mangles globs containing /** by appending /**.feature. Directories recurse to any
// depth, so a directory is always the safer default.
const positionals = args.filter(arg => !arg.startsWith('-'));
const hasPaths = positionals.length > 0;
const targets = hasPaths ? positionals : [path.join('cypress', 'e2e')];

// gplint exits 0 when it finds no files, so a misconfigured path is a silent pass. Only
// checked for targets that exist on disk, since globs are gplint's to resolve.
const realTargets = targets.filter(target => fs.existsSync(target));
if (realTargets.length === targets.length && realTargets.flatMap(findFeatureFiles).length === 0) {
  console.error(`gherkin-tag-lint: no .feature files found under ${targets.join(', ')}`);
  process.exit(2);
}

const gplintBin = resolveGplintBin();
if (!gplintBin) {
  console.error('gherkin-tag-lint: could not find gplint. Reinstall @hs-web-team/eslint-config-node.');
  process.exit(2);
}

const { rules, overridePath } = await loadLintConfig();

let configPath;
if (hasOwnConfig) {
  configPath = null;
} else {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'gherkin-tag-lint-'));
  configPath = path.join(tmpDir, '.gplintrc');
  fs.writeFileSync(configPath, JSON.stringify(rules, null, 2));
  process.on('exit', () => fs.rmSync(tmpDir, { recursive: true, force: true }));
}

if (overridePath) {
  console.info(`gherkin-tag-lint: applying rule overrides from ${path.basename(overridePath)}`);
}

// Positionals first: gplint's array options swallow following paths, and the `=` form does
// not prevent it.
const gplintArgs = [
  gplintBin,
  ...(hasPaths ? [] : targets),
  ...args,
  ...(configPath ? [`--config=${configPath}`] : []),
];

const child = spawn(process.execPath, gplintArgs, { stdio: 'inherit', shell: false });

// Forwarding the exit code is what makes this fail CI. Without it CI passes on violations.
child.on('exit', (code, signal) => process.exit(signal ? 1 : (code ?? 1)));
child.on('error', err => {
  console.error(`gherkin-tag-lint: failed to run gplint. ${err.message}`);
  process.exit(2);
});
