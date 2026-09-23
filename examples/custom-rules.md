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
