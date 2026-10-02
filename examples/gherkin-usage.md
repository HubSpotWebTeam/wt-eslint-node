# Gherkin Tag Linting Usage

This package provides shared tag linting for Cypress/Cucumber feature files.

Cucumber selects which tests to run by tag, so a scenario with no tags is silently skipped. A
suite can be fully green while some of its tests never execute. These two checks turn that into
a build failure.

## Applies to

Only repositories whose Cypress suite is written in Gherkin, using
`@badeball/cypress-cucumber-preprocessor` and `.feature` files.

Both checks read `.feature` files and nothing else, so:

- A Cypress suite written in Mocha (`.cy.js` / `.cy.ts` with `describe`/`it`) has nothing to
  check. There are no tags to require, because Mocha does not select tests by tag.
- Existing consumers of `@hs-web-team/eslint-config-node` are unaffected by upgrading. Neither
  check is wired into `wtConfig`, `wtBrowserConfig`, or any Cypress config. Nothing runs until a
  repository adds the `lint:gherkin` script below.

## What is checked

**Per scenario**, every scenario must carry:

- at least one environment tag: `@qa` or `@prod`. Both together is valid.
- at least one locale tag: `@en`, `@es`, `@fr`, `@de`, `@jp`, `@br`. Any number together is valid.

Any other tag is allowed and ignored, including TestRail ids like `@a72w9o`. There is no tag
allowlist.

A tag counts wherever it is declared: the `Feature` line, a `Rule:`, the `Scenario:`, or an
`Examples:` block. Inheritance works the same way as Cucumber's own `--tags` filtering.

**Per suite**, the suite must contain at least one scenario tagged `@smoke @qa @en` and at least
one tagged `@smoke @prod @en`. The same scenario may satisfy both, for example one tagged
`@qa @prod @en @smoke`.

This second check cannot be a lint rule, because a lint rule only ever sees one file at a time
and never the whole suite.

## Installation

```bash
npm i -D @hs-web-team/eslint-config-node@latest
```

`gplint` and the Gherkin parser are bundled, so there is nothing else to install.

## Usage

Add one script to your `package.json`:

```json
{
  "scripts": {
    "lint:gherkin": "gplint cypress/e2e --config=node_modules/@hs-web-team/eslint-config-node/gherkin/.gplintrc && gherkin-tag-coverage"
  }
}
```

Then run it:

```bash
npm run lint:gherkin
```

Both checks print nothing when they pass. A failure looks like this:

```
/path/to/cypress/e2e/login.feature
   3:3  error  The tag(s) [@qa,@prod] should be present for Scenario.                required-tags
   3:3  error  The tag(s) [@en,@es,@fr,@de,@jp,@br] should be present for Scenario.  required-tags

✖ 2 problems (2 errors, 0 warnings)
```

Use `&&` rather than `;` to join the two commands. With `;` the exit code comes from the last
command only, so a tag violation would pass CI.

## QA-only repositories

If a repository has no production environment, the `@smoke @prod @en` requirement can never be
satisfied. Opt out by adding a `gherkin-coverage.json` next to `package.json`:

```json
{ "requiredCombinations": [["@smoke", "@qa", "@en"]] }
```

Do not satisfy the requirement by tagging a scenario `@prod` instead. Tags are what CI selects
on, so that scenario would become eligible for the production run.

A bare array works too:

```json
[["@smoke", "@qa", "@en"]]
```

## Passing a different path

Both commands default to `cypress/e2e`. To point elsewhere:

```bash
gplint tests/features --config=node_modules/@hs-web-team/eslint-config-node/gherkin/.gplintrc
gherkin-tag-coverage tests/features
```

Pass a **directory**, not a glob. `gplint` rewrites patterns containing `/**`, so
`cypress/e2e/**/*.feature` matches nothing. Directories recurse to any depth.

## Notes

- `gplint` exits 0 when it matches no feature files, so a wrong path looks the same as a pass.
  Check that the reported file count is non-zero when first setting this up, using
  `--format=json` to list the files it found.
- Tags are case sensitive. `@EN` does not satisfy `@en`, which is correct, because Cucumber
  would not select it either.
- A scenario written after a `Rule:` belongs to that Rule even if it is dedented back to feature
  level, and inherits the Rule's tags. This is Gherkin behaviour, not a linter quirk.
- An `Examples` table row cannot be tagged individually. Tags attach to the `Examples:` block and
  every row inherits them.
- Whitespace and formatting rules are deliberately not included, because Prettier owns those via
  the bundled `prettier-plugin-gherkin`.
- `gplint` prints an `ExperimentalWarning: Importing JSON modules` line to stderr on every run.
  It is harmless.

## Exit codes

| Code | Meaning                                                                                   |
| ---- | ----------------------------------------------------------------------------------------- |
| 0    | Passed                                                                                    |
| 1    | A real violation, or a missing suite-wide combination                                     |
| 2    | Bad input, for example an unparseable feature file or a malformed `gherkin-coverage.json` |
