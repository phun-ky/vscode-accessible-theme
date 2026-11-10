import { defineConfig, globalIgnores } from 'eslint/config';
import customConfig from 'eslint-config-phun-ky';
import globals from 'globals';

export default defineConfig([
  // Written by release-it
  globalIgnores(['CHANGELOG.md']),
  {
    extends: [customConfig]
  },
  {
    files: ['scripts/**/*.mjs'],
    languageOptions: {
      globals: {
        ...globals.node
      }
    },
    rules: {
      // Command-line scripts report to the terminal
      'no-console': 'off'
    }
  }
]);
