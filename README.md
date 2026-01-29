# Hubspot Marketing WebTeam ESLint Configuration

This package provides ESLint rules and configurations for **Hubspot Marketing WebTeam** projects, supporting both Node.js backend and browser/React applications.

<!-- index-start -->

## Index

- [Node.js Setup](#nodejs-setup)
- [Browser/React Setup](#browserreact-setup)
- [Stylelint Setup](#stylelint-setup)
- [Cypress Setup](#cypress-setup)
- [Where to use it](#where-to-use-it)
- [Using the Prettier Scripts](#using-the-prettier-scripts)
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

1. Install dependencies

    ```sh
    npm i -D cypress @cypress/webpack-preprocessor @badeball/cypress-cucumber-preprocessor webpack ts-loader js-yaml
    ```

2. Create `cypress.config.js` in project root

    ```javascript
    const { defineConfig } = require('cypress');
    const { config, envs, getBaseUrls } = require('@hs-web-team/eslint-config-node/cypress.config');

    module.exports = defineConfig({
      ...config,
      e2e: {
        ...config.e2e,
        baseUrl: 'http://localhost:3000',
      },
      env: {
        ...envs,
      },
    });
    ```

3. Add scripts to package.json

    ```json
    {
      "scripts": {
        "cypress:open": "cypress open",
        "cypress:run": "cypress run",
        "test:e2e": "cypress run"
      }
    }
    ```

For detailed Cypress configuration documentation including HubSpot-specific features, see [examples/cypress-usage.md](./examples/cypress-usage.md).

## Where to use it

This package provides multiple configurations:

- **Node.js configuration** (default export): For backend Node.js projects
- **Browser configuration** (`/browser` export): For browser-based projects including React applications
- **Stylelint configuration** (`.stylelintrc.json` export): For SCSS/CSS linting
- **Cypress configuration** (`cypress.config` export): For E2E testing with Cypress
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
