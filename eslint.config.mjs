import { defineConfig, globalIgnores } from 'eslint/config';
import customConfig from 'eslint-config-phun-ky';

export default defineConfig([
  // Written by release-it
  globalIgnores(['CHANGELOG.md']),
  {
    extends: [customConfig]
  }
]);
