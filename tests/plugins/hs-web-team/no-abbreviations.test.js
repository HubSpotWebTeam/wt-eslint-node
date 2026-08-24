import { describe, it } from 'node:test';
import { RuleTester } from 'eslint';
import { noAbbreviations as rule } from '../../../plugins/hs-web-team/rules/no-abbreviations.js';

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
});

describe('no-abbreviations', () => {
  describe('valid', () => {
    it('does not flag full-length names', () => {
      ruleTester.run('no-abbreviations', rule, {
        valid: [
          { code: 'const warnings = [];' },
          { code: 'const event = new Event("click");' },
          { code: 'function handleClick(event) {}' },
        ],
        invalid: [],
      });
    });

    it('does not flag for-loop init variables', () => {
      ruleTester.run('no-abbreviations', rule, {
        valid: [
          { code: 'for (let i = 0; i < 10; i++) {}' },
          { code: 'for (let j = 0; j < arr.length; j++) {}' },
          { code: 'for (const x of arr) {}' },
          { code: 'for (const k in obj) {}' },
        ],
        invalid: [],
      });
    });

    it('does not flag default exceptions (e, _)', () => {
      ruleTester.run('no-abbreviations', rule, {
        valid: [
          { code: 'btn.addEventListener("click", e => e.preventDefault());' },
          { code: 'const _ = unused;' },
          { code: 'arr.forEach((item, _) => doThing(item));' },
        ],
        invalid: [],
      });
    });

    it('does not flag a and b as sort-comparator params in .sort()/.toSorted()', () => {
      ruleTester.run('no-abbreviations', rule, {
        valid: [
          { code: 'arr.sort((a, b) => a - b);' },
          { code: 'arr.sort((a, b) => a.name.localeCompare(b.name));' },
          { code: 'arr.toSorted((a, b) => a - b);' },
          { code: 'arr.sort(function(a, b) { return a - b; });' },
        ],
        invalid: [],
      });
    });

    it('does not flag i as the index param (position 1) of array iteration callbacks', () => {
      ruleTester.run('no-abbreviations', rule, {
        valid: [
          { code: 'items.map((item, i) => ({ ...item, index: i }));' },
          { code: 'items.forEach((item, i) => doThing(item, i));' },
          { code: 'items.filter((item, i) => i % 2 === 0);' },
          { code: 'items.find((item, i) => i > 3);' },
          { code: 'items.some((item, i) => i === 0);' },
          { code: 'items.every((item, i) => i < 10);' },
          { code: 'items.flatMap((item, i) => [item, i]);' },
        ],
        invalid: [],
      });
    });

    it('does not flag property access or usage sites (not declarations)', () => {
      ruleTester.run('no-abbreviations', rule, {
        valid: [
          { code: 'obj.w = 1;' },
          { code: 'const foo = obj.w;' },
          { code: 'doThing(w);' },
        ],
        invalid: [],
      });
    });

    it('does not flag object destructuring shorthand (external property name may not be developer-owned)', () => {
      ruleTester.run('no-abbreviations', rule, {
        valid: [
          { code: 'const { w } = response;' },
          { code: 'const { w: warning } = response;' },
          { code: 'function process({ w }) {}' },
        ],
        invalid: [],
      });
    });

    it('does not flag names covered by the custom exceptions option', () => {
      ruleTester.run('no-abbreviations', rule, {
        valid: [
          { code: 'const cb = () => {};', options: [{ exceptions: ['cb'] }] },
        ],
        invalid: [],
      });
    });
  });

  describe('invalid', () => {
    it('flags a single-char array destructuring binding', () => {
      ruleTester.run('no-abbreviations', rule, {
        valid: [],
        invalid: [
          {
            code: 'const [w] = items;',
            errors: [{ messageId: 'tooShort' }],
          },
          {
            code: 'const [item, w] = items;',
            errors: [{ messageId: 'tooShort' }],
          },
        ],
      });
    });

    it('flags a single-char function declaration name', () => {
      ruleTester.run('no-abbreviations', rule, {
        valid: [],
        invalid: [
          {
            code: 'function w() {}',
            errors: [{ messageId: 'tooShort' }],
          },
        ],
      });
    });

    it('flags a single-char variable declaration', () => {
      ruleTester.run('no-abbreviations', rule, {
        valid: [],
        invalid: [
          {
            code: 'const w = [];',
            errors: [{ messageId: 'tooShort', data: { name: 'w', length: 1, min: 2 } }],
          },
        ],
      });
    });

    it('flags a single-char arrow function parameter', () => {
      ruleTester.run('no-abbreviations', rule, {
        valid: [],
        invalid: [
          {
            code: 'items.map(w => w.id);',
            errors: [{ messageId: 'tooShort' }],
          },
        ],
      });
    });

    it('flags a single-char named function parameter', () => {
      ruleTester.run('no-abbreviations', rule, {
        valid: [],
        invalid: [
          {
            code: 'function process(w) {}',
            errors: [{ messageId: 'tooShort' }],
          },
        ],
      });
    });

    it('flags a single-char function expression parameter', () => {
      ruleTester.run('no-abbreviations', rule, {
        valid: [],
        invalid: [
          {
            code: 'const fn = function(w) {};',
            errors: [{ messageId: 'tooShort' }],
          },
        ],
      });
    });

    it('flags a and b outside of sort callbacks', () => {
      ruleTester.run('no-abbreviations', rule, {
        valid: [],
        invalid: [
          {
            code: 'const a = 1;',
            errors: [{ messageId: 'tooShort' }],
          },
          {
            // Not a sort method — a and b should still be flagged
            code: 'items.map((a, b) => a + b);',
            errors: [{ messageId: 'tooShort' }, { messageId: 'tooShort' }],
          },
        ],
      });
    });

    it('flags i when it is not the index param (position 1) of an array method', () => {
      ruleTester.run('no-abbreviations', rule, {
        valid: [],
        invalid: [
          {
            // i as the first (item) param — not the index position
            code: 'items.map(i => i.id);',
            errors: [{ messageId: 'tooShort' }],
          },
          {
            // i outside an array method callback entirely
            code: 'const i = getIndex();',
            errors: [{ messageId: 'tooShort' }],
          },
        ],
      });
    });

    it('flags two-char names when minLength is raised to 3', () => {
      ruleTester.run('no-abbreviations', rule, {
        valid: [],
        invalid: [
          {
            code: 'const cb = () => {};',
            options: [{ minLength: 3 }],
            errors: [{ messageId: 'tooShort', data: { name: 'cb', length: 2, min: 3 } }],
          },
          {
            code: 'items.map(fn => fn());',
            options: [{ minLength: 3 }],
            errors: [{ messageId: 'tooShort' }],
          },
        ],
      });
    });
  });
});
