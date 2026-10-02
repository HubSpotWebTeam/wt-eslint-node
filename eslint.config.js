import wtConfig from './index.js';

export default [
  { ignores: ['playground/**'] },
  ...wtConfig,
  // Cypress utility files use globals (Cypress, cy) injected by the Cypress
  // runtime — declare them so no-undef doesn't false-positive on this directory.
  {
    files: ['cypress/**'],
    languageOptions: {
      globals: {
        Cypress: 'readonly',
        cy: 'readonly',
      },
    },
  },
];
