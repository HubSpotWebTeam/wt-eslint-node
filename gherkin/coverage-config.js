// Tag combinations the suite as a whole must contain at least one scenario for.
// One scenario may satisfy several entries, e.g. a scenario tagged @qa @prod @en @smoke
// covers both of these.
//
// Override per repo with a `gherkin-coverage.json` file next to package.json, either as a
// bare array of combinations or as `{ "requiredCombinations": [...] }`.
export default [
  ['@smoke', '@qa', '@en'],
  ['@smoke', '@prod', '@en'],
];
