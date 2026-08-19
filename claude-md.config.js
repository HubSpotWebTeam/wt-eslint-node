import markdown from '@eslint/markdown';
import claudeMd from './plugins/claude-md/index.js';

// Flat-config block that lints `CLAUDE.md` project-context files. Spread into
// both the Node (`index.js`) and browser (`browser.js`) configs so any repo
// extending either one gets the checks automatically. Severity is `warn` so it
// never blocks; consumers can bump a rule to `error` or turn it `off` in their
// own eslint.config.js.
//
// `@eslint/markdown` supplies the `markdown/gfm` language — without it ESLint
// would try to parse CLAUDE.md as JavaScript and error.
export const claudeMdConfig = {
  files: ['**/CLAUDE.md'],
  language: 'markdown/gfm',
  plugins: { markdown, 'claude-md': claudeMd },
  rules: {
    'claude-md/max-lines': ['warn', { max: 100 }],
  },
};

export default claudeMdConfig;
