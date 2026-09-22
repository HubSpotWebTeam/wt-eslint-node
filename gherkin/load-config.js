import fs from 'node:fs';
import path from 'node:path';
import stripJsonComments from 'strip-json-comments';

import defaultCombinations from './coverage-config.js';

const OVERRIDE_FILE = 'gherkin-coverage.json';

export async function loadCoverageConfig(cwd = process.cwd()) {
  const overridePath = path.join(cwd, OVERRIDE_FILE);
  if (!fs.existsSync(overridePath)) {
    return { combinations: defaultCombinations, overridePath: null };
  }

  const override = JSON.parse(stripJsonComments(fs.readFileSync(overridePath, 'utf8')));
  const combinations = Array.isArray(override) ? override : override?.requiredCombinations;

  if (!Array.isArray(combinations) || combinations.some(combo => !Array.isArray(combo))) {
    throw new Error(`${overridePath} must be an array of tag arrays, or { "requiredCombinations": [[...]] }.`);
  }

  return { combinations, overridePath };
}
