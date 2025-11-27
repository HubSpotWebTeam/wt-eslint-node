import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';

// Base rules for all JavaScript files
const baseRules = {
  'no-console': [
    'error',
    {
      allow: ['info', 'warn', 'error'],
    },
  ],
  camelcase: 'off',
  'comma-dangle': ['warn', 'always-multiline'],
  'arrow-parens': 0,
  'no-plusplus': 0,
  'no-underscore-dangle': [
    'error',
    {
      allow: [
        '__dirname',
        '__filename',
        '_hsg',
        '_hsq',
      ]
    }
  ],
  'no-confusing-arrow': 0,
  'import/no-unresolved': 0,
  'import/prefer-default-export': 0,
  'no-trailing-spaces': ['error', { skipBlankLines: true }],
  'no-unused-expressions': ['warn', { allowTernary: true }],
  'max-len': [
    2,
    {
      code: 120,
      ignoreStrings: true,
      ignoreTemplateLiterals: true,
    },
  ],
  'operator-linebreak': 0,
  'implicit-arrow-linebreaks': 0,
  'implicit-arrow-linebreak': 0,
  'object-curly-newline': 0,
  'newline-per-chained-call': 0,
  indent: 0,
  'function-paren-newline': 0,
};

// Common ignore patterns
const commonIgnores = [
  '**/node_modules/**',
  '**/.serverless/**',
  '**/.webpack/**',
  '**/dist/**',
  'eslint.config.js',
];

export default defineConfig([
  // Base config for all JavaScript files
  {
    files: ['**/*.{js,mjs,cjs}'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: {
      globals: {...globals.node, ...globals.es2022, ...globals.jest},
    },
    ignores: commonIgnores,
    rules: baseRules,
  },
  // TypeScript config that extends the base config
  {
    files: ['**/*.{ts,mts,cts,tsx}'],
    ...tseslint.configs.recommended,
    // You can add or override rules specific to TypeScript here
    rules: {
      ...baseRules,
      // Add any TypeScript-specific rules here
    },
  },
]);
