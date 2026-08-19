import { test } from 'node:test';
import assert from 'node:assert';
import { fileURLToPath } from 'node:url';
import { ESLint } from 'eslint';

const nodeConfig = fileURLToPath(new URL('../../index.js', import.meta.url));
const browserConfig = fileURLToPath(new URL('../../browser.js', import.meta.url));

const oversized = `${Array.from({ length: 130 }, (_, i) => `line ${i}`).join('\n')}\n`;

async function lintClaudeMd(configFile, code) {
  const eslint = new ESLint({ overrideConfigFile: configFile });
  const [result] = await eslint.lintText(code, { filePath: 'CLAUDE.md' });
  return result.messages.map(message => message.ruleId);
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
