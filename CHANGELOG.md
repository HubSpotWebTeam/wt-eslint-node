# Changelog

## [5.0.0](https://github.com/HubSpotWebTeam/wt-eslint-node/compare/v4.2.2...v5.0.0) (2026-09-02)


### ⚠ BREAKING CHANGES

* configs.recommended now includes 'hs-web-team/no-reduce-accumulator-copy' at 'error' severity. Any project using configs.recommended that spreads or concats the accumulator inside a reduce/reduceRight callback will receive a lint error on the next version bump. Refactor to a for...of loop with in-place mutation, or use flatMap/Object.groupBy.

### Features

* add ADR for linting CLAUDE.md with ESLint rule to enforce max lines ([e3f44a3](https://github.com/HubSpotWebTeam/wt-eslint-node/commit/e3f44a33e1b7dec4eea71ce5b840d6358580e82e))
* add claude md rules ([51b848e](https://github.com/HubSpotWebTeam/wt-eslint-node/commit/51b848ee539764b823314670574fa4eb49fd2a00))
* add CLAUDE.md ESLint plugin with max-lines rule ([6db895d](https://github.com/HubSpotWebTeam/wt-eslint-node/commit/6db895d5f6d5df1f18187e7bd91517ae3bfe0444))
* add CLAUDE.md linting configuration to browser and index ESLint setups ([0a296f7](https://github.com/HubSpotWebTeam/wt-eslint-node/commit/0a296f7f54538ada408139651a08465b3349c454))
* add CLAUDE.md usage documentation for linting rules ([a17ccfb](https://github.com/HubSpotWebTeam/wt-eslint-node/commit/a17ccfb7c5fcb4285815b9003ce3e4c92db1abd4))
* add ESLint rule to enforce maximum lines in CLAUDE.md ([d1ad0b2](https://github.com/HubSpotWebTeam/wt-eslint-node/commit/d1ad0b2766cb52ab5045b11b66b9dc15685cc73c))
* add hs-web-team/no-abbreviations rule ([#66](https://github.com/HubSpotWebTeam/wt-eslint-node/issues/66)) ([63cf9ec](https://github.com/HubSpotWebTeam/wt-eslint-node/commit/63cf9ec451d74c30d1ff8df1cc0ed17536c9837c))
* add max-lines rule for CLAUDE.md to enforce line count limits ([ab9862b](https://github.com/HubSpotWebTeam/wt-eslint-node/commit/ab9862b4e4fefae8d04c62a9d3060ce7ae49428f))
* add max-params rule (warn at 4+ parameters) ([6c10ada](https://github.com/HubSpotWebTeam/wt-eslint-node/commit/6c10adac401f8436cffe335d43ee58c17b7fb36b))
* add max-params rule (warn at 4+ parameters) ([#60](https://github.com/HubSpotWebTeam/wt-eslint-node/issues/60)) ([58ef761](https://github.com/HubSpotWebTeam/wt-eslint-node/commit/58ef761c103a475bc65f2b5ab9c6eace131efe6a))
* add no-reduce-accumulator-copy rule ([#62](https://github.com/HubSpotWebTeam/wt-eslint-node/issues/62)) ([c70cab7](https://github.com/HubSpotWebTeam/wt-eslint-node/commit/c70cab74eef4dfe9acdc3c74454aa7f5c024ab42))
* add tests for CLAUDE.md linting rules with node and browser configurations ([2b5b58c](https://github.com/HubSpotWebTeam/wt-eslint-node/commit/2b5b58c0321c534846294611c33ebbd0dadd6561))
* add tests for max-lines rule in CLAUDE.md ([dee6943](https://github.com/HubSpotWebTeam/wt-eslint-node/commit/dee69437a6ac4728fdf232b556af5ed7be238b8a))
* add tests for no-placeholder-text rule in CLAUDE.md ([6891e27](https://github.com/HubSpotWebTeam/wt-eslint-node/commit/6891e278b5db62ba39dd5fab646ec22233f7bab6))
* enhance CLAUDE.md and SKILL.md linting rules with custom advice and improved configuration ([fa03a30](https://github.com/HubSpotWebTeam/wt-eslint-node/commit/fa03a30b25085da3edd5ed9690e289dc2342d146))
* extend max-lines rule to SKILL.md and consolidate plugin configuration ([af9f6e4](https://github.com/HubSpotWebTeam/wt-eslint-node/commit/af9f6e4051fcce55770eb492619e294705169405))
* mark no-reduce-accumulator-copy as breaking change ([2fb61d5](https://github.com/HubSpotWebTeam/wt-eslint-node/commit/2fb61d554f1fdbf270115762be94f3849705b1c0))
* refactor CLAUDE.md linting to use claudeCodePlugin and remove deprecated config ([608e631](https://github.com/HubSpotWebTeam/wt-eslint-node/commit/608e631bf133ff2385a6295eb6fedbd98536dee4))
* update CLAUDE.md linting documentation to include SKILL.md rules ([f999ea4](https://github.com/HubSpotWebTeam/wt-eslint-node/commit/f999ea4b1fbdc759273f0ae1ab040159fc3a9b4a))


### Bug Fixes

* allow modifier classes inside :is()/:not()/:where() with a base class ([#49](https://github.com/HubSpotWebTeam/wt-eslint-node/issues/49)) ([c56993c](https://github.com/HubSpotWebTeam/wt-eslint-node/commit/c56993cbdfa3d7cb32dfe98c16132f4b5a64feac))
* only log missing baseUrl warning when baseUrl is absent ([5ee5997](https://github.com/HubSpotWebTeam/wt-eslint-node/commit/5ee5997ce726fab5c88b730b20ebd8a225fea714))
* only log missing baseUrl warning when baseUrl is absent, not on every call ([b511d5d](https://github.com/HubSpotWebTeam/wt-eslint-node/commit/b511d5d7e00f00a1215eced211e96416111a769e))
* return null from getRootDir when hubspot.config.yml is not found ([#51](https://github.com/HubSpotWebTeam/wt-eslint-node/issues/51)) ([8ea3295](https://github.com/HubSpotWebTeam/wt-eslint-node/commit/8ea32956ee6fde0d99a6b4d8ad1db046514fd9f8))
* update test script to run Node.js tests instead of echo error ([e09dca4](https://github.com/HubSpotWebTeam/wt-eslint-node/commit/e09dca4ee2cd6a7effd5fe788814b1d892327ac6))

## [4.2.2](https://github.com/HubSpotWebTeam/wt-eslint-node/compare/v4.2.1...v4.2.2) (2026-06-18)


### Bug Fixes

* add default export condition for cypress.config subpath ([a15f847](https://github.com/HubSpotWebTeam/wt-eslint-node/commit/a15f847cc00430dec3ec59cc5c4cccabcabee2a1))
* add default export condition for cypress.config subpath ([41679a9](https://github.com/HubSpotWebTeam/wt-eslint-node/commit/41679a98cba0c514f8b66bd2495ec040c1a27775))

## [4.2.1](https://github.com/HubSpotWebTeam/wt-eslint-node/compare/v4.2.0...v4.2.1) (2026-06-05)


### Bug Fixes

* re-trigger publish after release-please CI fix ([45fe949](https://github.com/HubSpotWebTeam/wt-eslint-node/commit/45fe94930c06d61e6f8f3015bc4e6518e187aaa1))

## [4.2.0](https://github.com/HubSpotWebTeam/wt-eslint-node/compare/v4.1.0...v4.2.0) (2026-06-05)


### Features

* warn on hardcoded color, font-size, and font-weight values ([#37](https://github.com/HubSpotWebTeam/wt-eslint-node/issues/37)) ([783a320](https://github.com/HubSpotWebTeam/wt-eslint-node/commit/783a320a3d0e858cd370670be452aaa847ba9c39))
