# Cypress Configuration Usage

This package provides a shared Cypress configuration for E2E testing in HubSpot Marketing WebTeam projects.

## Installation

Install the package and Cypress:

```bash
npm install --save-dev @hs-web-team/eslint-config-node cypress
```

All other dependencies (`esbuild`, `js-yaml`, `@bahmutov/cypress-esbuild-preprocessor`, `@badeball/cypress-cucumber-preprocessor`) are bundled with this package.

## Usage

### Basic Setup

Create a `cypress.config.js` file in your project root:

```javascript
const { defineConfig } = require('cypress');
const { config } = require('@hs-web-team/eslint-config-node/cypress.config');

module.exports = defineConfig({
  ...config,
  e2e: {
    ...config.e2e,
    baseUrl: 'http://localhost:3000',
  },
});
```

### With HubSpot Projects

For HubSpot CMS projects that use `hubspot.config.yml`:

```javascript
const { defineConfig } = require('cypress');
const { config, envs, getBaseUrls } = require('@hs-web-team/eslint-config-node/cypress.config');

const baseUrls = getBaseUrls();

module.exports = defineConfig({
  ...config,
  e2e: {
    ...config.e2e,
    baseUrl: baseUrls.qa,
  },
  env: {
    ...envs,
    baseUrls,
  },
});
```

## What's Included

### Core Configuration

- **Chrome Web Security**: Disabled for cross-origin testing
- **Timeouts**: 20s for default command, page load, and response
- **Viewport**: 1920x1080
- **Port**: 3500 (Cypress dev server)
- **Retries**: 1 in run mode, 0 in open mode
- **Screenshots**: Enabled on failure
- **Video**: Disabled by default
- **Tests kept in memory**: 0 (prevents memory issues)
- **Trash assets before runs**: Enabled

### E2E Configuration

- **Spec pattern**: `cypress/e2e/*.cy.js`
- **Cucumber support**: Includes Cucumber preprocessor setup with esbuild
- **TypeScript support**: Native via esbuild, no additional loader needed

### Exports

| Export | Description |
|--------|-------------|
| `config` | Main Cypress configuration object |
| `envs` | Environment constants (`DEV`, `QA`, `PROD`, `currentEnv`) |
| `setupNodeEvents` | The `setupNodeEvents` function (for custom extension) |
| `getDevBaseUrl()` | Reads `baseUrl` from the DEV portal in `hubspot.config.yml` |
| `getBaseUrls()` | Reads URLs for all environments from `.ci/config.yml` |

#### `envs`

```javascript
{
  currentEnv: 'qa',
  DEV: 'DEV',
  QA: 'qa',
  PROD: 'prod',
}
```

#### `getDevBaseUrl()`

Returns the `baseUrl` from the `DEV` portal in `hubspot.config.yml`, or `null` if not found.

**Requirements**: `hubspot.config.yml` must exist and the DEV portal must have a `baseUrl` property.

#### `getBaseUrls()`

Returns base URLs for all environments:

```javascript
// Returns: { DEV: '...', qa: '...', prod: '...' }
```

The `DEV` key comes from `getDevBaseUrl()`. The `qa` and `prod` keys come from `.ci/config.yml`:

```yaml
regression:
  e2eTestEnvironment:
    - name: qa
      url: https://qa.example.com
    - name: prod
      url: https://prod.example.com
```

## Customizing Configuration

### Add Custom setupNodeEvents

`setupNodeEvents` is embedded in `config.e2e`. If you override it without calling the package's version, you'll lose the Cucumber preprocessor and esbuild setup.

Import `setupNodeEvents` directly and call it first:

```javascript
const { defineConfig } = require('cypress');
const { config, setupNodeEvents: wtSetupNodeEvents } = require('@hs-web-team/eslint-config-node/cypress.config');

module.exports = defineConfig({
  ...config,
  e2e: {
    ...config.e2e,
    async setupNodeEvents(on, cfg) {
      await wtSetupNodeEvents(on, cfg);

      on('task', {
        log(message) {
          console.log(message);
          return null;
        },
      });

      return cfg;
    },
  },
});
```

If you don't need custom node events, omit `setupNodeEvents` entirely and just spread `...config.e2e`.

## Cucumber/BDD Support

The configuration includes Cucumber preprocessor setup automatically. Create `.cypress-cucumber-preprocessorrc.json` in your project root:

```json
{
  "stepDefinitions": "cypress/support/step_definitions/**/*.{js,ts}",
  "json": {
    "enabled": true,
    "output": "cypress/results/cucumber-report.json"
  }
}
```

## Troubleshooting

### Environment Configuration Not Loading

Ensure your project has the required configuration files:
- `hubspot.config.yml` for HubSpot projects
- `.ci/config.yml` for multi-environment setups
