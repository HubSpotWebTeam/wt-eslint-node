# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is an ESLint configuration package (`@hs-web-team/eslint-config-node`) for HubSpot Marketing WebTeam Node.js projects. It provides shared ESLint rules and Prettier configuration for backend Node.js projects.

## Key Commands

### Linting
```bash
npm run lint
```
Runs ESLint on the codebase with auto-fix enabled. Uses the configuration defined in `index.js`.

### Testing in Projects
When testing changes to this package in downstream projects, you'll typically:
1. Make changes to the ESLint config in `index.js`
2. Run `npm link` in this repository
3. Run `npm link @hs-web-team/eslint-config-node` in the consuming project
4. Test the linting behavior in the consuming project

## Architecture

### Core Configuration File
- **`index.js`**: The main ESLint configuration export using ESLint 9's flat config format
  - Uses `@eslint/js`, `typescript-eslint`, and `globals` packages
  - Exports two separate configurations: one for JavaScript files (`**/*.{js,mjs,cjs}`) and one for TypeScript files (`**/*.{ts,mts,cts,tsx}`)
  - JavaScript config uses `js/recommended`, TypeScript config uses `tseslint.configs.recommended`
  - Includes Node.js, ES2022, and Jest globals
  - Common ignores: `node_modules`, `.serverless`, `.webpack`, `dist`, `eslint.config.js`
  - Key custom rules: `no-console` (allows info/warn/error), `max-len` (120 chars), camelcase disabled

### Prettier Integration
- **`bin/add-prettier-scripts.js`**: Executable script that consuming projects can run to set up Prettier
  - Uses CommonJS (`require`) syntax (different from the main package which is ESM)
  - Adds `prettier:check` and `prettier:write` scripts to package.json
  - Creates `.prettierrc.js` file that imports from this package's `.prettierrc.json`
  - Creates `.prettierignore` file with sensible defaults (npm-shrinkwrap.json, package-lock.json, .eslintrc, *.html)
- **`.prettierrc.json`**: Shared Prettier configuration
  - 120 char width, single quotes, 2-space tabs, trailing commas
  - Arrow parens: avoid, LF line endings, single attribute per line
  - Override for YAML files: uses double quotes instead of single

### Package Details
- **Type**: ESM module (`"type": "module"`)
- **Node requirement**: >= 22
- **Main export**: `index.js`
- **Binary command**: `add-prettier` maps to `bin/add-prettier-scripts.js`

### Migration Context
This package is currently on v3, which uses ESLint 9's flat config format. The project has migrated from:
- v1 → v2: See `docs/MIGRATION-V2.md`
- v2 → v3: See `docs/MIGRATION-V3.md` (ESLint 9 flat config migration requiring Node.js 22+)

## Important Notes

- This package is for **backend Node.js projects only**, not browser environments
- The configuration uses ESLint 9's flat config format (not the legacy `.eslintrc` format)
- Downstream projects extend this config in their `eslint.config.js` by spreading the imported config
- The binary script `bin/add-prettier-scripts.js` uses CommonJS (`require`) while the main package is ESM
- CI runs on Node 22 and 24 (see `.github/workflows/pr.yml`)
