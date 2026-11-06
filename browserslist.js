import browserslist from 'browserslist';

// Rolling query matching the WDO Browser Support Guidelines: browsers released
// in the last 12 months, plus the current Firefox ESR. Keep in sync with the
// `plugin/no-unsupported-browser-features` browsers option in .stylelintrc.json.
const browserslistQuery = ['last 1 year', 'Firefox ESR'];

if (browserslist(browserslistQuery).length === 0) {
  throw new Error(
    `browserslist query "${browserslistQuery.join(', ')}" resolved to no browsers. ` +
      'Update caniuse-lite (npx update-browserslist-db@latest).',
  );
}

export default browserslistQuery;
