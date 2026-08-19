import { describe, it } from 'node:test';
import { RuleTester } from 'eslint';
import markdown from '@eslint/markdown';
import rule from '../../plugins/claude-code/rules/max-lines.js';

// Report each RuleTester case as a real node:test subtest.
RuleTester.describe = describe;
RuleTester.it = it;

const ruleTester = new RuleTester({
  plugins: { markdown },
  language: 'markdown/gfm',
});

ruleTester.run('claude-code/max-lines', rule, {
  valid: [
    // A file exactly at the limit passes (N lines, max N).
    { code: 'a\nb\nc\n', options: [{ max: 3 }] },
    // Under the limit passes.
    { code: 'a\nb\n', options: [{ max: 3 }] },
    // A file with no trailing newline still counts every content line.
    { code: 'a\nb\nc', options: [{ max: 3 }] },
    // Default max is 100 — a small file is fine with no options.
    { code: '# Title\n\nSome context.\n' },
  ],
  invalid: [
    {
      // 4 content lines with max 3 -> warns, pointing at the first extra line.
      code: 'a\nb\nc\nd\n',
      options: [{ max: 3 }],
      errors: [{ messageId: 'tooManyLines', line: 4 }],
    },
    {
      // No trailing newline still counts every content line.
      code: 'a\nb\nc\nd',
      options: [{ max: 3 }],
      errors: [{ messageId: 'tooManyLines', line: 4 }],
    },
  ],
});
