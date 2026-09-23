import { describe, it } from 'node:test';
import { RuleTester } from 'eslint';
import { noNonLiteralConstantCase as rule } from '../../../plugins/hs-web-team/rules/no-non-literal-constant-case.js';

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
});

describe('no-non-literal-constant-case', () => {
  describe('valid', () => {
    it('does not flag a non-CONSTANT_CASE name with a computed value', () => {
      ruleTester.run('no-non-literal-constant-case', rule, {
        valid: [{ code: 'const redirectDelayMs = isDebug ? 1000 : 0;' }],
        invalid: [],
      });
    });

    it('does not flag literal initializers', () => {
      ruleTester.run('no-non-literal-constant-case', rule, {
        valid: [
          { code: "const NAME = 'bar';" },
          { code: 'const MAX = 10;' },
          { code: 'const ENABLED = true;' },
        ],
        invalid: [],
      });
    });

    it('does not flag a template literal with no interpolation', () => {
      ruleTester.run('no-non-literal-constant-case', rule, {
        valid: [{ code: 'const LABEL = `hello`;' }],
        invalid: [],
      });
    });

    it('does not flag a unary expression wrapping a literal', () => {
      ruleTester.run('no-non-literal-constant-case', rule, {
        valid: [{ code: 'const MIN = -1;' }],
        invalid: [],
      });
    });

    it('does not flag an array or object composed of literals', () => {
      ruleTester.run('no-non-literal-constant-case', rule, {
        valid: [
          { code: 'const LIST = [1, 2, 3];' },
          { code: "const CONFIG = { a: 1, b: 'x' };" },
        ],
        invalid: [],
      });
    });

    it('does not flag Object.freeze wrapping a literal object', () => {
      ruleTester.run('no-non-literal-constant-case', rule, {
        valid: [{ code: 'const FROZEN = Object.freeze({ a: 1 });' }],
        invalid: [],
      });
    });

    it('does not flag new Set()/new Map() built from literals', () => {
      ruleTester.run('no-non-literal-constant-case', rule, {
        valid: [
          { code: "const SORT_METHODS = new Set(['sort', 'toSorted']);" },
          { code: "const LOOKUP = new Map([['a', 1], ['b', 2]]);" },
        ],
        invalid: [],
      });
    });

    it('does not flag a reference to another CONSTANT_CASE identifier', () => {
      ruleTester.run('no-non-literal-constant-case', rule, {
        valid: [{ code: 'const ALIAS = OTHER_CONST;' }],
        invalid: [],
      });
    });

    it('does not flag a process.env reference', () => {
      ruleTester.run('no-non-literal-constant-case', rule, {
        valid: [{ code: 'const API_KEY = process.env.API_KEY;' }],
        invalid: [],
      });
    });

    it('does not flag a declaration with no initializer', () => {
      ruleTester.run('no-non-literal-constant-case', rule, {
        valid: [{ code: 'let PLACEHOLDER;' }],
        invalid: [],
      });
    });
  });

  describe('invalid', () => {
    it('flags a conditional expression (the actual bug pattern)', () => {
      ruleTester.run('no-non-literal-constant-case', rule, {
        valid: [],
        invalid: [
          {
            code: 'const REDIRECT_DELAY_MS = isDebug ? 1000 : 0;',
            errors: [{ messageId: 'nonLiteralInit' }],
          },
        ],
      });
    });

    it('flags a call expression other than Object.freeze', () => {
      ruleTester.run('no-non-literal-constant-case', rule, {
        valid: [],
        invalid: [
          {
            code: 'const TOKEN = generateToken();',
            errors: [{ messageId: 'nonLiteralInit' }],
          },
        ],
      });
    });

    it('flags a logical expression', () => {
      ruleTester.run('no-non-literal-constant-case', rule, {
        valid: [],
        invalid: [
          {
            code: 'const FLAG = a || b;',
            errors: [{ messageId: 'nonLiteralInit' }],
          },
        ],
      });
    });

    it('flags a reference to a non-CONSTANT_CASE identifier', () => {
      ruleTester.run('no-non-literal-constant-case', rule, {
        valid: [],
        invalid: [
          {
            code: 'const ALIAS = someVar;',
            errors: [{ messageId: 'nonLiteralInit' }],
          },
        ],
      });
    });

    it('flags an object with a dynamic value', () => {
      ruleTester.run('no-non-literal-constant-case', rule, {
        valid: [],
        invalid: [
          {
            code: 'const CONFIG = { a: getValue() };',
            errors: [{ messageId: 'nonLiteralInit' }],
          },
        ],
      });
    });

    it('flags an array with a dynamic element', () => {
      ruleTester.run('no-non-literal-constant-case', rule, {
        valid: [],
        invalid: [
          {
            code: 'const LIST = [1, getValue()];',
            errors: [{ messageId: 'nonLiteralInit' }],
          },
        ],
      });
    });

    it('flags a new expression for a non-static-collection constructor', () => {
      ruleTester.run('no-non-literal-constant-case', rule, {
        valid: [],
        invalid: [
          {
            code: 'const HANDLER = new CustomHandler();',
            errors: [{ messageId: 'nonLiteralInit' }],
          },
        ],
      });
    });

    it('flags a let/var declaration even with a literal value, since it can be reassigned', () => {
      ruleTester.run('no-non-literal-constant-case', rule, {
        valid: [],
        invalid: [
          {
            code: "let API_HOST = 'www.api-host.com';",
            errors: [{ messageId: 'reassignableBinding' }],
          },
          {
            code: "var API_HOST = 'www.api-host.com';",
            errors: [{ messageId: 'reassignableBinding' }],
          },
        ],
      });
    });
  });
});
