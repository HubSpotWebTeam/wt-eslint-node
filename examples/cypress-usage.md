# Cypress Configuration Usage

This package provides a shared Cypress configuration for E2E testing in HubSpot Marketing WebTeam projects.

## Installation

1. Install the package and Cypress dependencies:

```bash
npm install --save-dev @hs-web-team/eslint-config-node cypress @cypress/webpack-preprocessor @badeball/cypress-cucumber-preprocessor webpack ts-loader js-yaml
```

2. If using TypeScript:

```bash
npm install --save-dev typescript @types/node
```

## Usage

### Basic Setup

Create a `cypress.config.js` file in your project root:

```javascript
const { defineConfig } = require('cypress');
const { config, envs, getBaseUrls } = require('@hs-web-team/eslint-config-node/cypress.config');

module.exports = defineConfig({
  ...config,
  e2e: {
    ...config.e2e,
    baseUrl: 'http://localhost:3000', // Your app's base URL
    // Add custom e2e options here
  },
  env: {
    ...envs,
    // Add custom environment variables
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
    baseUrl: baseUrls.qa || baseUrls.DEV, // Use QA or DEV environment
  },
  env: {
    ...envs,
    baseUrls,
  },
});
```

## What's Included

### Core Configuration

The shared configuration includes:

- **Chrome Web Security**: Disabled (`chromeWebSecurity: false`) for cross-origin testing
- **Timeouts**:
  - Default command timeout: 20 seconds
  - Page load timeout: 20 seconds
  - Response timeout: 20 seconds
- **Test Settings**:
  - Port: 3500
  - Viewport: 1920x1080
  - Tests kept in memory: 0 (prevents memory issues)
- **Retries**:
  - Run mode: 1 retry
  - Open mode: 0 retries
- **Screenshots**: Enabled on failure
- **Video**: Disabled by default
- **Trash assets before runs**: Enabled

### E2E Configuration

- **Spec Pattern**: `cypress/e2e/*.cy.js`
- **Cucumber Support**: Includes Cucumber preprocessor setup
- **TypeScript Support**: Configured with ts-loader for `.ts` files
- **Webpack Preprocessor**: Handles `.feature` files and TypeScript

### Environment Utilities

The configuration exports utility functions:

#### `envs`
Pre-configured environment constants:
```javascript
const envs = {
  currentEnv: 'qa', // Default environment
  DEV: 'DEV',
  QA: 'qa',
  PROD: 'prod',
};
```

#### `getDevBaseUrl()`
Retrieves the `baseUrl` from the `DEV` portal in `hubspot.config.yml`:

```javascript
const devUrl = getDevBaseUrl(); // Returns baseUrl or null
```

**Requirements**:
- Project must have a `hubspot.config.yml` file
- DEV portal must have a `baseUrl` property configured

#### `getBaseUrls()`
Retrieves base URLs for all environments from `.ci/config.yml`:

```javascript
const urls = getBaseUrls();
// Returns: { DEV: '...', qa: '...', prod: '...' }
```

**Requirements**:
- `.ci/config.yml` file with `regression.e2eTestEnvironment` configuration
- Format:
  ```yaml
  regression:
    e2eTestEnvironment:
      - name: qa
        url: https://qa.example.com
      - name: prod
        url: https://prod.example.com
  ```

## Project Structure

### Recommended Folder Structure

```
project-root/
├── cypress/
│   ├── e2e/
│   │   ├── login.cy.js
│   │   └── homepage.cy.js
│   ├── fixtures/
│   │   └── users.json
│   ├── support/
│   │   ├── commands.js
│   │   └── e2e.js
│   └── downloads/
├── cypress.config.js
└── package.json
```

### For Cucumber/BDD Testing

```
project-root/
├── cypress/
│   ├── e2e/
│   │   └── features/
│   │       ├── login.feature
│   │       └── homepage.feature
│   ├── support/
│   │   ├── step_definitions/
│   │   │   ├── login.ts
│   │   │   └── homepage.ts
│   │   └── e2e.ts
└── cypress.config.js
```

