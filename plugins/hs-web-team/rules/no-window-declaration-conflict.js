// Point-in-time result of an org-wide code search across HubSpotMarketingWebTeam
// (see PR history), not a live registry. Re-auditing for new or resolved entries
// is a manual, occasional exercise — not something CI enforces.
const DEFAULT_DENYLIST = new Set(['_hsg', '_hsq', '_hsp', 'dataLayer', 'hbspt']);

/**
 * Returns the static property name for a TSPropertySignature/TSMethodSignature key,
 * or null if the key isn't a statically-known name (e.g. a computed expression).
 *
 * @param {import('eslint').Rule.Node} key
 */
function getPropertyName(key) {
  if (key.type === 'Identifier') return key.name;
  if (key.type === 'Literal' && typeof key.value === 'string') return key.value;
  return null;
}

/**
 * Returns true if the TSInterfaceDeclaration node is directly inside a
 * `declare global { ... }` block, as opposed to a normal module-scoped interface.
 *
 * @param {import('eslint').Rule.Node} node - TSInterfaceDeclaration
 */
function isInsideDeclareGlobal(node) {
  const moduleBlock = node.parent;
  const moduleDeclaration = moduleBlock && moduleBlock.parent;
  return (
    moduleBlock?.type === 'TSModuleBlock' &&
    moduleDeclaration?.type === 'TSModuleDeclaration' &&
    moduleDeclaration.global === true
  );
}

export const noWindowDeclarationConflict = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Disallow ambient `declare global` augmentation of known shared, multi-consumer Window properties (Window only — not `globalThis` or other ambient targets)',
      recommended: true,
    },
    messages: {
      declarationConflict:
        '`declare global` augmentation of `Window.{{property}}` is disallowed: "{{property}}" is a shared, multi-consumer global. Augmenting it here risks a structural mismatch with another package\'s declaration of the same member — TypeScript requires every declaration of an interface member to be identical across a program. Use a local, unexported type and a cast at the point of use instead, or a shared `@types` package if the property has many legitimate consumers.',
    },
    schema: [
      {
        type: 'object',
        properties: {
          denylist: { type: 'array', items: { type: 'string' }, uniqueItems: true },
        },
        additionalProperties: false,
      },
    ],
  },

  create(context) {
    const options = context.options[0] ?? {};
    const denylist = new Set([...DEFAULT_DENYLIST, ...(options.denylist ?? [])]);

    return {
      TSInterfaceDeclaration(node) {
        if (node.id.name !== 'Window') return;
        if (!isInsideDeclareGlobal(node)) return;

        for (const member of node.body.body) {
          if (member.type !== 'TSPropertySignature' && member.type !== 'TSMethodSignature') {
            continue;
          }

          const propertyName = getPropertyName(member.key);
          if (propertyName && denylist.has(propertyName)) {
            context.report({
              node: member,
              messageId: 'declarationConflict',
              data: { property: propertyName },
            });
          }
        }
      },
    };
  },
};
