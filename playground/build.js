import { build } from 'esbuild';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { cp } from 'node:fs/promises';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const outdir = resolve(root, 'playground/dist');
const shims = resolve(root, 'playground/shims');

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
  },
  alias: {
    'node:path': resolve(shims, 'path.js'),
    'node:util': resolve(shims, 'util.js'),
    path: resolve(shims, 'path.js'),
    util: resolve(shims, 'util.js'),
  },
});

await cp(resolve(root, 'playground/index.html'), resolve(outdir, 'index.html'));

console.info(`Playground built → ${outdir}`);
