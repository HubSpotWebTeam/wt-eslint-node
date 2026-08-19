import { describe, it } from 'node:test';
import { RuleTester } from 'eslint';
import markdown from '@eslint/markdown';
import rule from '../../plugins/claude-md/rules/no-placeholder-text.js';

RuleTester.describe = describe;
RuleTester.it = it;

const ruleTester = new RuleTester({
  plugins: { markdown },
  language: 'markdown/gfm',
});

ruleTester.run('claude-md/no-placeholder-text', rule, {
  valid: [
    // Real, project-specific content is fine.
    { code: '# shared-githooks\n\nNPM package that delivers git hooks.\n' },
    // Custom patterns that do not appear in the file.
    {
      code: '# Repo\n\nDoes a specific thing.\n',
      options: [{ patterns: ['TODO: describe this repo'] }],
    },
    // Providing `patterns` replaces the defaults: the default opener is no
    // longer flagged when a custom list is supplied.
    {
      code: 'This file provides guidance to Claude Code\n',
      options: [{ patterns: ['SOME OTHER PHRASE'] }],
    },
  ],
  invalid: [
    {
      // The default banned opener, flagged on its own line.
      code: '# Repo\n\nThis file provides guidance to Claude Code (claude.ai/code).\n',
      errors: [{ messageId: 'placeholderText', line: 3 }],
    },
    {
      // Matching is case-insensitive.
      code: 'this FILE provides GUIDANCE to claude code\n',
      errors: [{ messageId: 'placeholderText', line: 1 }],
    },
    {
      // A custom pattern is matched (case-insensitive substring).
      code: '# Repo\n\nTODO: fill this in later\n',
      options: [{ patterns: ['TODO: fill this in'] }],
      errors: [{ messageId: 'placeholderText', line: 3 }],
    },
  ],
});
