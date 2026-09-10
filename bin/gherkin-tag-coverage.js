#!/usr/bin/env node
/**
 * Fails when the suite as a whole is missing a required tag combination, e.g. no scenario
 * anywhere is tagged @smoke @prod @en, which would make that CI job select zero specs and
 * exit green.
 *
 * Silent on success, like gplint and eslint.
 * Exit codes: 0 covered, 1 uncovered, 2 bad input.
 *
 * Usage: gherkin-tag-coverage [path]     (path defaults to cypress/e2e)
 */

import fs from 'node:fs';
import path from 'node:path';

import { loadCoverageConfig } from '../gherkin/load-config.js';
import { findFeatureFiles, collectScenarios, findUncovered, formatProblems } from '../gherkin/suite-coverage.js';

const target = process.argv[2] ?? path.join('cypress', 'e2e');

if (!fs.existsSync(target)) {
  console.error(`gherkin-tag-coverage: path not found: ${target}`);
  process.exit(2);
}

let combinations;
try {
  ({ combinations } = await loadCoverageConfig());
} catch (err) {
  console.error(`gherkin-tag-coverage: ${err.message}`);
  process.exit(2);
}

const files = findFeatureFiles(target);
if (files.length === 0) {
  console.error(`gherkin-tag-coverage: no .feature files found under ${target}`);
  process.exit(1);
}

let scenarios;
try {
  scenarios = collectScenarios(files);
} catch (err) {
  console.error(`gherkin-tag-coverage: could not parse feature files. ${err.message}`);
  process.exit(2);
}

if (scenarios.length === 0) {
  console.error(
    `gherkin-tag-coverage: found ${files.length} feature file(s) under ${target} but no scenarios in any of them.`,
  );
  process.exit(1);
}

const problems = findUncovered(scenarios, combinations);

if (problems.length === 0) {
  process.exit(0);
}

console.info(formatProblems(problems));
process.exit(1);
