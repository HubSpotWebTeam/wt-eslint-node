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

## `hs-web-team/no-non-literal-constant-case` ⚠️ warn

**Disallows `CONSTANT_CASE` names whose value isn't actually static.**

A `CONSTANT_CASE` name signals to readers that the value is fixed and safe to assume unchanged for the lifetime of the program. When the value is actually computed at runtime — a function call, a conditional, a reference to a mutable binding — the name is misleading and can cost real debugging time (this rule was added after a `CONSTANT_CASE`-named variable turned out to be a debug-only runtime computation, defaulting to `0` for normal visitors).

### What triggers it

```js
// ❌ Conditional — depends on runtime state
const REDIRECT_DELAY_MS = isDebugMode() ? 1000 : 0;

// ❌ Function call result
const TOKEN = generateToken();

// ❌ Declared with let/var — can be reassigned regardless of its current value
let API_HOST = 'www.api-host.com';
```

### What to do instead

```js
// ✅ Rename to camelCase if the value genuinely isn't a constant
const redirectDelayMs = isDebugMode() ? 1000 : 0;

// ✅ Keep CONSTANT_CASE only when the value is a literal (or built purely from literals)
const API_HOST = 'www.api-host.com';
const RETRY_LIMITS = Object.freeze({ max: 3, backoffMs: 500 });
const SORT_METHODS = new Set(['sort', 'toSorted']);
```

### What's allowed

Literals, template literals with no interpolation, unary-wrapped literals (`-1`), arrays/objects composed entirely of the above (optionally wrapped in `Object.freeze(...)`), `new Set`/`new Map`/`new RegExp` (and their `Weak` variants) built from literal arguments, `process.env.X` references, and references to other `CONSTANT_CASE`-named identifiers are all treated as static and won't be flagged.

**Not covered:** this rule only checks whether the *value* is static — it does not enforce that `CONSTANT_CASE` be reserved for exported bindings (a separate naming convention with much broader rollout impact, intentionally left out of this rule for now).
