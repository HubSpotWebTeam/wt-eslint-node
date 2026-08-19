# 1. Lint CLAUDE.md with an ESLint rule

- Status: Accepted
- Date: 2026-08-19
- Deciders: HubSpot Web Team

## Context

`CLAUDE.md` gives Claude Code the project context it needs to be useful in a
repo: conventions, common commands, and gotchas. One failure mode quietly
degrades that context: the file **grows too large**. Oversized context files
are harder for Claude Code to use effectively and tend to accumulate stale or
redundant guidance. We treat **100 lines** as the practical guideline.

An earlier prototype enforced this as a warn-only check in a shared **git
pre-push hook** (HubSpotMarketingWebTeam/shared-githooks PR #35, recorded in
that repo's ADR 0001). During review the point was raised that a check on a
file's content — line count, banned boilerplate, deprecated constructs — is
conceptually a **linting** concern: deterministic, per-file, and something each
project should be able to tune or disable. This package
(`@hs-web-team/eslint-config-node`) is the shared home for exactly those rules,
already installed as a dev dependency across the team's projects, so it is the
natural place for the check to live.

This ADR supersedes the pre-push-hook approach. The `shared-githooks` ADR 0001
should be marked superseded and its `CLAUDE.md` check removed.

## Decision

Add a first-party ESLint plugin, `claude-md`, to this package and wire it
**always-on** into both shared configs (`index.js` for Node, `browser.js` for
browser/React). The plugin ships one rule:

- **`claude-md/max-lines`** — warns when `CLAUDE.md` exceeds a maximum number of
  lines. Default `max` is **100**; a trailing newline does not count as a
  content line. It reports at the first line past the limit.

Wiring (see `claude-md.config.js`):

```js
{
  files: ['**/CLAUDE.md'],
  language: 'markdown/gfm',
  plugins: { markdown, 'claude-md': claudeMd },
  rules: { 'claude-md/max-lines': ['warn', { max: 100 }] },
}
```

Properties:

- **Warn-only.** Severity is `warn`, so the rule never fails a lint run on its
  own — consistent with the nudge-not-block philosophy of the original hook.
- **Always on, fully overridable.** Every project that extends either config
  gets the check with no setup, and can retune (`{ max: 150 }`), promote
  (`error`), or disable (`off`) it per project by scoping an override to
  `files: ['**/CLAUDE.md']`.
- **Markdown language dependency.** ESLint cannot parse `.md` on its own — it
  would feed `CLAUDE.md` to the JavaScript parser and error. We add
  `@eslint/markdown`, which registers the `markdown/gfm` language used to parse
  the file into an AST the rule can inspect.
- **Scoped base rules.** `js.configs.recommended` was previously registered
  with no `files` key, so it applied to *every* linted file. Once `CLAUDE.md`
  became lintable, its recommended JS rules (e.g. `no-irregular-whitespace`)
  ran against the markdown AST and crashed. We scoped that config to
  `**/*.{js,mjs,cjs,jsx,ts,mts,cts,tsx}`. This is a no-op for existing
  consumers — non-JS files were never lintable before — but it is a subtle
  change worth recording.

## Considered options

**Enforcement mechanism — ESLint rule vs. git pre-push hook.** We chose the
**ESLint rule**. A file-content check is a linting concern, and expressing it as
a rule makes it per-project overridable — the property the hook lacked. The
hook's advantages were real (it fires for every push regardless of a repo's
lint setup, and can surface a desktop notification to GUI git clients), but they
did not outweigh living in the tool built for opinionated, tunable file rules.

**Missing-`CLAUDE.md` check — keep vs. drop.** We **dropped** it. ESLint only
runs rules against files that exist and match, so "this repo has no `CLAUDE.md`"
cannot be expressed as a rule. The prototype hook warned on a missing file; that
capability does not survive the move and we accepted the loss rather than keep a
hook alongside the rule.

**Rule set — which checks to ship.** Review suggested three deterministic
checks: max lines, banned boilerplate/placeholder text, and flagging deprecated
"commands" in favour of skills. We shipped **`max-lines` only**. It is the
objective, high-signal check that maps directly to the context-bloat concern. A
`no-placeholder-text` rule was prototyped and dropped (YAGNI): matching a single
canonical phrase is a weak proxy for quality — false positives for files that
keep a generated opener but are well-customised, false negatives for genuinely
empty files that reword it — with no evidence yet of a recurring problem. The
rule structure makes adding more checks later cheap.

**Delivery — always-on in the default config vs. opt-in export.** We chose
**always-on**. Because the rule is warn-only and overridable, the cost to a
project that does not want it is one line in `eslint.config.js`; that does not
justify an opt-in export that most projects would have to remember to add.

## Consequences

- Projects extending either config will see a warning when their `CLAUDE.md`
  exceeds 100 lines. Lint runs still pass (warnings only).
- **The rule only fires if the project's lint command actually includes
  `CLAUDE.md` in its file set.** `eslint .` picks it up automatically; a
  narrowed command such as `eslint src/**/*.ts` does not. Projects that lint a
  subset must add `CLAUDE.md` (or `**/CLAUDE.md`) to the set. This is weaker,
  less guaranteed coverage than the always-on hook, and it depends on projects
  being on ESLint 9 flat config.
- There is no longer any warning for a **missing** `CLAUDE.md`.
- Adds `@eslint/markdown` as a runtime dependency of this package (it installs
  into consumers' dev dependency tree via the config).
- Establishes `docs/adr/` and the ADR format for this repository.
- This package's own `CLAUDE.md` (currently ~145 lines) now warns against the
  rule; trimming it is tracked separately.

## Future work (not yet implemented)

- **More `CLAUDE.md` rules.** The plugin can grow additional checks as concrete
  needs appear (e.g. flagging deprecated constructs). Each should stay warn-only
  and overridable.
- **Shared, reusable config export.** If more `CLAUDE.md` rules land, consider
  exposing them as a named `claude-md` config object so projects can opt into or
  out of the whole group in one place.
