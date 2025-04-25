# Migration from v1 to v2

## Steps to migrate

> **Note**
>
> This migration requires a manual review of the changes and also that you run your project in Node.js v22 or higher.

- [ ] Upgrade to Node.js v22 or higher
- [ ] Upgrade all dependencies to the latest version
- [ ] Update the package `npm install @hs-web-team/eslint-config-node@latest`
- [ ] Run the script `node ./node_modules/@hs-web-team/eslint-config-node/bin/add-prettier-scripts.js`
- [ ] Commit the changes
- [ ] Run the `prettier:check` command to preview what it's being changed
- [ ] Adjust the `.prettierignore` according to your project requirements, as you may not want to format certain files
- [ ] Run the `prettier:write` command to format the files
- [ ] Hope for the best :-D
- [ ] Test locally that everything is working correctly
- [ ] Commit the changes
- [ ] Create a PR
- [ ] Get it approved
- [ ] Merge it into `main`
- [ ] Test everything in QA
- [ ] Celebrate! 🎉
