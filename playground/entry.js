import { Linter } from 'eslint/universal';
import jsPlugin from '@eslint/js';
import { hsWebTeamPlugin } from '../plugins/hs-web-team/index.js';
import { nodeBaseRules, browserBaseRules } from '../base-rules.js';

const linter = new Linter();

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

  getRuleUrl(ruleId) {
    if (ruleId.startsWith('hs-web-team/')) {
      const ruleName = ruleId.replace('hs-web-team/', '');
      return `${PLAYGROUND_REPO_URL}/blob/${PLAYGROUND_GIT_REF}/plugins/hs-web-team/rules/${ruleName}.js`;
    }
    return `https://eslint.org/docs/latest/rules/${ruleId}`;
  },
};
