import { describe, it } from 'node:test';
import { RuleTester } from 'eslint';
import tseslint from 'typescript-eslint';
import { noWindowDeclarationConflict as rule } from '../../../plugins/hs-web-team/rules/no-window-declaration-conflict.js';

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    parser: tseslint.parser,
  },
});

describe('no-window-declaration-conflict', () => {
  describe('valid', () => {
    it('does not flag a single-owner property on a global Window augmentation', () => {
      ruleTester.run('no-window-declaration-conflict', rule, {
        valid: [
          {
            code: `
              declare global {
                interface Window {
                  myModuleOwnFlag?: boolean;
                }
              }
            `,
          },
        ],
        invalid: [],
      });
    });

    it('does not flag denylisted property names on non-Window interfaces', () => {
      ruleTester.run('no-window-declaration-conflict', rule, {
        valid: [
          {
            code: `
              declare global {
                interface SomethingElse {
                  _hsg?: unknown;
                }
              }
            `,
          },
        ],
        invalid: [],
      });
    });

    it('does not flag a module-scoped `interface Window` outside `declare global`', () => {
      ruleTester.run('no-window-declaration-conflict', rule, {
        valid: [
          {
            code: `
              interface Window {
                _hsg?: unknown;
              }
            `,
          },
        ],
        invalid: [],
      });
    });
  });

  describe('invalid', () => {
    it('flags a denylisted property on a global Window augmentation', () => {
      ruleTester.run('no-window-declaration-conflict', rule, {
        valid: [],
        invalid: [
          {
            code: `
              declare global {
                interface Window {
                  _hsg?: Record<string, unknown>;
                }
              }
            `,
            errors: [{ messageId: 'declarationConflict', data: { property: '_hsg' } }],
          },
        ],
      });
    });

    it('flags multiple denylisted properties in the same augmentation', () => {
      ruleTester.run('no-window-declaration-conflict', rule, {
        valid: [],
        invalid: [
          {
            code: `
              declare global {
                interface Window {
                  _hsg?: unknown;
                  _hsq?: unknown[];
                  myOwnFlag?: boolean;
                }
              }
            `,
            errors: [
              { messageId: 'declarationConflict', data: { property: '_hsg' } },
              { messageId: 'declarationConflict', data: { property: '_hsq' } },
            ],
          },
        ],
      });
    });

    it('flags a denylisted property declared as a string literal key', () => {
      ruleTester.run('no-window-declaration-conflict', rule, {
        valid: [],
        invalid: [
          {
            code: `
              declare global {
                interface Window {
                  '_hsp': unknown[];
                }
              }
            `,
            errors: [{ messageId: 'declarationConflict', data: { property: '_hsp' } }],
          },
        ],
      });
    });

    it('flags a method signature matching the denylist', () => {
      ruleTester.run('no-window-declaration-conflict', rule, {
        valid: [],
        invalid: [
          {
            code: `
              declare global {
                interface Window {
                  _hsq(command: unknown[]): void;
                }
              }
            `,
            errors: [{ messageId: 'declarationConflict', data: { property: '_hsq' } }],
          },
        ],
      });
    });

    it('flags dataLayer and hbspt (denylisted by default alongside the HubSpot globals)', () => {
      ruleTester.run('no-window-declaration-conflict', rule, {
        valid: [],
        invalid: [
          {
            code: `
              declare global {
                interface Window {
                  dataLayer?: Record<string, unknown>[];
                  hbspt?: { forms: { create: (options: unknown) => void } };
                }
              }
            `,
            errors: [
              { messageId: 'declarationConflict', data: { property: 'dataLayer' } },
              { messageId: 'declarationConflict', data: { property: 'hbspt' } },
            ],
          },
        ],
      });
    });

    it('flags a property matching a project-configured denylist extension', () => {
      ruleTester.run('no-window-declaration-conflict', rule, {
        valid: [],
        invalid: [
          {
            code: `
              declare global {
                interface Window {
                  __ip_lookup?: unknown;
                }
              }
            `,
            options: [{ denylist: ['__ip_lookup'] }],
            errors: [{ messageId: 'declarationConflict', data: { property: '__ip_lookup' } }],
          },
        ],
      });
    });
  });
});
