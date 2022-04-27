module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
  },
  ignorePatterns: ['/node_modules/', '/.serverless/', '/.eslintrc.js', '/.webpack/'],
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    'no-console': 0,
    camelcase: 0,
    'comma-dangle': 1,
    'arrow-parens': 0,
    'no-plusplus': 0,
    'no-underscore-dangle': 0,
    'no-confusing-arrow': 0,
    'import/no-unresolved': 0,
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
  },
};