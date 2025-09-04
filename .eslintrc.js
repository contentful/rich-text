module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:lingui/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react', 'react-hooks', '@typescript-eslint', 'eslint-plugin-import-helpers', 'lingui'],
  rules: {
    'react-hooks/exhaustive-deps': 'error',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'import-helpers/order-imports': [
      'warn',
      {
        newlinesBetween: 'always',
        groups: ['/^react/', 'module', ['parent', 'sibling', 'index']],
        alphabetize: { order: 'asc', ignoreCase: true },
      },
    ],
    'no-restricted-imports': ['warn'],
    'react/react-in-jsx-scope': 'off',
  },

  overrides: [
    {
      files: ['packages/rich-text-types/**/*.*'],
      excludedFiles: [
        '*.test.{js,ts,tsx}',
        '**/__tests__/**/*.*',
        '**/__test__/**/*.*',
        '**/benchmark/**/*.*',
      ],
      rules: {
        'lingui/no-unlocalized-strings': [
          'error',
          {
            ignore: [
              // Ignore strings which are a single "word" (no spaces)
              '^(?![A-Z])\\S+$',
              '^(?![a-z])\\S+$',
              // Ignore UPPERCASE literals
              '^[A-Z0-9_-]+$',
              'Link',
              'ResourceLink',
              'Entry',
              'Asset',
            ],
            ignoreNames: [
              // Ignore UPPERCASE names
              { regex: { pattern: '^[A-Z0-9_-]+$' } },
            ],
            ignoreFunctions: ['Error', 'console.*', 'require', '*.startsWith'],
          },
        ],
      },
    },
  ],

  settings: {
    react: { version: 'detect' },
  },
};
