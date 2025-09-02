import { defineConfig } from '@lingui/cli';

export default defineConfig({
  sourceLocale: 'en-US',
  locales: ['en-US'],
  catalogs: [
    {
      path: './{locale}',
      include: [
        '<rootDir>/packages/rich-text-types',
      ],
      exclude: [
        '**/node_modules/**',
        '**/test/**',
        '**/tests/**',
        '**/__tests__/**',
        '**/__mocks__/**',
        '**/?(*.)(spec|test).[jt]s?(x)',
      ],
    },
  ],
  orderBy: 'messageId',
});
