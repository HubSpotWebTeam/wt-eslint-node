# Hubspot Marketing WebTeam ESLint Configuration

This package provides ESLint rules and configurations for **Hubspot Marketing WebTeam** projects, supporting both Node.js backend and browser/React applications.

<!-- index-start -->

## Index

- [Node.js Setup](#nodejs-setup)
- [Browser/React Setup](#browserreact-setup)
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

## Where to use it

This package provides two configurations:

- **Node.js configuration** (default export): For backend Node.js projects
- **Browser configuration** (`/browser` export): For browser-based projects including React applications

Choose the appropriate configuration based on your project type.

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