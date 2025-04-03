#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const packageJson = require('../package.json');

const { name } = packageJson;

/**
 * Adds Prettier scripts to the package.json file
 */
const addPrettierScripts = () => {
  console.info('Adding Prettier scripts to package.json...');

  // Read the package.json file
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    console.error('Error: package.json not found in the current directory');
    process.exit(1);
  }

  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    // Add prettier scripts with updated glob patterns (only TypeScript and JavaScript files)
    packageJson.scripts = {
      ...packageJson.scripts,
      'prettier:check': 'prettier --check "**/*.{ts,tsx,js,jsx}" "**/*.json" "**/*.md"',
      'prettier:write': 'prettier --write "**/*.{ts,tsx,js,jsx}" "**/*.json" "**/*.md"',
    };

    // Write updated package.json
    fs.writeFileSync(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`);

    // Create .prettierrc.js if it doesn't exist
    const prettierConfigPath = path.join(process.cwd(), '.prettierrc.js');
    if (!fs.existsSync(prettierConfigPath)) {
      console.info('Creating .prettierrc.js file...');
      const prettierConfig =
`const sharedConfig = require('${name}/.prettierrc.json');

module.exports = sharedConfig;`;
      fs.writeFileSync(prettierConfigPath, prettierConfig);
    }

    // Create .prettierignore if it doesn't exist
    const prettierIgnorePath = path.join(process.cwd(), '.prettierignore');
    if (!fs.existsSync(prettierIgnorePath)) {
      console.info('Creating .prettierignore file...');
      const ignoreContent =
`node_modules
coverage
lib
tsdocs
npm-shrinkwrap.json
package-lock.json
.eslintrc
*.yml
*.yaml
*.md
*.html`;
      fs.writeFileSync(prettierIgnorePath, ignoreContent);
    }

    console.info('✅ Successfully added Prettier scripts to package.json');
    console.info('You can now run:');
    console.info('  npm run prettier:check - to check files for formatting issues');
    console.info('  npm run prettier:write - to automatically fix formatting issues');
  } catch (error) {
    console.error('Error updating package.json:', error.message);
    process.exit(1);
  }
};

addPrettierScripts();
