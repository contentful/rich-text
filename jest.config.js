module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    'packages/**/*.[jt]s?(x)',
    '!**/node_modules/**',
    '!**/__test__/**',
    '!**/dist/**',
    '!**/rollup.config.js',
    '!packages/rich-text-types/tools/**',
    '!packages/rich-text-plain-text-renderer/bin/**',
    '!packages/rich-text-links/bin/**',
    '!packages/rich-text-from-markdown/index.d.ts',
    '!packages/gatsby-transformer-contentful-richtext/**',
  ],
  roots: ['packages/'],
  testPathIgnorePatterns: ['/dist/', '/gatsby-transformer-contentful-richtext/'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testMatch: ['**/*.test.[jt]s?(x)'],
};
