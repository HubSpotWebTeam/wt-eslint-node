import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';

// Base rules adapted from the browser config
const baseRules = {
  'comma-dangle': 'warn',
  'no-param-reassign': ['warn', { props: false }],
  'arrow-parens': 0,
  'no-plusplus': 0,
  'no-console': ['error', { allow: ['warn', 'error'] }],
  'no-confusing-arrow': 0,
  'no-trailing-spaces': ['error', { skipBlankLines: true }],
  'no-unused-expressions': ['warn', { allowTernary: true }],
  'max-len': [
    2,
    {
      code: 120,
      ignoreStrings: true,
      ignoreTemplateLiterals: true
    }
  ],
  'operator-linebreak': 0,
  'implicit-arrow-linebreak': 0,
  indent: 0,
  'object-curly-newline': 0,
  'function-paren-newline': 0,
  'nonblock-statement-body-position': 0
};

// React-specific rules
const reactRules = {
  'react/prefer-stateless-function': 'off',
  'react/no-array-index-key': 0,
  'react/destructuring-assignment': 0,
  'react/require-default-props': 0,
  'react/self-closing-comp': [
    2,
    {
      component: true,
      html: false
    }
  ],
  'react/forbid-prop-types': 0
};

// Common ignore patterns
const commonIgnores = [
  '**/node_modules/**',
  '**/dist/**',
  '**/build/**',
  '**/.next/**',
  '**/coverage/**',
  'eslint.config.js'
];

export default [
  // Global ignores
  {
    ignores: commonIgnores
  },
  // Base config for all JavaScript files
  js.configs.recommended,
  {
    files: ['**/*.{js,mjs,cjs,jsx}'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.es2021,
        ...globals.jest,
        // Custom browser globals from original config
        $: true,
        jQuery: true,
        Invoca: true
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    rules: {
      ...baseRules
    }
  },
  // React configuration
  {
    files: ['**/*.{js,mjs,cjs,jsx}'],
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'jsx-a11y': jsxA11yPlugin
    },
    settings: {
      react: {
        version: 'detect'
      }
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      ...jsxA11yPlugin.configs.recommended.rules,
      ...reactRules
    }
  },
  // TypeScript config
  ...tseslint.configs.recommended.map(config => ({
    ...config,
    files: ['**/*.{ts,mts,cts,tsx}']
  })),
  {
    files: ['**/*.{ts,mts,cts,tsx}'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.es2021,
        ...globals.jest,
        $: true,
        jQuery: true,
        Invoca: true
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    rules: {
      ...baseRules
    }
  },
  // React configuration for TypeScript files
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'jsx-a11y': jsxA11yPlugin
    },
    settings: {
      react: {
        version: 'detect'
      }
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      ...jsxA11yPlugin.configs.recommended.rules,
      ...reactRules
    }
  }
];
