import globals from 'globals';

// Underscore-prefixed HubSpot platform globals (e.g. window._hsq, window._hsg.__ip_lookup).
// Exported so consuming projects can extend this list with their own no-underscore-dangle
// allowances without duplicating the shared entries, e.g.:
//   allow: [...underscoreDangleAllowlist, 'myProjectGlobal']
export const underscoreDangleAllowlist = ['_hsg', '_hsp', '_hsq', '__ip_lookup'];

export const nodeGlobals = { ...globals.node, ...globals.es2022, ...globals.jest };

export const browserGlobals = {
  ...globals.browser,
  ...globals.es2021,
  ...globals.jest,
  $: true,
  jQuery: true,
  Invoca: true,
};

export const nodeBaseRules = {
  'no-console': ['error', { allow: ['info', 'warn', 'error'] }],
  camelcase: 'off',
  'comma-dangle': ['warn', 'always-multiline'],
  'arrow-parens': 0,
  'no-plusplus': 0,
  'no-underscore-dangle': ['error', { allow: ['__dirname', '__filename'] }],
  'no-confusing-arrow': 0,
  'import/no-unresolved': 0,
  'import/prefer-default-export': 0,
  'no-trailing-spaces': ['error', { skipBlankLines: true }],
  'no-unused-expressions': ['warn', { allowTernary: true }],
  'max-len': [2, { code: 120, ignoreStrings: true, ignoreTemplateLiterals: true }],
  'operator-linebreak': 0,
  'implicit-arrow-linebreaks': 0,
  'implicit-arrow-linebreak': 0,
  'object-curly-newline': 0,
  'newline-per-chained-call': 0,
  indent: 0,
  'function-paren-newline': 0,
  'max-params': ['warn', { max: 3 }],
};

export const browserBaseRules = {
  'comma-dangle': ['warn', 'always-multiline'],
  'no-param-reassign': ['warn', { props: false }],
  'arrow-parens': 0,
  'no-plusplus': 0,
  'no-console': ['error', { allow: ['warn', 'error'] }],
  'no-confusing-arrow': 0,
  'no-underscore-dangle': ['error', { allow: underscoreDangleAllowlist }],
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
