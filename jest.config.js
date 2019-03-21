module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    'packages/**/!(rollup.config).{js|ts|tsx}',
    '!**/node_modules/**',
    '!**/__test__/**',
    '!**/dist/**',
    '!packages/rich-text-types/tools/**',
    '!packages/rich-text-plain-text-renderer/bin/**',
    '!packages/rich-text-links/bin/**',
    '!packages/rich-text-from-markdow/index.d.ts',
    '!packages/gatsby-transformer-contentful-richtext/*.js',
  ],
  roots: ['packages/'],
  testPathIgnorePatterns: ['/dist/', '/gatsby-transformer-contentful-richtext/'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testMatch: ['**/*.test.{tsx|ts|js}'],
};
