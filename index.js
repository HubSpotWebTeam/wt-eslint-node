module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
  },
  ignorePatterns: ['/node_modules/', '/.serverless/', '/.eslintrc.js', '/.webpack/'],
  extends: ['airbnb-base'],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    'no-console': [
      'error',
      {
        allow: ['info', 'warn', 'error'],
      },
    ],
    camelcase: 0,
    'comma-dangle': 1,
    'arrow-parens': 0,
    'no-plusplus': 0,
    'no-underscore-dangle': 0,
    'no-confusing-arrow': 0,
    'import/no-unresolved': 0,
    'import/prefer-default-export': 0,
    'no-trailing-spaces': [2, { skipBlankLines: true }],
    'no-unused-expressions': [1, { allowTernary: true }],
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
  },
};
