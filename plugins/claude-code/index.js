import maxLines from './rules/max-lines.js';

// First-party ESLint plugin holding lint rules for `CLAUDE.md` project-context
// files. Rules are referenced as `claude-md/<rule>` wherever the plugin is
// registered (see claude-md.config.js).
export default {
  meta: { name: 'claude-md' },
  rules: {
    'max-lines': maxLines,
  },
};
