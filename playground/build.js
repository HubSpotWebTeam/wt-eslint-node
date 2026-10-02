import { build } from 'esbuild';
import { execSync } from 'node:child_process';
import { resolve } from 'node:path';
import { cp, readFile } from 'node:fs/promises';

const root = resolve(import.meta.dirname, '..');
const outdir = resolve(root, 'playground/dist');
const shims = resolve(root, 'playground/shims');

const gitRef =
  process.env.GITHUB_HEAD_REF ||
  process.env.GITHUB_SHA ||
  execSync('git rev-parse --abbrev-ref HEAD', { cwd: root, encoding: 'utf8' }).trim();

const packageJson = JSON.parse(await readFile(resolve(root, 'package.json'), 'utf8'));
const repoUrl = packageJson.repository.url.replace(/^git\+/, '').replace(/\.git$/, '');

await build({
  entryPoints: [resolve(root, 'playground/entry.js')],
  bundle: true,
  outfile: resolve(outdir, 'bundle.js'),
  format: 'iife',
  platform: 'browser',
  target: 'es2022',
  minify: true,
  define: {
    'process.env.NODE_ENV': '"production"',
    'process.env.DEBUG': '""',
    'process.env': '{}',
    PLAYGROUND_GIT_REF: JSON.stringify(gitRef),
    PLAYGROUND_REPO_URL: JSON.stringify(repoUrl),
  },
  alias: {
    'node:path': resolve(shims, 'path.js'),
    'node:util': resolve(shims, 'util.js'),
    path: resolve(shims, 'path.js'),
    util: resolve(shims, 'util.js'),
  },
});

await cp(resolve(root, 'playground/index.html'), resolve(outdir, 'index.html'));

console.info(`Playground built → ${outdir} (ref: ${gitRef})`);
