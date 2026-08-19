import { test } from 'node:test';
import assert from 'node:assert';
import { fileURLToPath } from 'node:url';
import { ESLint } from 'eslint';

const nodeConfig = fileURLToPath(new URL('../../index.js', import.meta.url));
const browserConfig = fileURLToPath(new URL('../../browser.js', import.meta.url));

const oversizedWithPlaceholder = `This file provides guidance to Claude Code\n\n${Array.from(
  { length: 130 },
  (_, i) => `line ${i}`,
).join('\n')}\n`;

async function lintClaudeMd(configFile, code) {
  const eslint = new ESLint({ overrideConfigFile: configFile });
  const [result] = await eslint.lintText(code, { filePath: 'CLAUDE.md' });
  return result.messages.map(message => message.ruleId);
}

test('node config lints CLAUDE.md with the claude-md rules', async () => {
  const ruleIds = await lintClaudeMd(nodeConfig, oversizedWithPlaceholder);
  assert.ok(ruleIds.includes('claude-md/max-lines'), 'expected max-lines to fire');
  assert.ok(ruleIds.includes('claude-md/no-placeholder-text'), 'expected no-placeholder-text to fire');
});

test('browser config lints CLAUDE.md with the claude-md rules', async () => {
  const ruleIds = await lintClaudeMd(browserConfig, oversizedWithPlaceholder);
  assert.ok(ruleIds.includes('claude-md/max-lines'), 'expected max-lines to fire');
  assert.ok(ruleIds.includes('claude-md/no-placeholder-text'), 'expected no-placeholder-text to fire');
});

test('a healthy CLAUDE.md produces no claude-md warnings', async () => {
  const healthy = '# my-project\n\nA specific description of what this repo does.\n';
  const ruleIds = await lintClaudeMd(nodeConfig, healthy);
  assert.ok(
    !ruleIds.some(id => id?.startsWith('claude-md/')),
    `expected no claude-md warnings, got: ${ruleIds.join(', ')}`,
  );
});
