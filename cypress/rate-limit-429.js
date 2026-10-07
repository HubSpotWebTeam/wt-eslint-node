import { Before } from '@badeball/cypress-cucumber-preprocessor';

// All Cloudflare-429 handling lives in this one file so the three hooks can share plain
// module state. Consumers import it (side-effect only) from a file inside their
// `stepDefinitions` glob:
//
//   import '@hs-web-team/eslint-config-node/cypress/rate-limit-429';
//
// It MUST be imported from a step-definitions file, never the support file: the cucumber
// Before() hook (used to skip a Scenario Outline's remaining examples) registers against a
// global registry that only exists while step-definition files are bundled. Importing from
// support/e2e.js throws "Expected to find a global registry ...". Detection and marking use
// Mocha's global beforeEach/afterEach, which are allowed in any bundled file, so keeping all
// three in one module means a single import wires up everything.
//
// Using Mocha's afterEach (NOT cucumber After()) is deliberate: the cucumber preprocessor's
// After() does NOT run when a scenario fails, and a 429 fails the scenario, so After() could
// never react to it.
// https://github.com/badeball/cypress-cucumber-preprocessor/blob/master/docs/cucumber-basics.md#hooks

/** @typedef {{ url: string, ray: string | string[], at: string }} RateLimit429Hit */

// Shared across a feature's scenarios; resets between spec files (so nothing leaks between features).
/** @type {RateLimit429Hit | null} */
let rateLimit429Hit = null;
/** @type {string | null} */
let currentOutline = null;
/** @type {string | null} */
let rateLimited429Outline = null;

// cy.state('runnable') is an internal API
const currentRunnable = () => cy.state('runnable');

// Cypress decides whether to requeue a failed test before afterEach runs, so a 429'd test's
// retries must be cancelled here, during the test.
const disableRetriesForCurrentTest = () => {
  const runnable = currentRunnable();
  if (!runnable) {
    return;
  }
  /* eslint-disable no-underscore-dangle */
  const attempt = runnable._currentRetry ?? 0;
  // Pin both; Cypress re-expands _retries from _maxRetries otherwise.
  runnable._retries = attempt;
  runnable._maxRetries = attempt;
  /* eslint-enable no-underscore-dangle */
};

beforeEach(() => {
  rateLimit429Hit = null; // to ensure each scenario starts clean, in case a previous afterEach was skipped

  // Observe every response (middleware:true never modifies). Genuine Cloudflare 429s
  // carry a cf-ray header; third-party 429s (Google c2dm, pixels, etc.) don't, so ignore
  // those — otherwise we'd wrongly disable retries / skip an outline. Gate on the header,
  // not the host, since the suite may hit several Cloudflare-fronted hosts.
  cy.intercept({ url: '**/*', middleware: true }, req => {
    req.on('response', res => {
      const ray = res.headers['cf-ray'];
      if (res.statusCode === 429 && ray) {
        rateLimit429Hit = { url: req.url, ray, at: new Date().toISOString() };
        disableRetriesForCurrentTest();
      }
    });
  });
});

afterEach(function () {
  const hit = rateLimit429Hit;
  rateLimit429Hit = null;
  if (!hit) {
    return;
  }

  const test = this.currentTest;

  // If this example failed on the 429, record its outline so the Before hook below skips the
  // outline's remaining examples — they hit the same blocked endpoint and would 429 too.
  if (test?.state === 'failed') {
    rateLimited429Outline = currentOutline;
  }

  // Don't throw here — an afterEach throw skips the rest of the spec.
  const marker =
    `[RATE-LIMIT-429] Cloudflare 429 rate limit (IP blocked ~10 min). ` +
    `Retries disabled for this test. at=${hit.at} url=${hit.url} cf-ray=${hit.ray}`;

  if (test?.err) {
    test.err.message = `${marker}\n\n${test.err.message}`;
  } else {
    Cypress.log({ name: '429', message: marker });
  }
});

// A 429 blocks the IP ~10 min, so every later example of the same Scenario Outline would 429
// too. Identify the outline by pickle.astNodeIds[0] (the outline node, identical across its
// rows — the title can't be used, it interpolates the example values). Record the 429'd
// example's outline, skip the rest; any other scenario clears it.
Before(({ pickle }) => {
  currentOutline = pickle.astNodeIds?.[0] ?? null;
  if (rateLimited429Outline) {
    if (currentOutline === rateLimited429Outline) {
      return 'skipped';
    }
    rateLimited429Outline = null;
  }
  return undefined;
});
