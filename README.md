# Hubspot Marketing WebTeam ESLing rules for Node.js

This is a list of ESLint rules that are recommended for use with *Hubspot Marketing WebTeam* projects.

<!-- index-start -->
## Index

- [Setup](#setup)
<!-- index-end -->

## Setup

1. Install as dev dependency

```
npm i -D husbpot-wt-eslint-node
```

2. Add to `.eslintrc` in project root directory

```json
{
  "extends": "husbpot-wt-eslint-node"
}
```

3. Extend the eslint on a project basis by adding rules to  `.eslintrc` e.g.

```
{
  "extends": "husbpot-wt-eslint-node",
  "settings": {
    "import/resolver": "webpack"
  }
}
```