## Add Scripts to package.json

Add Cypress scripts to your `package.json`:

```json
{
  "scripts": {
    "cypress:open": "cypress open",
    "cypress:run": "cypress run",
    "cypress:run:chrome": "cypress run --browser chrome",
    "cypress:run:headed": "cypress run --headed",
    "test:e2e": "cypress run"
  }
}
```

Then run:
- `npm run cypress:open` - Open Cypress Test Runner (interactive)
- `npm run cypress:run` - Run all tests headlessly
- `npm run test:e2e` - Run E2E tests (alias for cypress:run)

## Customizing Configuration

### Override Default Values

```javascript
const { defineConfig } = require('cypress');
const { config } = require('@hs-web-team/eslint-config-node/cypress.config');

module.exports = defineConfig({
  ...config,
  // Override specific values
  defaultCommandTimeout: 30000,
  viewportWidth: 1280,
  viewportHeight: 720,
  video: true, // Enable video recording
  e2e: {
    ...config.e2e,
    baseUrl: 'http://localhost:8080',
    specPattern: 'cypress/integration/**/*.spec.js',
  },
});
```

### Add Custom setupNodeEvents

```javascript
const { defineConfig } = require('cypress');
const { config } = require('@hs-web-team/eslint-config-node/cypress.config');

module.exports = defineConfig({
  ...config,
  e2e: {
    ...config.e2e,
    async setupNodeEvents(on, cypressConfig) {
      // Call shared setup first
      const updatedConfig = await config.e2e.setupNodeEvents(on, cypressConfig);

      // Add your custom tasks/events
      on('task', {
        log(message) {
          console.log(message);
          return null;
        },
      });

      return updatedConfig;
    },
  },
});
```

## Integration with CI/CD

### GitHub Actions Example

```yaml
name: E2E Tests
on: [push, pull_request]

jobs:
  cypress-run:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 22

      - name: Install dependencies
        run: npm ci

      - name: Run Cypress tests
        uses: cypress-io/github-action@v6
        with:
          start: npm start
          wait-on: 'http://localhost:3000'
```

## TypeScript Support

The configuration includes TypeScript support. Create a `tsconfig.json` for Cypress:

```json
{
  "compilerOptions": {
    "target": "ES2021",
    "lib": ["ES2021", "DOM"],
    "types": ["cypress", "node"],
    "moduleResolution": "node",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "strict": true
  },
  "include": ["cypress/**/*.ts"],
  "exclude": ["node_modules"]
}
```

## Cucumber/BDD Support

The configuration includes Cucumber preprocessor setup. To use it:

1. Install dependencies:
```bash
npm install --save-dev @badeball/cypress-cucumber-preprocessor
```

2. Create `.cypress-cucumber-preprocessorrc.json`:
```json
{
  "stepDefinitions": "cypress/support/step_definitions/**/*.{js,ts}",
  "json": {
    "enabled": true,
    "output": "cypress/results/cucumber-report.json"
  }
}
```

3. Write feature files in `cypress/e2e/features/`:
```gherkin
Feature: Login

  Scenario: User can login successfully
    Given I visit the login page
    When I enter valid credentials
    Then I should see the dashboard
```

## Troubleshooting

### Module Not Found Errors

Ensure all required dependencies are installed:
```bash
npm install --save-dev cypress @cypress/webpack-preprocessor webpack ts-loader js-yaml
```

### Webpack Compilation Errors

If using Cucumber, ensure `@badeball/cypress-cucumber-preprocessor` is installed:
```bash
npm install --save-dev @badeball/cypress-cucumber-preprocessor
```

### Environment Configuration Not Loading

Ensure your project has the required configuration files:
- `hubspot.config.yml` for HubSpot projects
- `.ci/config.yml` for multi-environment setups

### Memory Issues

The configuration sets `numTestsKeptInMemory: 0` to prevent memory issues. If you still experience problems, consider:
- Running tests in smaller batches
- Increasing Node.js memory: `NODE_OPTIONS=--max_old_space_size=4096 cypress run`
