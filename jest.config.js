module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    'packages/**/!(rollup.config).{ts}',
    '!**/node_modules/**',
  ],
  roots: [
    'packages/',
  ],
  testPathIgnorePatterns: [
    "/dist/"
  ],
  moduleFileExtensions: [
    'ts',
    'js',
    'json'
  ],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  testMatch: [
    '**/*\.test.{ts|js}',
  ]
};
