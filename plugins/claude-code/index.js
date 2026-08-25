import markdown from '@eslint/markdown';
import maxLines from './rules/max-lines.js';

// First-party ESLint plugin holding lint rules for Claude Code context files:
// `CLAUDE.md` project-context files and the `SKILL.md` files under
// `.claude/skills/`. Rules are referenced as `claude-code/<rule>` wherever the
// plugin is registered.
export const claudeCodePlugin = {
  meta: { name: 'claude-code' },
  rules: {
    'max-lines': maxLines,
  },
};

// Self-reference via `configs.recommended`, following the same pattern as
// hsWebTeamPlugin (and typescript-eslint / eslint-plugin-react). It carries the
// flat-config blocks that scope the rules to the right files. Severity is `warn`
// so it never blocks; consumers can bump a rule to `error` or turn it `off`.
//
// `@eslint/markdown` supplies the `markdown/gfm` language — without it ESLint
// would try to parse these files as JavaScript and error.
//
// Skills carry more detail than a `CLAUDE.md`, so `SKILL.md` gets a higher
// (500-line) guideline than `CLAUDE.md` (100 lines), with tailored advice.
claudeCodePlugin.configs = {
  recommended: [
    {
      files: ['**/CLAUDE.md'],
      language: 'markdown/gfm',
      plugins: { markdown, 'claude-code': claudeCodePlugin },
      rules: {
        'claude-code/max-lines': [
          'warn',
          { max: 100, advice: 'Trim it or split sections into files Claude Code can import on demand.' },
        ],
      },
    },
    {
      files: ['**/.claude/skills/**/SKILL.md'],
      language: 'markdown/gfm',
      plugins: { markdown, 'claude-code': claudeCodePlugin },
      rules: {
        'claude-code/max-lines': [
          'warn',
          { max: 500, advice: 'Trim it or move detail into reference files the skill loads on demand.' },
        ],
      },
    },
  ],
};
