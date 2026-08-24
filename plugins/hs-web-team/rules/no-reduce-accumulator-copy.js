const RECOMMENDATION =
  'Prefer a for...of loop with in-place mutation, or a purpose-built method (flatMap, Object.groupBy, flat) if it fits your pattern.';

function isReduceCall(node) {
  if (!node) return false;

  const callee = node.callee;
  if (!callee || !callee.property || !callee.property.name) {
    return false;
  }

  return (
    callee.property.name === 'reduce' || callee.property.name === 'reduceRight'
  );
}

function isReduceAccumulator(def) {
  return (
    def &&
    def.type === 'Parameter' &&
    def.node.parent &&
    isReduceCall(def.node.parent) &&
    def.node.params &&
    def.node.params.length &&
    // def.name is the Identifier AST node for the definition; this identity
    // check confirms it is the first parameter (the accumulator), not a later one.
    def.name === def.node.params[0]
  );
}

export const noReduceAccumulatorCopy = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Disallow O(n²) accumulator copies (spread, concat) inside reduce/reduceRight callbacks',
      recommended: true,
    },
    messages: {
      AccumulatorSpread: `Spreading the reduce accumulator is O(n²). ${RECOMMENDATION}`,
      AccumulatorShallowCopy: `Calling .{{ method }}() on the reduce accumulator is O(n²). ${RECOMMENDATION}`,
    },
    schema: [],
  },

  create(context) {
    const { sourceCode } = context;

    function checkIsAccumulatorSpread(node) {
      if (!node.argument || node.argument.type !== 'Identifier') return;

      const scope = sourceCode.getScope(node);
      const spreadee = scope.set.get(node.argument.name);
      const spreadeeDef =
        spreadee && spreadee.defs && spreadee.defs.length && spreadee.defs[0];

      if (isReduceAccumulator(spreadeeDef)) {
        context.report({ node, messageId: 'AccumulatorSpread' });
      }
    }

    function checkIsAccumulatorShallowCopy(node) {
      if (
        node.callee.type !== 'MemberExpression' ||
        !node.callee.property ||
        !node.callee.object ||
        node.callee.object.type !== 'Identifier'
      ) {
        return;
      }

      const method = node.callee.property.name;
      if (method !== 'concat') return;

      const scope = sourceCode.getScope(node);
      const variable = scope.set.get(node.callee.object.name);
      const definition =
        variable && variable.defs && variable.defs.length && variable.defs[0];

      if (isReduceAccumulator(definition)) {
        context.report({ node, messageId: 'AccumulatorShallowCopy', data: { method } });
      }
    }

    return {
      SpreadElement: checkIsAccumulatorSpread,
      CallExpression: checkIsAccumulatorShallowCopy,
    };
  },
};
