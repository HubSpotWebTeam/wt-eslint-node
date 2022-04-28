# Hubspot Marketing WebTeam ESLing rules for Node.js

This is a list of ESLint rules that are recommended for use with **Hubspot Marketing WebTeam** projects.

<!-- index-start -->
## Index

- [Setup](#setup)
- [Where to use it](#where-to-use-it)
<!-- index-end -->

## Setup

1. Install as dev dependency

```
npm i -D eslint-config-wt-node
```

2. Add to `.eslintrc` in project root directory

```json
{
  "extends": "eslint-config-wt-node"
}
```

3. Extend the eslint on a project basis by adding rules to  `.eslintrc` e.g.

```
{
  "extends": "eslint-config-wt-node",
  "settings": {
    "import/resolver": "webpack"
  }
}
```

## Where to use it

This package is intended to be used as a starting point for ESLint rules for Backend Node.js projects, and not for use in browser environments.
