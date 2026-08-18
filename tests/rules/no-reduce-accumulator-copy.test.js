import { describe, it } from 'node:test';
import { RuleTester } from 'eslint';
import rule from '../../rules/no-reduce-accumulator-copy.js';

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
});

describe('no-reduce-accumulator-copy', () => {
  describe('valid', () => {
    it('does not flag spreading a non-accumulator variable inside reduce', () => {
      ruleTester.run('no-reduce-accumulator-copy', rule, {
        valid: [
          // Spreading the current item, not the accumulator
          { code: 'items.reduce((acc, item) => ({ ...item, extra: 1 }), {})' },
        ],
        invalid: [],
      });
    });

    it('does not flag Object.fromEntries + flatMap (a preferred alternative)', () => {
      ruleTester.run('no-reduce-accumulator-copy', rule, {
        valid: [
          {
            code: 'Object.fromEntries(items.flatMap(item => [[item.key, item.value]]))',
          },
        ],
        invalid: [],
      });
    });

    it('does not flag a for...of loop with push (a preferred alternative)', () => {
      ruleTester.run('no-reduce-accumulator-copy', rule, {
        valid: [
          {
            code: `
              const result = [];
              for (const item of items) {
                result.push(item.value);
              }
            `,
          },
        ],
        invalid: [],
      });
    });

    it('does not flag in-place mutation of the accumulator', () => {
      ruleTester.run('no-reduce-accumulator-copy', rule, {
        valid: [
          {
            code: 'items.reduce((acc, item) => { acc[item.key] = item.value; return acc; }, {})',
          },
          {
            code: 'items.reduce((acc, item) => { acc.push(item); return acc; }, [])',
          },
        ],
        invalid: [],
      });
    });

    it('does not flag spreading a variable with the same name outside a reduce', () => {
      ruleTester.run('no-reduce-accumulator-copy', rule, {
        valid: [
          {
            code: `
              const acc = { a: 1 };
              const result = { ...acc, b: 2 };
            `,
          },
        ],
        invalid: [],
      });
    });
  });

  describe('invalid', () => {
    it('flags object spread on the accumulator', () => {
      ruleTester.run('no-reduce-accumulator-copy', rule, {
        valid: [],
        invalid: [
          {
            code: 'items.reduce((acc, item) => ({ ...acc, [item.key]: item.value }), {})',
            errors: [{ messageId: 'AccumulatorSpread' }],
          },
        ],
      });
    });

    it('flags acc.concat() on the accumulator', () => {
      ruleTester.run('no-reduce-accumulator-copy', rule, {
        valid: [],
        invalid: [
          {
            code: 'items.reduce((acc, item) => acc.concat(item), [])',
            errors: [{ messageId: 'AccumulatorShallowCopy' }],
          },
        ],
      });
    });

    it('flags acc.slice() on the accumulator', () => {
      ruleTester.run('no-reduce-accumulator-copy', rule, {
        valid: [],
        invalid: [
          {
            code: 'items.reduceRight((acc, item) => acc.slice(0, 5), [1, 2, 3, 4, 5, 6])',
            errors: [{ messageId: 'AccumulatorShallowCopy' }],
          },
        ],
      });
    });

    it('flags object spread on the accumulator inside reduceRight', () => {
      ruleTester.run('no-reduce-accumulator-copy', rule, {
        valid: [],
        invalid: [
          {
            code: 'items.reduceRight((acc, item) => ({ ...acc, [item.key]: item.value }), {})',
            errors: [{ messageId: 'AccumulatorSpread' }],
          },
        ],
      });
    });

    it('flags multiple accumulator copies in the same reduce', () => {
      ruleTester.run('no-reduce-accumulator-copy', rule, {
        valid: [],
        invalid: [
          {
            code: 'items.reduce((acc, item) => item.flag ? { ...acc, [item.key]: item.value } : acc.concat(item), [])',
            errors: [
              { messageId: 'AccumulatorSpread' },
              { messageId: 'AccumulatorShallowCopy' },
            ],
          },
        ],
      });
    });
  });
});
