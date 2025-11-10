# Migration from v2 to v3

## Steps to migrate

> **Note**
>
> This migration requires a manual review of the changes and also that you run your project in Node.js v22 or higher.

- [ ] Upgrade to Node.js v22 or higher
- [ ] Upgrade all dependencies to the latest version
- [ ] Update the package `npm install @hs-web-team/eslint-config-node@latest`
- [ ] Run the script `npx @eslint/migrate-config .eslintrc`
- [ ] Run `npm run lint` to check for any errors
- [ ] Commit the changes
- [ ] Create a PR
- [ ] Get it approved
- [ ] Merge it into `main`
- [ ] Test everything in QA
- [ ] Celebrate! 🎉

> **Important**
>
> Bear in mind that this migration will remove the `.eslintrc` file and replace it with `eslint.config.js`.
> Also the automated migration might fail to migrate some of the rules, so you may need to manually adjust the `eslint.config.js` file.