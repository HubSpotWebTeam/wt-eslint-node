# Shared Browserslist Query

`@hs-web-team/eslint-config-node/browserslist-config` exports the browser support list from the WDO [Browser Support Guidelines](https://hubspot.atlassian.net/wiki/spaces/MKT/pages/1440153616/Browser+Support+Guidelines) as a rolling browserslist query:

```js
['last 1 year', 'Firefox ESR'];
```

The query contains no version numbers. It only changes if the policy window changes. Importing it throws if the query resolves to no browsers (fully stale `caniuse-lite` data).

## Lint checks

The browser ESLint config and the shared Stylelint config check code against this list. No setup is needed beyond using those configs:

- **ESLint** (`/browser` export): `compat/compat` from `eslint-plugin-compat` warns on JS/TS browser APIs outside the list.
- **Stylelint** (`.stylelintrc.json` export): `plugin/no-unsupported-browser-features` warns on CSS features outside the list. Partial support is ignored.

## Build tooling

Extend the shared query from the project's browserslist config. Every tool that reads browserslist config (Babel `preset-env`, Autoprefixer, `postcss-preset-env`, and others) then uses it without per-tool setup.

`.browserslistrc`:

```
extends @hs-web-team/eslint-config-node/browserslist-config
```

Or in `package.json`:

```json
{
  "browserslist": ["extends @hs-web-team/eslint-config-node/browserslist-config"]
}
```

Remove any `targets` or `overrideBrowserslist` options from tool configs, since they take precedence over the browserslist config.

For a config that needs the list itself, import it:

```js
import browserslistQuery from '@hs-web-team/eslint-config-node/browserslist-config';
```

## Projects with their own browser requirements

Override both lint settings locally.

`eslint.config.js`:

```js
import wtBrowserConfig from '@hs-web-team/eslint-config-node/browser';

export default [...wtBrowserConfig, { settings: { browsers: ['ie 11'] } }];
```

`.stylelintrc.json`:

```json
{
  "extends": "@hs-web-team/eslint-config-node/.stylelintrc.json",
  "rules": {
    "plugin/no-unsupported-browser-features": [
      true,
      { "browsers": ["ie 11"], "ignorePartialSupport": true, "severity": "warning" }
    ]
  }
}
```

## Keeping data current

`caniuse-lite` data updates through normal dependency updates. Browserslist warns in builds once the data is 6 months old.
