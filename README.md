# Hubspot Marketing WebTeam ESLint rules for Node.js

This is a list of ESLint rules that are recommended for use with **Hubspot Marketing WebTeam** projects.

<!-- index-start -->

## Index

- [Setup](#setup)
- [Where to use it](#where-to-use-it)
- [Using the Prettier Scripts](#using-the-prettier-scripts)
<!-- index-end -->

## Setup

1. Install as dev dependency

    ```sh
    npm i -D @hs-web-team/eslint-config-node@latest
    ```

2. Add to `.eslintrc` in project root directory

    ```json
    {
      "extends": "@hs-web-team/eslint-config-node"
    }
    ```

3. Extend the eslint on a project basis by adding rules to `.eslintrc` e.g.

    ```json
    {
      "extends": "@hs-web-team/eslint-config-node",
      "settings": {
        "import/resolver": "webpack"
      }
    }
    ```

## Where to use it

This package is intended to be used as a starting point for ESLint rules for Backend Node.js projects, and not for use in browser environments.

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