const DEFAULT_MAX = 100;
const DEFAULT_ADVICE = 'Trim it or split sections into files Claude Code can import on demand.';

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Warn when a doc file exceeds a maximum number of lines',
      recommended: true,
    },
    schema: [
      {
        type: 'object',
        properties: {
          max: { type: 'integer', minimum: 1 },
          advice: { type: 'string' },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      tooManyLines: '{{file}} has {{count}} lines, over the {{max}}-line guideline. {{advice}}',
    },
  },
  create(context) {
    const { max = DEFAULT_MAX, advice = DEFAULT_ADVICE } = context.options[0] || {};
    const { sourceCode } = context;
    // Report against the file's basename so the message names the offending
    // file (e.g. CLAUDE.md or SKILL.md) regardless of its directory.
    const file = (context.filename || '').split('/').pop() || 'File';

    return {
      root() {
        const { lines } = sourceCode;
        // `lines` splits on line breaks; a trailing newline yields a final
        // empty entry that should not count as a content line.
        const count = lines.length > 0 && lines[lines.length - 1] === '' ? lines.length - 1 : lines.length;

        if (count > max) {
          context.report({
            loc: {
              start: { line: max + 1, column: 0 },
              end: { line: lines.length, column: lines[lines.length - 1].length },
            },
            messageId: 'tooManyLines',
            data: { file, count, max, advice },
          });
        }
      },
    };
  },
};
