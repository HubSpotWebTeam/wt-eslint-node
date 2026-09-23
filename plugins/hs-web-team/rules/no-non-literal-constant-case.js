const CONSTANT_CASE_REGEX = /^[A-Z][A-Z0-9_]*$/;

// TS wrapper nodes carry no runtime meaning for "is this value static" —
// unwrap them before inspecting the underlying expression.
const TS_WRAPPER_TYPES = new Set([
  'TSAsExpression',
  'TSSatisfiesExpression',
  'TSNonNullExpression',
  'TSTypeAssertion',
]);

function unwrap(node) {
  let current = node;
  while (current && TS_WRAPPER_TYPES.has(current.type)) {
    current = current.expression;
  }
  return current;
}

function isProcessEnvAccess(node) {
  return (
    node.type === 'MemberExpression' &&
    node.object.type === 'MemberExpression' &&
    node.object.object.type === 'Identifier' &&
    node.object.object.name === 'process' &&
    node.object.property.type === 'Identifier' &&
    node.object.property.name === 'env'
  );
}

function isObjectFreezeCall(node) {
  return (
    node.type === 'CallExpression' &&
    node.callee.type === 'MemberExpression' &&
    !node.callee.computed &&
    node.callee.object.type === 'Identifier' &&
    node.callee.object.name === 'Object' &&
    node.callee.property.type === 'Identifier' &&
    node.callee.property.name === 'freeze' &&
    node.arguments.length === 1
  );
}

// Set/Map and friends are the idiomatic "frozen collection" for lookup tables
// (e.g. `new Set(['a', 'b'])`) — treated as static when every constructor arg is.
const STATIC_COLLECTION_CONSTRUCTORS = new Set(['Set', 'Map', 'WeakSet', 'WeakMap', 'RegExp']);

function isStaticCollectionConstructor(node) {
  return (
    node.type === 'NewExpression' &&
    node.callee.type === 'Identifier' &&
    STATIC_COLLECTION_CONSTRUCTORS.has(node.callee.name)
  );
}

function isStaticElement(node) {
  return isStaticExpression(node.type === 'SpreadElement' ? node.argument : node);
}

function isStaticExpression(rawNode) {
  const node = unwrap(rawNode);
  if (!node) return true;

  switch (node.type) {
    case 'Literal':
      return true;
    case 'TemplateLiteral':
      return node.expressions.length === 0;
    case 'UnaryExpression':
      return isStaticExpression(node.argument);
    case 'ArrayExpression':
      return node.elements.every((element) => element === null || isStaticElement(element));
    case 'ObjectExpression':
      return node.properties.every((prop) =>
        prop.type === 'SpreadElement'
          ? isStaticExpression(prop.argument)
          : isStaticExpression(prop.value),
      );
    case 'CallExpression':
      return isObjectFreezeCall(node) && isStaticExpression(node.arguments[0]);
    case 'NewExpression':
      return isStaticCollectionConstructor(node) && node.arguments.every(isStaticElement);
    case 'Identifier':
      // A reference to another CONSTANT_CASE-named binding is treated as static.
      // This is a syntactic check, not a scope resolution: if that binding's own
      // initializer isn't actually static, this same rule flags it at its declaration.
      return CONSTANT_CASE_REGEX.test(node.name);
    case 'MemberExpression':
      return isProcessEnvAccess(node);
    default:
      return false;
  }
}

export const noNonLiteralConstantCase = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Disallow CONSTANT_CASE variable names whose value is not a literal/static constant',
      recommended: true,
    },
    messages: {
      nonLiteralInit:
        'CONSTANT_CASE name "{{name}}" implies a static constant, but its value is computed ({{ nodeType }}). Rename to camelCase, or replace the value with a literal constant.',
      reassignableBinding:
        'CONSTANT_CASE name "{{name}}" implies a static constant, but it is declared with "{{kind}}" and can be reassigned. Use "const", or rename to camelCase.',
    },
    schema: [],
  },

  create(context) {
    return {
      VariableDeclarator(node) {
        if (node.id.type !== 'Identifier') return;
        if (!node.init) return;

        const { name } = node.id;
        if (!CONSTANT_CASE_REGEX.test(name)) return;

        const { kind } = node.parent;
        if (kind !== 'const') {
          context.report({ node: node.id, messageId: 'reassignableBinding', data: { name, kind } });
          return;
        }

        if (isStaticExpression(node.init)) return;

        context.report({
          node: node.id,
          messageId: 'nonLiteralInit',
          data: { name, nodeType: unwrap(node.init).type },
        });
      },
    };
  },
};
