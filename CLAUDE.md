# CLAUDE.md

Shared ESLint, Prettier, Stylelint and Cypress configs for HubSpot Marketing WebTeam projects, published as `@hs-web-team/eslint-config-node`. `package.json` `exports` is the list of public entry points; usage docs live in `README.md` and `examples/`.

## Commands

- `npm test`: `node --test` suite under `test/` and `tests/`
- `npm run lint`: ESLint with `--fix`

To try a change in a consuming project: `npm link` here, then `npm link @hs-web-team/eslint-config-node` there.

## Versioning

release-please cuts releases from Conventional Commit messages (enforced by `.githooks/commit-msg`).

When adding a rule to a bundled config (including the `hs-web-team` plugin's `configs.recommended`):

- `'warn'` severity: minor bump (`feat:`). Warnings don't fail standard CI.
- `'error'` severity: breaking change (`feat!:`, major bump). Errors can fail CI for any consumer with a violation.

## Gotchas

- The package is ESM, but `bin/add-prettier-scripts.js`, `bin/check-peer-deps.cjs` and `cypress.config.cjs` use CommonJS.
- Decisions about linting context files (CLAUDE.md, SKILL.md) are recorded in `docs/adr/`.
