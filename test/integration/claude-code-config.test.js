import { test } from 'node:test';
import assert from 'node:assert';
import { fileURLToPath } from 'node:url';
import { ESLint } from 'eslint';

const nodeConfig = fileURLToPath(new URL('../../index.js', import.meta.url));
const browserConfig = fileURLToPath(new URL('../../browser.js', import.meta.url));

const oversized = `${Array.from({ length: 130 }, (_, i) => `line ${i}`).join('\n')}\n`;

function makeDoc(lineCount) {
  return `${Array.from({ length: lineCount }, (_, i) => `line ${i}`).join('\n')}\n`;
}

async function lintAt(configFile, code, filePath) {
  const eslint = new ESLint({ overrideConfigFile: configFile });
  const [result] = await eslint.lintText(code, { filePath });
  return result.messages.map(message => message.ruleId);
}

async function lintClaudeMd(configFile, code) {
  return lintAt(configFile, code, 'CLAUDE.md');
}

test('node config lints an oversized CLAUDE.md', async () => {
  const ruleIds = await lintClaudeMd(nodeConfig, oversized);
  assert.ok(ruleIds.includes('claude-code/max-lines'), 'expected max-lines to fire');
});

test('browser config lints an oversized CLAUDE.md', async () => {
  const ruleIds = await lintClaudeMd(browserConfig, oversized);
  assert.ok(ruleIds.includes('claude-code/max-lines'), 'expected max-lines to fire');
});

test('a healthy CLAUDE.md produces no claude-code warnings', async () => {
  const healthy = '# my-project\n\nA specific description of what this repo does.\n';
  const ruleIds = await lintClaudeMd(nodeConfig, healthy);
  assert.ok(
    !ruleIds.some(id => id?.startsWith('claude-code/')),
    `expected no claude-code warnings, got: ${ruleIds.join(', ')}`,
  );
});

const skillPath = '.claude/skills/my-skill/SKILL.md';

test('SKILL.md over the 500-line guideline fires max-lines', async () => {
  const ruleIds = await lintAt(nodeConfig, makeDoc(520), skillPath);
  assert.ok(ruleIds.includes('claude-code/max-lines'), 'expected max-lines to fire');
});

test('a SKILL.md between the CLAUDE.md and SKILL.md limits stays quiet', async () => {
  // 200 lines would trip the 100-line CLAUDE.md limit but is under SKILL.md's 500.
  const ruleIds = await lintAt(nodeConfig, makeDoc(200), skillPath);
  assert.ok(
    !ruleIds.some(id => id?.startsWith('claude-code/')),
    `expected no claude-code warnings, got: ${ruleIds.join(', ')}`,
  );
});
