#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const projectRoot = process.env.INIT_CWD || process.env.npm_config_local_prefix;

// Skip if we can't determine the consuming project's root, or if postinstall
// is running inside this package's own development environment.
if (!projectRoot || projectRoot === path.resolve(__dirname, '..')) {
  process.exit(0);
}

const ownPkg = require('../package.json');

const stylelintPeers = Object.entries(ownPkg.peerDependencies || {}).filter(([name]) =>
  name.startsWith('stylelint')
);

// Extracts the minimum required major version from a semver range like ^17.0.0 or >=17.1.1.
const minMajor = (range) => {
  const match = range.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
};

const outdated = [];

for (const [pkg, requiredRange] of stylelintPeers) {
  const pkgJsonPath = path.join(projectRoot, 'node_modules', pkg, 'package.json');
  if (!fs.existsSync(pkgJsonPath)) continue;

  const { version } = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
  const installedMajor = parseInt(version.split('.')[0], 10);

  if (installedMajor < minMajor(requiredRange)) {
    outdated.push({ pkg, version, requiredRange });
  }
}

if (outdated.length === 0) process.exit(0);

const pkgName = ownPkg.name;
console.warn(`\n⚠️  ${pkgName}: outdated stylelint peer dependencies detected.\n`);
console.warn('   These packages are installed at versions that are no longer compatible:');
for (const { pkg, version, requiredRange } of outdated) {
  console.warn(`   • ${pkg}@${version}  →  required: ${requiredRange}`);
}
const upgradeCmd = outdated.map(({ pkg, requiredRange }) => `${pkg}@"${requiredRange}"`).join(' ');
console.warn(`\n   Run: npm install ${upgradeCmd}`);
console.warn('   Failure to upgrade may cause unexpected lint errors.\n');
