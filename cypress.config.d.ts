/// <reference types="cypress" />

export declare const envs: {
  currentEnv: string;
  DEV: string;
  QA: string;
  PROD: string;
};

export declare const config: Cypress.ConfigOptions;

export declare function setupNodeEvents(
  on: Cypress.PluginEvents,
  config: Cypress.PluginConfigOptions
): Promise<Cypress.PluginConfigOptions>;

export declare function getDevBaseUrl(): string | null;
export declare function getBaseUrls(): Record<string, string | null> | null;
