#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Main function
function addPrettierScripts() {
  console.info('Adding Prettier scripts to package.json...');

  // Read the package.json file
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    console.error('Error: package.json not found in the current directory');
    process.exit(1);
  }

  // Use jq to add scripts (reusing the same approach from the bash script)
  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    // Add prettier scripts with updated glob patterns (only TypeScript and JavaScript files)
    packageJson.scripts = {
      ...packageJson.scripts,
      'prettier:check': 'prettier --check "**/*.{ts,tsx,js,jsx}" "**/*.json"',
      'prettier:write': 'prettier --write "**/*.{ts,tsx,js,jsx}" "**/*.json"',
    };

    // Write updated package.json
    fs.writeFileSync(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`);

    // Check if prettier is installed
    const hasPrettier = packageJson.dependencies?.prettier || packageJson.devDependencies?.prettier;
    if (!hasPrettier) {
      console.info('Prettier not found in dependencies. Adding prettier as a dev dependency...');
      try {
        execSync('npm install --save-dev prettier', { stdio: 'inherit' });
      } catch (error) {
        console.error('Failed to install prettier:', error.message);
      }
    }

    // Create .prettierrc.js if it doesn't exist
    const prettierConfigPath = path.join(process.cwd(), '.prettierrc.js');
    if (!fs.existsSync(prettierConfigPath)) {
      console.info('Creating .prettierrc.js file...');
      const prettierConfig =
`const sharedConfig = require('@hs-web-team/eslint-config-node/.prettierrc.json');

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
}

// Run the script
addPrettierScripts();
