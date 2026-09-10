import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import stripJsonComments from 'strip-json-comments';

import defaultRules from './gplint-config.js';
import defaultCombinations from './coverage-config.js';

const LINT_OVERRIDE_FILES = [
  'gherkin-lint.config.mjs',
  'gherkin-lint.config.js',
  'gherkin-lint.config.cjs',
  'gherkin-lint.config.json',
];

const COVERAGE_OVERRIDE_FILES = ['gherkin-coverage.json'];

const findOverride = (cwd, candidates) => {
  for (const name of candidates) {
    const full = path.join(cwd, name);
    if (fs.existsSync(full)) return full;
  }
  return null;
};

const readOverride = async filePath => {
  if (filePath.endsWith('.json')) {
    return JSON.parse(stripJsonComments(fs.readFileSync(filePath, 'utf8')));
  }
  const mod = await import(pathToFileURL(filePath).href);
  return mod.default ?? mod;
};

/**
 * Rules are merged one level deep, keyed by rule name, so an override replaces a single rule
 * entry outright rather than deep-merging its options. Set a rule to 'off' to disable it.
 */
export async function loadLintConfig(cwd = process.cwd()) {
  const overridePath = findOverride(cwd, LINT_OVERRIDE_FILES);
  if (!overridePath) return { rules: { ...defaultRules }, overridePath: null };

  let override = await readOverride(overridePath);
  if (typeof override === 'function') {
    override = override({ ...defaultRules });
  }
  const rules = override?.rules ?? override;

  return { rules: { ...defaultRules, ...rules }, overridePath };
}

export async function loadCoverageConfig(cwd = process.cwd()) {
  const overridePath = findOverride(cwd, COVERAGE_OVERRIDE_FILES);
  if (!overridePath) return { combinations: defaultCombinations, overridePath: null };

  const override = await readOverride(overridePath);
  const combinations = Array.isArray(override) ? override : override?.requiredCombinations;

  if (!Array.isArray(combinations) || combinations.some(combo => !Array.isArray(combo))) {
    throw new Error(`${overridePath} must be an array of tag arrays, or { "requiredCombinations": [[...]] }.`);
  }

  return { combinations, overridePath };
}
