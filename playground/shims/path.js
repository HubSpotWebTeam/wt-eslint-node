export function extname(filename) {
  const index = filename.lastIndexOf('.');
  return index > 0 ? filename.slice(index) : '';
}

export function basename(filename, ext) {
  const parts = filename.split('/');
  const base = parts.at(-1) || filename;
  return ext && base.endsWith(ext) ? base.slice(0, -ext.length) : base;
}

export function join(...segments) {
  return segments.join('/').replace(/\/+/g, '/');
}

export function resolve(...segments) {
  return join(...segments);
}

export function dirname(filename) {
  const lastSlash = filename.lastIndexOf('/');
  return lastSlash > 0 ? filename.slice(0, lastSlash) : '.';
}

export function isAbsolute() {
  return false;
}

export const sep = '/';
export const posix = { sep: '/' };

export default { extname, basename, join, resolve, dirname, isAbsolute, sep, posix };
