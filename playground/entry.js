import { Linter } from 'eslint/universal';
import jsPlugin from '@eslint/js';
import { hsWebTeamPlugin } from '../plugins/hs-web-team/index.js';

const linter = new Linter();

const nodeBaseRules = {
  'no-console': ['error', { allow: ['info', 'warn', 'error'] }],
  camelcase: 'off',
  'comma-dangle': ['warn', 'always-multiline'],
  'arrow-parens': 0,
  'no-plusplus': 0,
  'no-underscore-dangle': ['error', { allow: ['__dirname', '__filename'] }],
  'no-confusing-arrow': 0,
  'no-trailing-spaces': ['error', { skipBlankLines: true }],
  'no-unused-expressions': ['warn', { allowTernary: true }],
  'max-len': [2, { code: 120, ignoreStrings: true, ignoreTemplateLiterals: true }],
  'operator-linebreak': 0,
  'implicit-arrow-linebreak': 0,
  'object-curly-newline': 0,
  'newline-per-chained-call': 0,
  indent: 0,
  'function-paren-newline': 0,
  'max-params': ['warn', { max: 3 }],
};

const browserBaseRules = {
  'comma-dangle': ['warn', 'always-multiline'],
  'no-param-reassign': ['warn', { props: false }],
  'arrow-parens': 0,
  'no-plusplus': 0,
  'no-console': ['error', { allow: ['warn', 'error'] }],
  'no-confusing-arrow': 0,
  'no-underscore-dangle': ['error', { allow: ['_hsg', '_hsp', '_hsq', '__ip_lookup'] }],
  'no-trailing-spaces': ['error', { skipBlankLines: true }],
  'no-unused-expressions': ['warn', { allowTernary: true }],
  'max-len': [2, { code: 120, ignoreStrings: true, ignoreTemplateLiterals: true }],
  'operator-linebreak': 0,
  'implicit-arrow-linebreak': 0,
  indent: 0,
  'object-curly-newline': 0,
  'function-paren-newline': 0,
  'nonblock-statement-body-position': 0,
  'max-params': ['warn', { max: 3 }],
};

const configs = {
  node: [{ rules: jsPlugin.configs.recommended.rules }, hsWebTeamPlugin.configs.recommended, { rules: nodeBaseRules }],
  browser: [
    { rules: jsPlugin.configs.recommended.rules },
    hsWebTeamPlugin.configs.recommended,
    { rules: browserBaseRules },
  ],
  'custom-only': [hsWebTeamPlugin.configs.recommended],
};

window.playground = {
  lint(code, configName = 'node') {
    return linter.verify(code, configs[configName] ?? configs.node, {
      filename: 'test.js',
    });
  },

  getConfigs() {
    return Object.keys(configs);
  },

  getRules(configName = 'node') {
    const merged = {};
    for (const config of configs[configName] ?? configs.node) {
      if (config.rules) Object.assign(merged, config.rules);
    }
    return merged;
  },

  getCustomRuleNames() {
    return Object.keys(hsWebTeamPlugin.rules).map(name => `hs-web-team/${name}`);
  },
};
