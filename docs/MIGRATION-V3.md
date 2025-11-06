# Migration from v2 to v3

## Steps to migrate

> **Note**
>
> This migration requires a manual review of the changes and also that you run your project in Node.js v22 or higher.

- [ ] Upgrade to Node.js v22 or higher
- [ ] Upgrade all dependencies to the latest version
- [ ] Update the package `npm install @hs-web-team/eslint-config-node@latest`
- [ ] Run the script `npx @eslint/migrate-config .eslintrc`
- [ ] Commit the changes
