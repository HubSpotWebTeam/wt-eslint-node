export function format(fmt, ...args) {
  let index = 0;
  return String(fmt).replace(/%[sdj%]/g, match => {
    if (match === '%%') return '%';
    if (index >= args.length) return match;
    const value = args[index++];
    if (match === '%s') return String(value);
    if (match === '%d') return Number(value);
    if (match === '%j') return JSON.stringify(value);
    return match;
  });
}

export default { format };
