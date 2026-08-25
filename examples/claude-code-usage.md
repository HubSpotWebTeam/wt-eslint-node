# CLAUDE.md & SKILL.md linting

The Node (`.`) and browser (`./browser`) configs include a rule that lints each
repo's `CLAUDE.md` project-context files and the `SKILL.md` files under
`.claude/skills/`. It is **on by default** for any project that extends either
config — no extra setup.

`CLAUDE.md` is what gives Claude Code project context (conventions, commands,
gotchas), and each `SKILL.md` holds a skill's instructions. Oversized context
files are harder for Claude Code to use effectively and tend to accumulate stale
guidance, so this rule keeps them small enough to stay useful. Skills carry more
detail than a `CLAUDE.md`, so they get a higher guideline.

## What it checks

| Rule | Target | Severity | Purpose |
| --- | --- | --- | --- |
| `claude-code/max-lines` | `**/CLAUDE.md` | `warn` | Flags a `CLAUDE.md` longer than the guideline (default **100** lines). |
| `claude-code/max-lines` | `**/.claude/skills/**/SKILL.md` | `warn` | Flags a `SKILL.md` longer than the guideline (default **500** lines). |

It is a **warning** — it never fails a lint run on its own. Bump it to `error`
in your own config if you want CI to enforce it.

## Important: your lint command must include these files

ESLint only lints files you point it at. `eslint .` picks up `CLAUDE.md` and
`SKILL.md` automatically; a narrowed command such as `eslint src/**/*.ts` will
**not**. If you lint a subset of files, add `**/CLAUDE.md` and
`**/.claude/skills/**/SKILL.md` to the set.

## Overriding

The rule is tunable per project in your `eslint.config.js`. Because it targets
`**/CLAUDE.md`, scope overrides to that file so they don't touch other files:

```js
import wtConfig from '@hs-web-team/eslint-config-node';

export default [
  ...wtConfig,
  {
    files: ['**/CLAUDE.md'],
    rules: {
      // Raise the line limit for a large repo.
      'claude-code/max-lines': ['warn', { max: 150 }],
    },
  },
];
```

Turn it off entirely:

```js
{
  files: ['**/CLAUDE.md'],
  rules: { 'claude-code/max-lines': 'off' },
}
```

## Rule options

### `claude-code/max-lines`

```js
['warn', { max: 100, advice: 'Trim it or split sections into files Claude Code can import on demand.' }]
```

- `max` (integer, ≥ 1) — the maximum number of content lines. A trailing
  newline does not count as an extra line. Defaults to **100** (the CLAUDE.md
  block); the SKILL.md block sets it to **500**.
- `advice` (string) — the guidance appended to the warning message, so you can
  tailor it to the file type. The message also names the offending file (e.g.
  `SKILL.md has 620 lines, over the 500-line guideline. …`).
