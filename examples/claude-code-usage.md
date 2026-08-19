# CLAUDE.md linting

The Node (`.`) and browser (`./browser`) configs include a rule that lints each
repo's `CLAUDE.md` project-context file. It is **on by default** for any project
that extends either config — no extra setup.

`CLAUDE.md` is what gives Claude Code project context (conventions, commands,
gotchas). Oversized context files are harder for Claude Code to use effectively
and tend to accumulate stale guidance, so this rule keeps the file small enough
to stay useful.

## What it checks

| Rule | Severity | Purpose |
| --- | --- | --- |
| `claude-code/max-lines` | `warn` | Flags a `CLAUDE.md` longer than the guideline (default **100** lines). |

It is a **warning** — it never fails a lint run on its own. Bump it to `error`
in your own config if you want CI to enforce it.

## Important: your lint command must include `CLAUDE.md`

ESLint only lints files you point it at. `eslint .` picks up `CLAUDE.md`
automatically; a narrowed command such as `eslint src/**/*.ts` will **not**.
If you lint a subset of files, add `CLAUDE.md` (or `**/CLAUDE.md`) to the set.

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
['warn', { max: 100 }] // default max is 100
```

- `max` (integer, ≥ 1) — the maximum number of content lines. A trailing
  newline does not count as an extra line.
