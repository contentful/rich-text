module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    'packages/**/!(rollup.config).{ts}',
    '!**/node_modules/**',
  ],
  roots: [
    'packages/',
  ],
  moduleFileExtensions: [
    'ts',
    'js',
  ],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  testMatch: [
    '**/*\.test.ts',
  ]
};
