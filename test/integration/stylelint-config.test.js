import { test } from 'node:test';
import assert from 'node:assert';
import { fileURLToPath } from 'node:url';
import stylelint from 'stylelint';

const configFile = fileURLToPath(new URL('../../.stylelintrc.json', import.meta.url));

async function warningsFor(selector) {
  const { results } = await stylelint.lint({
    code: `${selector} { color: var(--text-color); }`,
    configFile,
  });
  return results[0].warnings;
}

function fires(warnings, ruleId) {
  return warnings.some(warning => warning.rule === ruleId);
}

const standard = ['this-is-our-current-standard', 'block', 'block-element', 'a'];

const strictBem = ['block__element', 'block__element--modifier', 'block--modifier'];

const notStrictBem = [
  'block__el__sub', // nested elements aren't valid BEM
  'block--mod--mod2', // chained modifiers aren't valid BEM
  'block--mod__el', // modifier before element is out of order
  'block__', // element separator with no element name
  'block--', // modifier separator with no modifier name
];

const otherInvalid = ['something_weird-like-this_thing', 'Block'];

for (const className of standard) {
  test(`accepts our standard convention: ${className}`, async () => {
    const warnings = await warningsFor(`.${className}`);
    assert.ok(!fires(warnings, 'selector-class-pattern'), JSON.stringify(warnings));
  });
}

test('accepts a standalone modifier class combined with a base class', async () => {
  const warnings = await warningsFor('.block-element.-modifier');
  assert.ok(!fires(warnings, 'selector-class-pattern'), JSON.stringify(warnings));
});

for (const className of strictBem) {
  test(`accepts strict BEM: ${className}`, async () => {
    const warnings = await warningsFor(`.${className}`);
    assert.ok(!fires(warnings, 'selector-class-pattern'), JSON.stringify(warnings));
  });
}

for (const className of notStrictBem) {
  test(`rejects BEM-like but not strict: ${className}`, async () => {
    const warnings = await warningsFor(`.${className}`);
    assert.ok(fires(warnings, 'selector-class-pattern'), `expected selector-class-pattern to fire for ${className}`);
  });
}

for (const className of otherInvalid) {
  test(`rejects: ${className}`, async () => {
    const warnings = await warningsFor(`.${className}`);
    assert.ok(fires(warnings, 'selector-class-pattern'), `expected selector-class-pattern to fire for ${className}`);
  });
}
