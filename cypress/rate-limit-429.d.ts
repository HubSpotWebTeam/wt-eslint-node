/// <reference types="cypress" />

// Side-effect-only module: importing it registers the Cloudflare-429 Cypress/Cucumber hooks.
// There are no exported bindings — this declaration just makes the bare import resolvable in
// TypeScript consumers:
//
//   import '@hs-web-team/eslint-config-node/cypress/rate-limit-429';

export {};
