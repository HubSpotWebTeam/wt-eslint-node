const DEFAULT_EXCEPTIONS = new Set(['e', '_']);
const DEFAULT_MIN_LENGTH = 2;

const SORT_METHODS = new Set(['sort', 'toSorted']);
const ARRAY_ITERATION_METHODS = new Set([
  'map',
  'flatMap',
  'forEach',
  'filter',
  'find',
  'findIndex',
  'findLast',
  'findLastIndex',
  'some',
  'every',
  'reduce',
  'reduceRight',
]);

/**
 * Returns true if the VariableDeclarator is in the init of a for/for...of/for...in statement.
 * Walks the parent chain directly — no scope API needed.
 *
 * @param {import('eslint').Rule.Node} declaratorNode - VariableDeclarator node
 */
function isDeclaredInForLoopInit(declaratorNode) {
  const declaration = declaratorNode.parent; // VariableDeclaration
  const enclosing = declaration?.parent;
  if (!enclosing) return false;
  return (
    (enclosing.type === 'ForStatement' && enclosing.init === declaration) ||
    enclosing.type === 'ForInStatement' ||
    enclosing.type === 'ForOfStatement'
  );
}

/**
 * Returns true if funcNode is a direct inline callback to a method whose name is in methodNames.
 * Only matches non-computed method calls (arr.sort(...), not arr['sort'](...)).
 *
 * @param {import('eslint').Rule.Node} funcNode - ArrowFunctionExpression or FunctionExpression
 * @param {Set<string>} methodNames
 */
function isCallbackToMethod(funcNode, methodNames) {
  const callExpr = funcNode.parent;
  if (callExpr?.type !== 'CallExpression') return false;
  if (!callExpr.arguments.includes(funcNode)) return false;
  const { callee } = callExpr;
  return (
    callee?.type === 'MemberExpression' &&
    !callee.computed &&
    methodNames.has(callee.property.name)
  );
}

/** @type {import('eslint').Rule.RuleModule} */
export const noAbbreviations = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Disallow abbreviated identifier names (e.g. `w` instead of `warnings`)',
      url: 'https://docs.hubwt.com/docs/developers/coding-on-the-web-team/coding-standards/javascript-standards/#avoid-abbreviation',
      recommended: false,
    },
    messages: {
      tooShort:
        'Identifier "{{name}}" is too short ({{length}} < {{min}}). Use a descriptive name.',
    },
    schema: [
      {
        type: 'object',
        properties: {
          exceptions: { type: 'array', items: { type: 'string' }, uniqueItems: true },
          minLength: { type: 'integer', minimum: 1 },
        },
        additionalProperties: false,
      },
    ],
  },

  create(context) {
    const options = context.options[0] ?? {};
    const exceptions = new Set([...DEFAULT_EXCEPTIONS, ...(options.exceptions ?? [])]);
    const minLength = options.minLength ?? DEFAULT_MIN_LENGTH;

    return {
      Identifier(node) {
        const { name, parent } = node;

        if (name.length >= minLength) return;
        if (exceptions.has(name)) return;

        // Only flag declaration sites — not usage sites.
        const isDeclaration =
          (parent.type === 'VariableDeclarator' && parent.id === node) ||
          (parent.type === 'FunctionDeclaration' && parent.params.includes(node)) ||
          (parent.type === 'ArrowFunctionExpression' && parent.params.includes(node)) ||
          (parent.type === 'FunctionExpression' && parent.params.includes(node));

        if (!isDeclaration) return;

        // For-loop variables (i, j, k…) are exempt regardless of length.
        if (parent.type === 'VariableDeclarator' && isDeclaredInForLoopInit(parent)) return;

        // a and b are conventional sort-comparator names — exempt only inside .sort()/.toSorted().
        if ((name === 'a' || name === 'b') && isCallbackToMethod(parent, SORT_METHODS)) return;

        // i is a conventional index name — exempt only when it is the index param (position 1)
        // of an array iteration callback: items.map((item, i) => ...).
        // Position 1 is the index slot for every array iteration method except reduce/reduceRight
        // (where it's position 2), but naming the reduce index `i` is uncommon enough to skip.
        if (
          name === 'i' &&
          parent.params?.indexOf(node) === 1 &&
          isCallbackToMethod(parent, ARRAY_ITERATION_METHODS)
        ) return;

        context.report({
          node,
          messageId: 'tooShort',
          data: { name, length: name.length, min: minLength },
        });
      },
    };
  },
};
