# Cypress Configuration Usage

This package provides a shared Cypress configuration for E2E testing in HubSpot Marketing WebTeam projects.

## Installation

For full setup instructions, see the [Cypress Framework Setup](https://git.hubteam.com/pages/MarketingWebTeam/webteam-docs/docs/developers/coding-on-the-web-team/software-testing/cypress-framework-setup/) guide.

```bash
npm i -D cypress@15
```

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
- **Timeouts**: 20s for default command, page load, and response (Cypress default is 4s)
- **Viewport**: 1920x1080
- **Retries**: 1 in run mode, 0 in open mode
- **Video**: Disabled by default
- **Tests kept in memory**: 0 (prevents memory issues)

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

## Migrating from `@hs-web-team/eslint-config-browser`

### 1. Update the import

**JavaScript:**
```javascript
// Before
const { getDevBaseUrl, getBaseUrls, config, envs } = require('@hs-web-team/eslint-config-browser/cypress.config.js');

// After
const { getDevBaseUrl, getBaseUrls, config, envs } = require('@hs-web-team/eslint-config-node/cypress.config');
```

**TypeScript (module format stays the same — ESM `import`/`export default` still works):**
```typescript
// Before
import { getDevBaseUrl, getBaseUrls, config, envs } from '@hs-web-team/eslint-config-browser/cypress.config.js';

// After
import { getDevBaseUrl, getBaseUrls, envs, config as wtConfig } from '@hs-web-team/eslint-config-node/cypress.config';
```

### 2. Remove manual `setupNodeEvents`

Cucumber and esbuild are bundled into `config.e2e.setupNodeEvents`. Remove your manual `setupNodeEvents` function entirely and spread `...config.e2e` to inherit it automatically.

If you need to add custom tasks on top, see [Add Custom setupNodeEvents](#add-custom-setupnodeevents).

### 3. Update the config structure

The old pattern built the full `e2e` object from scratch — repeating settings already in the bundle — then assigned it:

```javascript
const customConfig = { ...config };
const e2e = {
  specPattern: 'cypress/e2e/**/*.feature',
  baseUrl,
  setupNodeEvents, // manual webpack + cucumber setup
  defaultCommandTimeout: 20000, // already in bundle
  retries: { runMode: 1, openMode: 0 }, // already in bundle
  // ...
};
customConfig.e2e = e2e;
module.exports = defineConfig(customConfig);
```

The new pattern spreads `...config.e2e` to inherit bundled settings (including `setupNodeEvents`) and only adds project-specific overrides:

**JavaScript:**
```javascript
module.exports = defineConfig({
  ...config,
  e2e: {
    ...config.e2e,
    specPattern: 'cypress/e2e/**/*.feature',
    baseUrl,
    supportFile: 'cypress/support/e2e.js',
    reporter: 'mochawesome',
    reporterOptions: {
      reportDir: 'cypress/results',
      overwrite: false,
      html: true,
      json: true,
    },
  },
});
```

**TypeScript:**
```typescript
export default defineConfig({
  e2e: {
    ...wtConfig.e2e,
    specPattern: 'cypress/e2e/**/*.feature',
    baseUrl,
    supportFile: 'cypress/support/e2e.ts',
    reporter: 'mochawesome',
    reporterOptions: {
      reportDir: 'cypress/results',
      overwrite: false,
      html: true,
      json: true,
    },
  },
  blockHosts: '*.google-analytics.com',
});
```

### 4. Keep project-specific settings not in the bundle

These are not included in the bundle and must be carried over manually if your project uses them:

- `reporter` and `reporterOptions` (e.g. mochawesome)
- `supportFile`
- `blockHosts`
- `fixturesFolder`, `screenshotsFolder`, `videosFolder`
- `testIsolation`
- `specPattern` (if using `.feature` files — bundle default is `cypress/e2e/*.cy.js`)

## Troubleshooting

### Environment Configuration Not Loading

Ensure your project has the required configuration files:
- `hubspot.config.yml` for HubSpot projects
- `.ci/config.yml` for multi-environment setups
