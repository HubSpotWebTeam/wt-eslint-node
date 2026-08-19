import maxLines from './rules/max-lines.js';

// First-party ESLint plugin holding lint rules for `CLAUDE.md` project-context
// files. Rules are referenced as `claude-code/<rule>` wherever the plugin is
// registered (see claude-code.config.js).
export default {
  meta: { name: 'claude-code' },
  rules: {
    'max-lines': maxLines,
  },
};
