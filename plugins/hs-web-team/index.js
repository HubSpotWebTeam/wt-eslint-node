import { noAbbreviations } from './rules/no-abbreviations.js';
import { noNonLiteralConstantCase } from './rules/no-non-literal-constant-case.js';
import { noReduceAccumulatorCopy } from './rules/no-reduce-accumulator-copy.js';

export const hsWebTeamPlugin = {
  rules: {
    'no-abbreviations': noAbbreviations,
    'no-non-literal-constant-case': noNonLiteralConstantCase,
    'no-reduce-accumulator-copy': noReduceAccumulatorCopy,
  },
};

// Self-reference allows the plugin to register itself via configs.recommended,
// following the same pattern as typescript-eslint and eslint-plugin-react.
hsWebTeamPlugin.configs = {
  recommended: {
    plugins: { 'hs-web-team': hsWebTeamPlugin },
    rules: {
      'hs-web-team/no-abbreviations': 'warn',
      'hs-web-team/no-non-literal-constant-case': 'warn',
      'hs-web-team/no-reduce-accumulator-copy': 'error',
    },
  },
};
