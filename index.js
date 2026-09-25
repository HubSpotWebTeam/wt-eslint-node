import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import { claudeCodePlugin } from './plugins/claude-code/index.js';
import { hsWebTeamPlugin } from './plugins/hs-web-team/index.js';
import { nodeBaseRules as baseRules, nodeGlobals } from './base-rules.js';

// Common ignore patterns
const commonIgnores = ['**/node_modules/**', '**/.serverless/**', '**/.webpack/**', '**/dist/**'];

export default [
  // Global ignores
  {
    ignores: commonIgnores,
  },
  // Base recommended rules — scoped to JS/TS so they never run against
  // non-JS languages (e.g. the markdown used for CLAUDE.md below).
  { ...js.configs.recommended, files: ['**/*.{js,mjs,cjs,jsx,ts,mts,cts,tsx}'] },
  {
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: {
      globals: nodeGlobals,
    },
    rules: baseRules,
  },
  hsWebTeamPlugin.configs.recommended,
  // TypeScript config - restrict to TypeScript files only
  ...tseslint.configs.recommended.map(config => ({
    ...config,
    files: ['**/*.{ts,mts,cts,tsx}'],
  })),
  {
    files: ['**/*.{ts,mts,cts,tsx}'],
    languageOptions: {
      globals: nodeGlobals,
    },
    rules: baseRules,
  },
  // CLAUDE.md and SKILL.md context-file checks (see plugins/claude-code)
  ...claudeCodePlugin.configs.recommended,
];
