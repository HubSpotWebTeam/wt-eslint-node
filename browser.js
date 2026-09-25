import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import { claudeCodePlugin } from './plugins/claude-code/index.js';
import { hsWebTeamPlugin } from './plugins/hs-web-team/index.js';
import { underscoreDangleAllowlist, browserBaseRules as baseRules, browserGlobals } from './base-rules.js';

export { underscoreDangleAllowlist };

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
      html: false,
    },
  ],
  'react/forbid-prop-types': 0,
};

// Common ignore patterns
const commonIgnores = ['**/node_modules/**', '**/dist/**', '**/build/**', '**/.next/**', '**/coverage/**'];

export default [
  // Global ignores
  {
    ignores: commonIgnores,
  },
  // Base recommended rules — scoped to JS/TS so they never run against
  // non-JS languages (e.g. the markdown used for CLAUDE.md below).
  { ...js.configs.recommended, files: ['**/*.{js,mjs,cjs,jsx,ts,mts,cts,tsx}'] },
  {
    files: ['**/*.{js,mjs,cjs,jsx}'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: browserGlobals,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      ...baseRules,
    },
  },
  // React configuration
  {
    files: ['**/*.{js,mjs,cjs,jsx}'],
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'jsx-a11y': jsxA11yPlugin,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      ...jsxA11yPlugin.configs.recommended.rules,
      ...reactRules,
    },
  },
  hsWebTeamPlugin.configs.recommended,
  // TypeScript config
  ...tseslint.configs.recommended.map(config => ({
    ...config,
    files: ['**/*.{ts,mts,cts,tsx}'],
  })),
  {
    files: ['**/*.{ts,mts,cts,tsx}'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: browserGlobals,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      ...baseRules,
    },
  },
  // React configuration for TypeScript files
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'jsx-a11y': jsxA11yPlugin,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      ...jsxA11yPlugin.configs.recommended.rules,
      ...reactRules,
    },
  },
  // CLAUDE.md and SKILL.md context-file checks (see plugins/claude-code)
  ...claudeCodePlugin.configs.recommended,
];
