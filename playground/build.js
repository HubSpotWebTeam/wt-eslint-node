import { build } from 'esbuild';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { cp } from 'node:fs/promises';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const outdir = resolve(root, 'playground/dist');
const shims = resolve(root, 'playground/shims');

const gitRef =
  process.env.GITHUB_HEAD_REF ||
  process.env.GITHUB_SHA ||
  execSync('git rev-parse --abbrev-ref HEAD', { cwd: root, encoding: 'utf8' }).trim();

function resolveRepoUrl() {
  if (process.env.GITHUB_SERVER_URL && process.env.GITHUB_REPOSITORY) {
    return `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}`;
  }
  const raw = execSync('git remote get-url origin', { cwd: root, encoding: 'utf8' }).trim();
  const sshMatch = raw.match(/^git@([^:]+):(.+?)(?:\.git)?$/);
  if (sshMatch) return `https://${sshMatch[1]}/${sshMatch[2]}`;
  return raw.replace(/\.git$/, '');
}

const repoUrl = resolveRepoUrl();

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
