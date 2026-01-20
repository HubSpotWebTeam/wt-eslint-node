# Browser Configuration Usage

This package now provides a browser configuration in addition to the Node.js configuration.

## Installation

```bash
npm install --save-dev @hs-web-team/eslint-config-node
```

## Usage

Create an `eslint.config.js` file in your browser/React project:

```javascript
import wtBrowserConfig from '@hs-web-team/eslint-config-node/browser';

export default [
  ...wtBrowserConfig,
  // Add your custom overrides here
  {
    rules: {
      // Custom rules
    },
  },
];
```

## What's Included

The browser configuration includes:

- **ESLint recommended rules** for JavaScript
- **TypeScript support** with typescript-eslint
- **React support** with eslint-plugin-react
- **React Hooks** rules with eslint-plugin-react-hooks
- **Accessibility** rules with eslint-plugin-jsx-a11y
- **Browser globals** (window, document, localStorage, etc.)
- **Jest environment** for testing
- **Custom globals**: jQuery, $, Invoca

## Rules Adapted from Original Browser Config

The configuration adapts rules from `@hs-web-team/eslint-config-browser`:

- **Code Style**: 120 character line length, single quotes, trailing commas
- **Console**: Allows `console.warn` and `console.error`
- **React**: Flexible React component patterns
- **Formatting**: Relaxed indentation and linebreak rules (use Prettier for formatting)

## Migrating from Legacy Browser Config

If you're migrating from `@hs-web-team/eslint-config-browser` (ESLint 8):

1. Update your `eslint.config.js` to use flat config format
2. Replace `extends: '@hs-web-team/eslint-config-browser'` with the import shown above
3. Ensure you're using Node.js >= 22
4. Review and adapt any custom rules in your project

## File Patterns

The configuration applies to:

- JavaScript: `**/*.{js,mjs,cjs,jsx}`
- TypeScript: `**/*.{ts,mts,cts,tsx}`

## Ignored Directories

The following directories are automatically ignored:

- `node_modules`
- `dist`
- `build`
- `.next`
- `coverage`
- `eslint.config.js`
