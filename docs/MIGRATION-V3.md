# Migration from v2 to v3

## Steps to migrate

> **Note**
>
> This migration requires Node.js v22 or higher and a **manual migration** from `.eslintrc` to `eslint.config.mjs`.

- [ ] Upgrade to Node.js v22 or higher
- [ ] Upgrade ESLint to v9: `npm install eslint@^9 --save-dev`
- [ ] Update the package: `npm install @hs-web-team/eslint-config-node@latest`
- [ ] **Remove** `@hs-web-team/eslint-config-ts` from dependencies (no longer needed - TypeScript support is now included)
- [ ] Manually create `eslint.config.mjs` (see [Manual Migration Guide](#manual-migration-guide) below)
- [ ] Delete `.eslintrc` file
- [ ] Run `npm run lint` to check for any errors
- [ ] Fix any linting errors
- [ ] Commit the changes
- [ ] Create a PR
- [ ] Get it approved
- [ ] Merge it into `main`
- [ ] Test everything in QA
- [ ] Celebrate! 🎉

> **Important**
>
> The automated migration script (`npx @eslint/migrate-config .eslintrc`) **will not work** for most projects migrating from ESLint 8 to ESLint 9. You must manually create the new `eslint.config.js` file.
>
> This is because:
> - ESLint 9 uses a completely different flat config format
> - The `@hs-web-team/eslint-config-ts` package is no longer needed (TypeScript support is built-in)
> - Many ESLint plugins have changed their configuration APIs

## Manual Migration Guide

### Before: Typical `.eslintrc` file

```json
{
  "extends": [
    "@hs-web-team/eslint-config-node",
    "@hs-web-team/eslint-config-ts"
  ],
  "rules": {
    "no-restricted-syntax": 0,
    "no-console": 0,
    "no-param-reassign": 0,
    "no-await-in-loop": 0,
    "max-classes-per-file": 0,
    "import/no-extraneous-dependencies": 0,
    "@typescript-eslint/no-unused-vars": ["error", { "vars": "all", "args": "after-used", "ignoreRestSiblings": true }],
    "@typescript-eslint/no-unnecessary-condition": "error"
  },
  "overrides": [
    {
      "files": ["*.test.ts", "*.spec.ts"],
      "rules": {
        "no-unused-expressions": "off"
      }
    }
  ],
  "env": {
    "jest": true
  },
  "parserOptions": {
    "project": "./tsconfig.json"
  },
  "globals": {
    "window": true
  }
}
```

### After: New `eslint.config.mjs` file

```javascript
import wtConfig from '@hs-web-team/eslint-config-node';
import tseslint from 'typescript-eslint';

export default [
  // Spread the base config (includes both JS and TS configs)
  ...wtConfig,

  // Add custom rules for all files
  {
    rules: {
      'no-restricted-syntax': 'off',
      'no-console': 'off',
      'no-param-reassign': 'off',
      'no-await-in-loop': 'off',
      'max-classes-per-file': 'off',
      'import/no-extraneous-dependencies': 'off',
    },
  },

  // TypeScript-specific rules (applied only to TS files)
  {
    files: ['**/*.{ts,mts,cts,tsx}'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { vars: 'all', args: 'after-used', ignoreRestSiblings: true }
      ],
      '@typescript-eslint/no-unnecessary-condition': 'error',
    },
  },

  // Test file overrides
  {
    files: ['**/*.test.{ts,js}', '**/*.spec.{ts,js}'],
    rules: {
      'no-unused-expressions': 'off',
    },
  },

  // Global variables (if needed)
  {
    languageOptions: {
      globals: {
        window: 'readonly',
      },
    },
  },
];
```

### Key Migration Changes

1. **No separate TypeScript config needed**: TypeScript support is now included in `@hs-web-team/eslint-config-node`, so you can remove `@hs-web-team/eslint-config-ts` from your dependencies.

2. **Environment variables**: The `env` property is replaced with `languageOptions.globals`. Jest globals are already included in the base config, so you don't need to specify them again.

3. **Parser options**: Move `parserOptions` inside `languageOptions.parserOptions` and apply only to TypeScript files.

4. **Overrides become separate objects**: Instead of `overrides` array, create separate configuration objects with `files` patterns.

5. **Use `'off'` instead of `0`**: While numbers still work, the string values (`'off'`, `'warn'`, `'error'`) are more readable.

6. **Import as ES module**: Use `import` instead of `require`.

## Extending the Configuration

Once you've completed the migration, you can easily extend the configuration for specific needs:

### Adding Rules for Specific File Patterns

```javascript
import wtConfig from '@hs-web-team/eslint-config-node';

export default [
  ...wtConfig,
  {
    files: ['src/**/*.js'],
    rules: {
      'no-restricted-imports': ['error', 'lodash'],
    },
  },
];
```

### Adding Custom Plugins

```javascript
import wtConfig from '@hs-web-team/eslint-config-node';
import securityPlugin from 'eslint-plugin-security';

export default [
  ...wtConfig,
  {
    plugins: {
      security: securityPlugin,
    },
    rules: {
      'security/detect-object-injection': 'warn',
    },
  },
];
```

### Adding Custom Ignores

```javascript
import wtConfig from '@hs-web-team/eslint-config-node';

export default [
  ...wtConfig,
  {
    ignores: [
      '**/coverage/**',
      '**/build/**',
      '**/*.config.js',
    ],
  },
];
```

### Complex Example with Multiple Customizations

```javascript
import wtConfig from '@hs-web-team/eslint-config-node';
import importPlugin from 'eslint-plugin-import';

export default [
  ...wtConfig,

  // Global overrides
  {
    rules: {
      'no-console': 'off',
      'max-len': ['error', { code: 100 }],
    },
  },

  // Import plugin configuration
  {
    plugins: {
      import: importPlugin,
    },
    rules: {
      'import/order': ['error', { 'newlines-between': 'always' }],
      'import/no-duplicates': 'error',
    },
  },

  // TypeScript-specific configuration
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    rules: {
      '@typescript-eslint/strict-boolean-expressions': 'error',
    },
  },

  // Test files
  {
    files: ['**/*.test.{js,ts}', '**/__tests__/**'],
    rules: {
      'max-len': 'off',
      'no-magic-numbers': 'off',
    },
  },

  // Additional ignores
  {
    ignores: ['**/generated/**', '**/migrations/**'],
  },
];
```

## Common Issues

### Module Type Warning

If you created `eslint.config.js` instead of `eslint.config.mjs`, you may see this warning when running ESLint:

```bash
(node:40504) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///path/to/your/project/eslint.config.js?mtime=1762786140088 is not specified and it doesn't parse as CommonJS.
Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
To eliminate this warning, add "type": "module" to /path/to/your/project/package.json.
```

**Why this happens:** This ESLint config package uses ES modules (`"type": "module"`), and your `eslint.config.js` imports it using ES module syntax. If your project's `package.json` doesn't specify the module type, Node.js has to parse the file twice, causing the warning.

**Solution (choose one):**

**Option 1 (Recommended for CommonJS projects):** Rename the config file to explicitly mark it as an ES module:

```bash
mv eslint.config.js eslint.config.mjs
```

This is the recommended approach because it doesn't require any changes to your existing codebase.

**Option 2 (Only if already using ES modules):** Add to your project's `package.json`:

```jsonc
{
  "type": "module"
}
```

> **Warning:** Option 2 requires migrating your entire project from CommonJS to ES modules. All `.js` files must use ES module syntax (import/export) or be renamed to `.cjs`. Only use this option if your project is already using ES modules throughout.
