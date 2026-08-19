const DEFAULT_MAX = 100;

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Warn when CLAUDE.md exceeds a maximum number of lines',
      recommended: true,
    },
    schema: [
      {
        type: 'object',
        properties: { max: { type: 'integer', minimum: 1 } },
        additionalProperties: false,
      },
    ],
    messages: {
      tooManyLines:
        'CLAUDE.md has {{count}} lines, over the {{max}}-line guideline. Trim it or split sections into files Claude Code can import on demand.',
    },
  },
  create(context) {
    const { max = DEFAULT_MAX } = context.options[0] || {};
    const { sourceCode } = context;

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
            data: { count, max },
          });
        }
      },
    };
  },
};
