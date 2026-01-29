# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is a configuration package (`@hs-web-team/eslint-config-node`) for HubSpot Marketing WebTeam projects. It provides shared configurations for:
- **ESLint** rules for Node.js and browser/React projects
- **Prettier** formatting configuration
- **Stylelint** rules for SCSS/CSS linting
- **Cypress** E2E testing configuration

## Key Commands

### Linting

```bash
npm run lint
```

Runs ESLint on the codebase with auto-fix enabled. Uses the configuration defined in `index.js`.

### Testing in Projects
When testing changes to this package in downstream projects, you'll typically:
1. Make changes to the ESLint config in `index.js`
2. Run `npm link` in this repository
3. Run `npm link @hs-web-team/eslint-config-node` in the consuming project
4. Test the linting behavior in the consuming project

## Architecture

### Core Configuration Files

#### `index.js` - Node.js Configuration
- The main ESLint configuration export using ESLint 9's flat config format
  - Uses `@eslint/js`, `typescript-eslint`, and `globals` packages
  - Exports an array of configuration objects (flat config format)
  - Structure:
    1. Global ignores object
    2. `js.configs.recommended` for JavaScript baseline
    3. JavaScript-specific config for `**/*.{js,mjs,cjs}` files
    4. Spreads `tseslint.configs.recommended` for TypeScript baseline
    5. TypeScript-specific config for `**/*.{ts,mts,cts,tsx}` files
  - Includes Node.js, ES2022, and Jest globals
  - Common ignores: `node_modules`, `.serverless`, `.webpack`, `dist`, `eslint.config.js`
  - Key custom rules: `no-console` (allows info/warn/error), `max-len` (120 chars), camelcase disabled

#### `browser.js` - Browser/React Configuration
- Browser and React-focused ESLint configuration using ESLint 9's flat config format
  - Uses `@eslint/js`, `typescript-eslint`, `globals`, and React-specific plugins
  - Includes `eslint-plugin-react`, `eslint-plugin-react-hooks`, and `eslint-plugin-jsx-a11y`
  - Supports both JavaScript/JSX and TypeScript/TSX files
  - Structure:
    1. Global ignores (node_modules, dist, build, .next, coverage)
    2. Base JavaScript/JSX config with browser globals
    3. React plugin configuration
    4. TypeScript config with browser globals
    5. React plugin configuration for TypeScript files
  - Includes browser, ES2021, and Jest globals, plus custom globals ($, jQuery, Invoca)
  - Key custom rules: Similar base rules to Node config, plus React-specific rules

### Prettier Integration
- **`bin/add-prettier-scripts.js`**: Executable script that consuming projects can run to set up Prettier
  - Uses CommonJS (`require`) syntax (different from the main package which is ESM)
  - Adds `prettier:check` and `prettier:write` scripts to package.json
  - Creates `.prettierrc.js` file that imports from this package's `.prettierrc.json`
  - Creates `.prettierignore` file with sensible defaults (npm-shrinkwrap.json, package-lock.json, .eslintrc, *.html)
- **`.prettierrc.json`**: Shared Prettier configuration
  - 120 char width, single quotes, 2-space tabs, trailing commas
  - Arrow parens: avoid, LF line endings, single attribute per line
  - Override for YAML files: uses double quotes instead of single

### Stylelint Configuration
- **`.stylelintrc.json`**: Shared Stylelint configuration for SCSS/CSS linting
  - Extends `stylelint-config-standard-scss` for standard SCSS linting rules
  - Customized rules for HubSpot projects:
    - Disables strict class name patterns and variable naming patterns
    - Allows zero units (e.g., `0px`), redundant longhand properties, and duplicate selectors
    - Configures SCSS-specific rules to ignore common directives (`@function`, `@if`, `@mixin`, etc.)
    - Enforces lowercase keywords with camelCase for SVG keywords
    - Sets media feature range notation to "context" with warning severity
  - Consuming projects extend this via `.stylelintrc.json`: `{ "extends": "@hs-web-team/eslint-config-node/.stylelintrc.json" }`
  - Documentation: `examples/stylelint-usage.md`

### Cypress Configuration
- **`cypress.config.js`**: Shared Cypress configuration for E2E testing
  - Uses CommonJS (`require`) syntax
  - Core settings:
    - Disables Chrome web security for cross-origin testing
    - Timeouts: 20s default command, page load, and response timeouts
    - Viewport: 1920x1080
    - Retries: 1 retry in run mode, 0 in open mode
    - Screenshots on failure enabled, video disabled by default
  - Includes Cucumber preprocessor setup with webpack
  - TypeScript support via ts-loader
  - Spec pattern: `cypress/e2e/*.cy.js`
  - Exported utilities:
    - `config`: Main Cypress configuration object
    - `envs`: Environment constants (DEV, QA, PROD)
    - `getDevBaseUrl()`: Reads baseUrl from `hubspot.config.yml` DEV portal
    - `getBaseUrls()`: Reads URLs from `.ci/config.yml` for multiple environments
  - HubSpot-specific: Designed to work with HubSpot CMS projects using `hubspot.config.yml`
  - Documentation: `examples/cypress-usage.md`

### Package Details
- **Type**: ESM module (`"type": "module"`)
- **Node requirement**: >= 22
- **Exports**:
  - Main export (`.`): `index.js` - Node.js ESLint configuration
  - Browser export (`./browser`): `browser.js` - Browser/React ESLint configuration
  - Prettier export (`./.prettierrc.json`): `.prettierrc.json` - Prettier configuration
  - Stylelint export (`./.stylelintrc.json`): `.stylelintrc.json` - Stylelint configuration
  - Cypress export (`./cypress.config`): `cypress.config.js` - Cypress configuration
- **Binary command**: `add-prettier` maps to `bin/add-prettier-scripts.js`

### Migration Context
This package is currently on v3, which uses ESLint 9's flat config format. The project has migrated from:
- v1 → v2: See `docs/MIGRATION-V2.md`
- v2 → v3: See `docs/MIGRATION-V3.md` (ESLint 9 flat config migration requiring Node.js 22+)

## Important Notes

- This package supports multiple use cases:
  - **ESLint**: Backend Node.js projects (default export) and browser/React projects (`/browser` export)
  - **Prettier**: Code formatting (`./.prettierrc.json` export)
  - **Stylelint**: SCSS/CSS linting (`./.stylelintrc.json` export)
  - **Cypress**: E2E testing (`./cypress.config` export)
- ESLint configuration uses ESLint 9's flat config format (not the legacy `.eslintrc` format)
- Downstream projects extend configs:
  - ESLint (Node.js): `...wtConfig` in `eslint.config.js`
  - ESLint (Browser): `...wtBrowserConfig` in `eslint.config.js`
  - Prettier: Import via `.prettierrc.js` using `require('@hs-web-team/eslint-config-node/.prettierrc.json')`
  - Stylelint: Extend in `.stylelintrc.json` with `"extends": "@hs-web-team/eslint-config-node/.stylelintrc.json"`
  - Cypress: Import and spread in `cypress.config.js`
- Mixed module systems:
  - Main package is ESM (`index.js`, `browser.js`)
  - Utility scripts use CommonJS (`bin/add-prettier-scripts.js`, `cypress.config.js`)
- CI runs on Node 22 and 24 (see `.github/workflows/pr.yml`)
- No automated tests currently (`npm test` will fail with "Error: no test specified")
- Detailed documentation available in `examples/`:
  - `browser-usage.md` - Browser/React ESLint configuration
  - `stylelint-usage.md` - Stylelint configuration
  - `cypress-usage.md` - Cypress E2E testing configuration
