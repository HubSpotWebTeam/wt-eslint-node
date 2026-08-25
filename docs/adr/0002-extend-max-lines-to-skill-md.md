# 2. Extend max-lines to SKILL.md and consolidate the claude-code plugin

- Status: Accepted
- Date: 2026-08-25
- Deciders: HubSpot Web Team

## Context

[ADR 0001](0001-lint-claude-md-with-eslint.md) added the first-party
`claude-code` ESLint plugin with a single `max-lines` rule targeting
`CLAUDE.md`, and named two follow-ons in its *Future work* section: more
`claude-code` rules/targets, and exposing the wiring as a reusable named config
object. This ADR records both landing together.

Claude Code skills live under `.claude/skills/`, each described by a `SKILL.md`
instruction file. The same context-bloat failure mode that motivated the
`CLAUDE.md` check applies to skills: an oversized `SKILL.md` is harder for
Claude Code to use and tends to accumulate stale guidance. Skills legitimately
carry more detail than a `CLAUDE.md`, so they warrant a **higher** guideline
rather than the same 100-line limit.

Separately, ADR 0001 wired the plugin through a root-level `claude-code.config.js`
that exported the flat-config blocks, while the sibling `hs-web-team` plugin was
already self-contained under `plugins/hs-web-team/` and exposed its config via
`configs.recommended` (the pattern typescript-eslint and eslint-plugin-react
use). Two plugins, two wiring styles, and a config file in the repo root.

## Decision

**1. Extend `max-lines` to `SKILL.md`.** The rule itself is file-agnostic — it
counts content lines of whatever the flat-config glob feeds it — so no counting
logic changed. A second flat-config block targets
`**/.claude/skills/**/SKILL.md` with `max: 500`. The `CLAUDE.md` block keeps its
100-line guideline. Per-type thresholds live in the config blocks, not baked
into the rule (its internal `DEFAULT_MAX` stays 100 as a fallback).

**2. Add an `advice` rule option for per-type messaging.** The rule message is
now `{{file}} has {{count}} lines, over the {{max}}-line guideline. {{advice}}`,
where `{{file}}` is the offending file's basename (from `context.filename`) and
`{{advice}}` is a configurable string. Each block supplies tailored guidance:

- `CLAUDE.md` — "Trim it or split sections into files Claude Code can import on
  demand."
- `SKILL.md` — "Trim it or move detail into reference files the skill loads on
  demand."

`advice` defaults to the original `CLAUDE.md` wording, so the change is
backward-compatible for any consumer overriding the rule without it.

**3. Consolidate the plugin to match `hs-web-team`.** The root
`claude-code.config.js` is removed. The plugin (`plugins/claude-code/index.js`)
now exports a named `claudeCodePlugin` carrying both `rules` and
`configs.recommended` — an array of the two flat-config blocks. `index.js` and
`browser.js` consume it with `...claudeCodePlugin.configs.recommended`. This is
the reusable-config-object follow-on named in ADR 0001, and it makes both
first-party plugins self-contained under `plugins/<name>/` with one wiring style.

Both blocks remain **warn-only** and **always-on**, fully overridable per
project by scoping to the relevant glob — unchanged from ADR 0001.

## Considered options

**New rule vs. reuse `max-lines`.** We **reused** the rule. Line-counting is
identical for both file types; only the threshold and advice differ, which
flat-config blocks and the `advice` option express cleanly. A separate rule
would only be justified by checks of a different *kind* (e.g. validating
`SKILL.md` frontmatter), which we did not need.

**Generic message vs. per-type advice.** We chose **per-type advice** via a rule
option. A single generic message would have been simpler but would give
misleading guidance (the `CLAUDE.md` "import on demand" wording does not fit a
skill). Naming the file via `context.filename` and letting each block supply its
own advice keeps one rule while producing accurate messages for both targets.

**SKILL.md glob scope.** We scoped to `**/.claude/skills/**/SKILL.md` only — the
standard skills location — rather than also matching a bare top-level
`skills/**/SKILL.md`. Narrower is safer; it can widen later if a need appears.

**Keep root config file vs. fold into the plugin.** We **folded** it in to match
`hs-web-team`. One wiring convention across first-party plugins is easier to
reason about, and it removes a root-level file whose only consumers were
`index.js`/`browser.js`.

## Consequences

- Projects extending either config now also get a warning when a
  `.claude/skills/**/SKILL.md` exceeds 500 lines, in addition to the existing
  `CLAUDE.md` 100-line check. Still warnings only.
- As with `CLAUDE.md`, the `SKILL.md` check fires only if the project's lint
  command includes those files in its set (`eslint .` does; a narrowed command
  may not).
- The `advice` option is now part of the rule's public schema.
- `claude-code.config.js` no longer exists; anything importing
  `claudeCodeConfig`/`claudeSkillsConfig` from it must instead import
  `claudeCodePlugin` from `plugins/claude-code/index.js` and use
  `configs.recommended`. Only this package's own `index.js`/`browser.js` did so.
- No change to the counting logic, the `markdown/gfm` dependency, or the
  warn-only/always-on/overridable properties established in ADR 0001.

## Future work (not yet implemented)

- **`SKILL.md` structural checks.** If needed, a distinct rule could validate
  skill frontmatter (`name`/`description`) or required sections — a different
  kind of check than line-counting, so a new rule rather than another
  `max-lines` block.
