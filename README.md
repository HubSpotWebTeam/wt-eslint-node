# Hubspot Marketing WebTeam ESLint rules for Node.js

This is a list of ESLint rules that are recommended for use with **Hubspot Marketing WebTeam** projects.

<!-- index-start -->

## Index

- [Setup](#setup)
- [Where to use it](#where-to-use-it)
<!-- index-end -->

## Setup

1. Install as dev dependency

```shell
npm i -D @hs-web-team/eslint-config-node
```

2. Add to `.eslintrc` in project root directory

```json
{
  "extends": "@hs-web-team/eslint-config-node"
}
```

3. Extend the eslint on a project basis by adding rules to `.eslintrc` e.g.

```
{
  "extends": "@hs-web-team/eslint-config-node",
  "settings": {
    "import/resolver": "webpack"
  }
}
```

## Where to use it

This package is intended to be used as a starting point for ESLint rules for Backend Node.js projects, and not for use in browser environments.
