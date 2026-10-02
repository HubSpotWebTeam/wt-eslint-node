import { Linter } from 'eslint/universal';
import jsPlugin from '@eslint/js';
import { hsWebTeamPlugin } from '../plugins/hs-web-team/index.js';
import { nodeBaseRules, browserBaseRules, nodeGlobals, browserGlobals } from '../base-rules.js';

const linter = new Linter();
const jsRecommendedRules = { rules: jsPlugin.configs.recommended.rules };
const customRecommended = hsWebTeamPlugin.configs.recommended;

const configs = {
  node: [jsRecommendedRules, customRecommended, { languageOptions: { globals: nodeGlobals }, rules: nodeBaseRules }],
  browser: [
    jsRecommendedRules,
    customRecommended,
    { languageOptions: { globals: browserGlobals }, rules: browserBaseRules },
  ],
  'custom-only': [customRecommended],
};

window.playground = {
  lint(code, configName = 'node') {
    return linter.verify(code, configs[configName] ?? configs.node, { filename: 'test.js' });
  },

  getRules(configName = 'node') {
    return Object.assign({}, ...(configs[configName] ?? configs.node).map(config => config.rules).filter(Boolean));
  },

  getCustomRuleNames() {
    return Object.keys(hsWebTeamPlugin.rules).map(name => `hs-web-team/${name}`);
  },

  getRuleUrl(ruleId) {
    if (ruleId.startsWith('hs-web-team/')) {
      return `${PLAYGROUND_REPO_URL}/blob/${PLAYGROUND_GIT_REF}/plugins/hs-web-team/rules/${ruleId.slice('hs-web-team/'.length)}.js`;
    }
    return `https://eslint.org/docs/latest/rules/${ruleId}`;
  },
};
