# Changelog

## [5.0.0](https://github.com/HubSpotWebTeam/wt-eslint-node/compare/v4.0.2...v5.0.0) (2026-06-04)


### ⚠ BREAKING CHANGES

* update Node engine requirement to v22 in package.json and package-lock.json
* add Prettier configuration and update dependencies

### Features

* add bin entry for add-prettier script in package.json ([9f67d61](https://github.com/HubSpotWebTeam/wt-eslint-node/commit/9f67d616f8a828c3e056761c9cded74081fe5277))
* add browser ESLint configuration and update dependencies ([a0bea94](https://github.com/HubSpotWebTeam/wt-eslint-node/commit/a0bea94de10ba349ceb0bc4ba3821ac9662a5929))
* add browser ESLint configuration and update dependencies ([a4f2d5e](https://github.com/HubSpotWebTeam/wt-eslint-node/commit/a4f2d5eface1344488301b17d1e3e9947fb57646))
* add Cypress and Stylelint usage documentation with installation, configuration, and CI/CD integration details ([deb547e](https://github.com/HubSpotWebTeam/wt-eslint-node/commit/deb547e4b3158ebad92f753788ed27220ea0f093))
* add cypress types and example ([a5dc2bc](https://github.com/HubSpotWebTeam/wt-eslint-node/commit/a5dc2bc97af32b46aa999c932bc9d928017921f5))
* add cypress-axe accessibility testing entry point ([0156124](https://github.com/HubSpotWebTeam/wt-eslint-node/commit/01561241114e971b9b8668e3be39464798d354e0))
* add cypress-axe accessibility testing entry point ([b058ed9](https://github.com/HubSpotWebTeam/wt-eslint-node/commit/b058ed987f16de61a9363b41f91b81cfadce79ed))
* add Prettier configuration and update dependencies ([0a2d614](https://github.com/HubSpotWebTeam/wt-eslint-node/commit/0a2d614f2096ea0cb55d9f4e009339a9646ee41d))
* add prettier gherkin lint ([d4bda61](https://github.com/HubSpotWebTeam/wt-eslint-node/commit/d4bda616ff3751e197749a434dcca5d60741ab99))
* add script to automate Prettier setup in package.json ([219769e](https://github.com/HubSpotWebTeam/wt-eslint-node/commit/219769e743f99689021be71bc2cfb5bba22404ae))
* add selector-class-pattern stylelint rule ([#28](https://github.com/HubSpotWebTeam/wt-eslint-node/issues/28)) ([f2956f2](https://github.com/HubSpotWebTeam/wt-eslint-node/commit/f2956f2947377a4b1b15d0dc839f3e76365e7ec1))
* add Stylelint configuration and Cypress setup for testing environments ([540e9c1](https://github.com/HubSpotWebTeam/wt-eslint-node/commit/540e9c1dcfd6628614b321ace8ea5a5d4048d343))
* enforce no-underscore-dangle in browser config with _hsg/_hsq exceptions ([d73e289](https://github.com/HubSpotWebTeam/wt-eslint-node/commit/d73e289a7a9a630b05cfd73818e3af42087a49bb))
* enhance CLAUDE.md with detailed configurations for Stylelint and Cypress, including usage documentation ([71f9e1d](https://github.com/HubSpotWebTeam/wt-eslint-node/commit/71f9e1d8d4201ae8010f7f88b0f83b5f0f49913c))
* remove cucumber as optional peer dep ([eb99174](https://github.com/HubSpotWebTeam/wt-eslint-node/commit/eb99174f18649696ea2b38ad257f5b5f9d0500e6))
* update cypress config to cjs ([99a01ee](https://github.com/HubSpotWebTeam/wt-eslint-node/commit/99a01ee6f4595e1ee3d4bde88ef9aea3df8d0368))
* update GitHub Actions workflows to use Node.js v22 and upgrade action versions ([cd18add](https://github.com/HubSpotWebTeam/wt-eslint-node/commit/cd18addd5e9ad16ae4bbc33b11ffbdee5204d3ab))
* update Node engine requirement to v22 in package.json and package-lock.json ([fe3fb4f](https://github.com/HubSpotWebTeam/wt-eslint-node/commit/fe3fb4f3ff08dff6af61704de02e143b4d0f3b31))
* update package.json and package-lock.json with peer dependencies for Stylelint and Cypress ([9abf9f2](https://github.com/HubSpotWebTeam/wt-eslint-node/commit/9abf9f2663d7fbb68290352f07431898b3ca9d0e))
* use esbuild ([80bfdca](https://github.com/HubSpotWebTeam/wt-eslint-node/commit/80bfdcaa0e2a5e2c93fb96f26e647e621389984a))


### Bug Fixes

* add Jest globals to ESLint configuration for improved testing support ([55650b9](https://github.com/HubSpotWebTeam/wt-eslint-node/commit/55650b9ee891ae09bf7b34c5f82b5d8f4a7a6feb))
* align browser config comma-dangle with node config and prettier ([#33](https://github.com/HubSpotWebTeam/wt-eslint-node/issues/33)) ([3f0ab0a](https://github.com/HubSpotWebTeam/wt-eslint-node/commit/3f0ab0abc3a19d27330f0e3e6e75bda114fca06c))
* enable trusted publisher ([ab19913](https://github.com/HubSpotWebTeam/wt-eslint-node/commit/ab199133a2dd5195a29a3e1f9687a33fa97e43b1))
* github action ([d80afcf](https://github.com/HubSpotWebTeam/wt-eslint-node/commit/d80afcf9995f3887eb353c5874f1b152da4bd631))
* refine TypeScript ESLint configuration to restrict file types ([ed24fba](https://github.com/HubSpotWebTeam/wt-eslint-node/commit/ed24fba24420029a2ab3d6150c7e145db7d424b8))
* remove browser-specific exceptions ([28ec6c0](https://github.com/HubSpotWebTeam/wt-eslint-node/commit/28ec6c01526b57fe04ab7e8b2a313dde8ec68b2a))
* remove scss rules dropped in stylelint-scss@7 ([#32](https://github.com/HubSpotWebTeam/wt-eslint-node/issues/32)) ([9ceba72](https://github.com/HubSpotWebTeam/wt-eslint-node/commit/9ceba72c46b5a91982411354633f7cd412b6878f))
* set code to run on Node 24 only ([70387d2](https://github.com/HubSpotWebTeam/wt-eslint-node/commit/70387d2a1bd0c3bc7a1a248e4353ede2857a4630))
* update dependencies oct 2025 ([6bc5b03](https://github.com/HubSpotWebTeam/wt-eslint-node/commit/6bc5b03da0750f9b000edf9ced32d2e393c9e85d))
* update ESLint ignore pattern to use .eslint.config.js ([d6edd7e](https://github.com/HubSpotWebTeam/wt-eslint-node/commit/d6edd7edcb846ddef71d40786ac939e84353ddeb))
* update Prettier scripts to include Markdown files in formatting checks ([3aff26d](https://github.com/HubSpotWebTeam/wt-eslint-node/commit/3aff26dab271bbe6ee34e551d153f570b0431730))
