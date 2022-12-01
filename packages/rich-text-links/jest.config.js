module.exports = {
  collectCoverage: true,
  testPathIgnorePatterns: ['/dist/'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testMatch: ['**/*.test.[jt]s?(x)'],
};
