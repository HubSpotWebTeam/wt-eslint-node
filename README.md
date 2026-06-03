# Hubspot Marketing WebTeam ESLint Configuration

This package provides ESLint rules and configurations for **Hubspot Marketing WebTeam** projects, supporting both Node.js backend and browser/React applications.

<!-- index-start -->

## Index

- [Node.js Setup](#nodejs-setup)
- [Browser/React Setup](#browserreact-setup)
- [Stylelint Setup](#stylelint-setup)
- [Cypress Setup](#cypress-setup)
- [Accessibility Testing](#accessibility-testing-optional)
- [Where to use it](#where-to-use-it)
- [Using the Prettier Scripts](#using-the-prettier-scripts)
- [Contributing](#contributing)
<!-- index-end -->

## Node.js Setup

1. Install as dev dependency

    ```sh
    npm i -D @hs-web-team/eslint-config-node@latest
    ```

2. Add to `eslint.config.js` in project root directory

    ```typescript
    import wtConfig from '@hs-web-team/eslint-config-node';

    export default [
      ...wtConfig,
    ];
    ```

3. Extend the eslint on a project basis by adding rules to `eslint.config.js` e.g.

    ```typescript
    import wtConfig from '@hs-web-team/eslint-config-node';

    export default [
      // Add project-specific ignores here
      {
        ignores: ['dist/**'],
      },
      // Add project-specific rules here
      {
        rules: {
          'no-console': 'error',
        },
      },
      ...wtConfig, // This will include the shared rules from @hs-web-team/eslint-config-node
    ];
    ```

## Browser/React Setup

1. Install as dev dependency

    ```sh
    npm i -D @hs-web-team/eslint-config-node@latest
    ```

2. Add to `eslint.config.js` in project root directory

    ```typescript
    import wtBrowserConfig from '@hs-web-team/eslint-config-node/browser';

    export default [
      ...wtBrowserConfig,
    ];
    ```

3. The browser configuration includes:
   - ESLint recommended rules for JavaScript
   - TypeScript support with typescript-eslint
   - React support with eslint-plugin-react
   - React Hooks rules with eslint-plugin-react-hooks
   - Accessibility rules with eslint-plugin-jsx-a11y
   - Browser globals (window, document, etc.) and custom globals (jQuery, $, Invoca)

For detailed browser configuration documentation and migration guides, see [examples/browser-usage.md](./examples/browser-usage.md).

## Stylelint Setup

This package provides shared Stylelint configuration for SCSS/CSS linting.

1. Install dependencies

    ```sh
    npm i -D stylelint stylelint-config-standard-scss
    ```

2. Create `.stylelintrc.json` in project root

    ```json
    {
      "extends": "@hs-web-team/eslint-config-node/.stylelintrc.json"
    }
    ```

3. Add scripts to package.json

    ```json
    {
      "scripts": {
        "stylelint:check": "stylelint '**/*.{css,scss}'",
        "stylelint:fix": "stylelint '**/*.{css,scss}' --fix"
      }
    }
    ```

For detailed Stylelint configuration documentation, see [examples/stylelint-usage.md](./examples/stylelint-usage.md).

## Cypress Setup

This package provides shared Cypress configuration for E2E testing.

1. Install Cypress

    ```sh
    npm i -D cypress@15
    ```

For detailed Cypress configuration and migration documentation, see [examples/cypress-usage.md](./examples/cypress-usage.md).

## Accessibility Testing (optional)

This package includes a shared accessibility testing setup using [cypress-axe](https://github.com/component-driven/cypress-axe). Projects can opt in with a single import — no need to install `cypress-axe` or `axe-core` directly.

1. Add to `cypress/support/e2e.ts`

    ```ts
    import '@hs-web-team/eslint-config-node/cypress';
    ```

    This registers `cy.injectAxe()`, `cy.checkA11y()`, and `cy.checkAccessibility()`.

2. Call `cy.injectAxe()` in your project's navigation command, after the page visit e.g.

    ```ts
    // cypress/support/commands.ts
    cy.visitPageIfUrlChanged(urlPath).then(() => {
      cy.injectAxe();
    });
    ```

3. Use `cy.checkAccessibility()` in your tests e.g.

    ```ts
    // Check the whole page
    cy.checkAccessibility();

    // Scope to a specific component
    cy.checkAccessibility('.csol-accordion');
    ```

`cy.checkAccessibility()` adds the `high-contrast` class to `body`, runs WCAG 2.2 Level AA rules only, and logs each violation with its id, help text, impact, element targets, and help URL. TypeScript types are included — no `tsconfig.json` changes required.

## Where to use it

This package provides multiple configurations:

- **Node.js configuration** (default export): For backend Node.js projects
- **Browser configuration** (`/browser` export): For browser-based projects including React applications
- **Stylelint configuration** (`.stylelintrc.json` export): For SCSS/CSS linting
- **Cypress configuration** (`cypress.config` export): For E2E testing with Cypress
- **Accessibility testing** (`/cypress` export): Opt-in cypress-axe setup with WCAG 2.2 AA checks
- **Prettier configuration** (`.prettierrc.json` export): For code formatting

Choose the appropriate configurations based on your project needs.

## Using the Prettier Scripts

This package includes a utility script to automatically add Prettier configuration to your project.

1. Run the script:

    ```sh
    node ./node_modules/@hs-web-team/eslint-config-node/bin/add-prettier-scripts.js
    ```

2. The script will:

   - Add `prettier:check` and `prettier:write` scripts to your package.json
   - Install Prettier as a dev dependency if not already installed
   - Create a `.prettierrc.js` file with shared config
   - Create a `.prettierignore` file with sensible defaults

3. After installation, you can use the following commands:

   - `npm run prettier:check` - Check files for formatting issues
   - `npm run prettier:write` - Automatically fix formatting issues

## Migration from v1 to v2

See [MIGRATION-V2.md](./docs/MIGRATION-V2.md)

## Migration from v2 to v3

See [MIGRATION-V3.md](./docs/MIGRATION-V3.md)

## Contributing

### Conventional Commits

This repo uses [Conventional Commits](https://www.conventionalcommits.org) for all commit messages. A `commit-msg` git hook validates the format automatically — run `npm install` once to activate it.

**Format:** `type(optional-scope): description`

| Type | Use for | Version bump |
|------|---------|-------------|
| `feat` | New feature or config rule | Minor (`4.0.0` → `4.1.0`) |
| `fix` | Bug fix or rule correction | Patch (`4.0.0` → `4.0.1`) |
| `feat!` or `BREAKING CHANGE:` footer | Breaking API/config change | Major (`4.0.0` → `5.0.0`) |
| `chore` | Dependency updates, tooling | No release |
| `docs` | Documentation only | No release |
| `refactor` | Internal restructuring | No release |
| `ci` | CI/CD changes | No release |
| `test` | Test changes | No release |

**Examples:**

```
feat: add import/order rule to Node config
fix: align browser comma-dangle with prettier defaults
feat(browser): add React 19 peer dep support
feat!: drop Node 18 support — requires Node 24+
chore: bump typescript-eslint to v8.60
docs: update Cypress usage examples
```

A breaking change can also be indicated by adding a `BREAKING CHANGE:` footer to any commit type:

```
feat: remove deprecated stylelint rules

BREAKING CHANGE: Removed rules that were dropped in stylelint-scss@7.
Projects relying on those rules must update their configs before upgrading.
```

### Release Process

Releases are automated via [release-please](https://github.com/googleapis/release-please). No manual version bumping or GitHub release creation is needed.

**How it works:**

1. Merge PRs to `main` using conventional commit messages (see above).
2. After each merge, release-please opens or updates a **Release PR** (titled `chore(main): release X.Y.Z`) that accumulates all unreleased changes, bumps `package.json`, and generates a `CHANGELOG.md` entry.
3. When you are ready to publish, **merge the Release PR**.
4. release-please creates a GitHub release and git tag automatically.
5. The `release.yml` workflow fires on the new release and publishes to npm.

**To release a prerelease (`-next.N`):**  
Update the version in `package.json` manually on a branch (e.g. `4.1.0-next.0`) and create a GitHub release by hand — the existing `release.yml` workflow will publish it with the `next` tag on npm. Prereleases are not yet managed by release-please in this repo.
