/**
 * Checks that the suite contains at least one scenario for each required tag combination.
 *
 * A gplint rule cannot do this: it is handed one file at a time and never sees the suite.
 *
 * Tags count no matter where they come from: the Feature line, a Rule, the Scenario, or an
 * Examples block. This works because each file is compiled into "pickles" the same way
 * Cucumber does, and a pickle's tag list is already the merged set Cucumber matches against
 * when you run --tags.
 */

import fs from 'node:fs';
import path from 'node:path';
import * as gherkin from '@cucumber/gherkin';
import * as messages from '@cucumber/messages';

export const RULE = 'suite-tag-coverage';

const SKIP_DIRS = new Set(['node_modules', '.git', 'dist', 'build', 'coverage']);

export function findFeatureFiles(target) {
  if (fs.statSync(target).isFile()) {
    return target.endsWith('.feature') ? [target] : [];
  }

  const found = [];
  for (const entry of fs.readdirSync(target, { withFileTypes: true })) {
    const full = path.join(target, entry.name);
    if (entry.isDirectory() && !SKIP_DIRS.has(entry.name)) {
      found.push(...findFeatureFiles(full));
    } else if (entry.isFile() && entry.name.endsWith('.feature')) {
      found.push(full);
    }
  }
  return found;
}

function parse(filePath) {
  const parser = new gherkin.Parser(
    new gherkin.AstBuilder(messages.IdGenerator.uuid()),
    new gherkin.GherkinClassicTokenMatcher(),
  );
  const doc = parser.parse(fs.readFileSync(filePath, 'utf8'));
  return { pickles: gherkin.compile(doc, filePath, messages.IdGenerator.uuid()), doc };
}

// A pickle knows which AST nodes it came from but not its line number, so build id -> line.
function lineIndex(doc) {
  const lines = new Map();
  const visit = children => {
    for (const child of children ?? []) {
      if (child.rule) visit(child.rule.children);
      if (!child.scenario) continue;
      lines.set(child.scenario.id, child.scenario.location.line);
      for (const examples of child.scenario.examples ?? []) {
        for (const row of examples.tableBody ?? []) {
          lines.set(row.id, row.location.line);
        }
      }
    }
  };
  visit(doc.feature?.children);
  return lines;
}

export function collectScenarios(files) {
  const scenarios = [];
  for (const file of files) {
    const parsed = parse(file);
    const lines = lineIndex(parsed.doc);
    for (const pickle of parsed.pickles) {
      scenarios.push({
        file,
        name: pickle.name,
        line: lines.get(pickle.astNodeIds.at(-1)) ?? '?',
        tags: new Set(pickle.tags.map(tag => tag.name)),
      });
    }
  }
  return scenarios;
}

/** Returns one problem per uncovered combination, anchored at the closest scenario. */
export function findUncovered(scenarios, combinations) {
  return combinations
    .filter(combo => !scenarios.some(scenario => combo.every(tag => scenario.tags.has(tag))))
    .map(combo => {
      // Rank by how many tags are missing so the suggestion is the smallest possible fix.
      const closest = scenarios
        .map(scenario => ({ scenario, missing: combo.filter(tag => !scenario.tags.has(tag)) }))
        .sort((a, b) => a.missing.length - b.missing.length)[0];

      return {
        file: closest.scenario.file,
        line: closest.scenario.line,
        column: 3,
        message: `No scenario in the suite is tagged [${combo.join(' ')}]. Add ${closest.missing.join(' ')} here, or tag another scenario.`,
      };
    });
}

/** gplint's stylish format, so the lint and coverage checks read as one tool. */
export function formatProblems(problems) {
  const byFile = new Map();
  for (const problem of problems) {
    if (!byFile.has(problem.file)) byFile.set(problem.file, []);
    byFile.get(problem.file).push(problem);
  }

  const width = Math.max(...problems.map(problem => `${problem.line}:${problem.column}`.length));
  const lines = [];

  for (const [file, fileProblems] of [...byFile.entries()].sort()) {
    lines.push('', path.resolve(file));
    for (const problem of fileProblems.sort((a, b) => a.line - b.line)) {
      const at = `${problem.line}:${problem.column}`.padStart(width);
      lines.push(`  ${at}  error  ${problem.message}  ${RULE}`);
    }
  }

  const count = problems.length;
  const plural = count === 1 ? '' : 's';
  lines.push('', `✖ ${count} problem${plural} (${count} error${plural}, 0 warnings)`, '');

  return lines.join('\n');
}
