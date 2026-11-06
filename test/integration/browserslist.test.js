import { test } from 'node:test';
import assert from 'node:assert';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import browserslist from 'browserslist';
import { ESLint } from 'eslint';
import stylelint from 'stylelint';
import browserslistQuery from '../../browserslist.js';

const packageRoot = fileURLToPath(new URL('../..', import.meta.url));
const browserConfig = fileURLToPath(new URL('../../browser.js', import.meta.url));
const stylelintConfigFile = fileURLToPath(new URL('../../.stylelintrc.json', import.meta.url));

test('shared query resolves to at least one browser', () => {
  assert.ok(browserslist(browserslistQuery).length > 0);
});

test('consumers can extend the shared query from a browserslist config', t => {
  const consumerRoot = mkdtempSync(join(tmpdir(), 'browserslist-consumer-'));
  t.after(() => rmSync(consumerRoot, { recursive: true, force: true }));
  mkdirSync(join(consumerRoot, 'node_modules', '@hs-web-team'), { recursive: true });
  symlinkSync(packageRoot, join(consumerRoot, 'node_modules', '@hs-web-team', 'eslint-config-node'), 'dir');

  const extended = browserslist('extends @hs-web-team/eslint-config-node/browserslist-config', { path: consumerRoot });
  assert.deepStrictEqual(extended, browserslist(browserslistQuery));
});

test('stylelint browsers option matches the shared query', () => {
  const { rules } = JSON.parse(readFileSync(stylelintConfigFile, 'utf8'));
  const [, options] = rules['plugin/no-unsupported-browser-features'];
  assert.deepStrictEqual(options.browsers, browserslistQuery);
});

test('browser config passes the shared query to eslint-plugin-compat', async () => {
  const eslint = new ESLint({ overrideConfigFile: browserConfig });
  const config = await eslint.calculateConfigForFile('src/app.js');
  assert.deepStrictEqual(config.settings.browsers, browserslistQuery);
  assert.strictEqual(config.rules['compat/compat'][0], 1);
});

test('compat/compat warns on an API outside the support list', async () => {
  const eslint = new ESLint({ overrideConfigFile: browserConfig });
  const [result] = await eslint.lintText('navigator.usb.getDevices();\n', { filePath: 'src/app.js' });
  const messages = result.messages.filter(message => message.ruleId === 'compat/compat');
  assert.ok(messages.length > 0, JSON.stringify(result.messages));
});

test('stylelint warns on a CSS feature outside the support list', async () => {
  const { results } = await stylelint.lint({
    code: '.quote { hanging-punctuation: first; }',
    configFile: stylelintConfigFile,
  });
  const warnings = results[0].warnings.filter(warning => warning.rule === 'plugin/no-unsupported-browser-features');
  assert.ok(warnings.length > 0, JSON.stringify(results[0].warnings));
  assert.strictEqual(warnings[0].severity, 'warning');
});
