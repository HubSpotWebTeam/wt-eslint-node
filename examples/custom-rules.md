# Custom Rules (`hs-web-team` plugin)

This package bundles a small set of custom ESLint rules under the `hs-web-team` plugin. They are active automatically when you spread `wtConfig` or `wtBrowserConfig` — no extra configuration required.

---

## `hs-web-team/no-reduce-accumulator-copy` ❌ error

**Disallows O(n²) accumulator copies inside `reduce`/`reduceRight` callbacks.**

Each iteration of `reduce` creates an entirely new object or array, making the total work proportional to n². This is rarely intentional and degrades quickly as the input grows.

### What triggers it

```js
// ❌ Object spread — copies every key on every iteration
const byId = items.reduce((acc, item) => ({ ...acc, [item.id]: item }), {});

// ❌ Array spread — copies every element on every iteration
const doubled = items.reduce((acc, n) => [...acc, n * 2], []);

// ❌ acc.concat() — same problem, different syntax
const flat = items.reduce((acc, arr) => acc.concat(arr), []);
```

### What to do instead

```js
// ✅ Object.groupBy / Object.fromEntries for grouping/indexing
const byId = Object.fromEntries(items.map(item => [item.id, item]));

// ✅ for...of with in-place mutation for accumulation
const byId = {};
for (const item of items) {
  byId[item.id] = item;
}

// ✅ flatMap for flat-map patterns
const doubled = items.flatMap(n => [n * 2]);

// ✅ flat() for flattening
const flat = items.flat();
```

### When `reduce` is fine

The rule only fires when the **accumulator itself** is copied. Reads from the accumulator, or spreading non-accumulator values into it, are allowed:

```js
// ✅ Spreading a non-accumulator value into the result
const merged = items.reduce((acc, item) => ({ ...acc, ...item.overrides }), base);
//                                                         ^^^^^^^^^^^^^^ not the accumulator — fine

// ✅ Accumulator mutation with no copy
const counts = items.reduce((acc, item) => {
  acc[item.type] = (acc[item.type] ?? 0) + 1;
  return acc;
}, {});
```

---

## `hs-web-team/no-window-declaration-conflict` ⚠️ warn

**Disallows ambient `declare global` augmentation of `Window` properties that are shared across multiple independent packages.**

TypeScript requires every declaration of the same interface member to be structurally identical across a program (its ["Declaration Merging"](https://www.typescriptlang.org/docs/handbook/declaration-merging.html) behavior). When two unrelated packages each declare their own ambient type for the same `Window` property, the moment one changes its shape, every consumer that depends on both packages fails to typecheck. The default denylist — `_hsg`, `_hsq`, `_hsp`, `dataLayer`, `hbspt` — covers HubSpot's shared tracking/global-state queues and the standard GTM/Forms globals, all of which are independently declared across multiple WebTeam repos today. This rule only checks `Window`; other ambient targets (`globalThis`, namespace merges, etc.) aren't covered.

### What triggers it

```ts
// ❌ _hsg is a shared global with at least half a dozen independent declarers —
// this package's shape adds another point of failure the next declaration can collide with.
declare global {
  interface Window {
    _hsg?: { myFeatureFlag: boolean };
  }
}
```

### What to do instead

```ts
// ✅ A local, unexported type + cast at the point of use — no ambient declaration risk.
type WindowWithHsg = Window & { _hsg?: { myFeatureFlag: boolean } };

function readMyFeatureFlag() {
  return (window as WindowWithHsg)._hsg?.myFeatureFlag;
}
```

For a property with many legitimate consumers by design (like `dataLayer` or `hbspt`), consider a shared `@types` package as the single source of truth instead of repeating the cast in every consumer — that leaves exactly one declaration to merge, not N.

### When `declare global` is fine

The rule only fires on properties in the denylist. A package augmenting `Window` with a property it genuinely and exclusively owns is unaffected:

```ts
// ✅ myModuleOwnFlag isn't on the denylist — single-owner globals are a legitimate use of declare global.
declare global {
  interface Window {
    myModuleOwnFlag?: boolean;
  }
}
```

### Extending the denylist

Other teams or projects can extend the default list without losing the built-in entries:

```js
// eslint.config.js
{
  rules: {
    'hs-web-team/no-window-declaration-conflict': ['warn', { denylist: ['myOrgSharedGlobal'] }],
  },
}
```
