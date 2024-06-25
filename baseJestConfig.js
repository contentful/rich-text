function getConfig(packageName) {
  return {
    collectCoverage: true,
    testPathIgnorePatterns: ['/dist/'],
    transform: {
      '^.+\\.tsx?$': 'ts-jest',
    },
    testMatch: ['**/*.test.[jt]s?(x)'],
    reporters: [
      'default',
      [
        'jest-junit',
        {
          outputDirectory: '../../reports',
          outputName: `${packageName}-results.xml`,
          addFileAttribute: true,
        },
      ],
    ],
  };
}

module.exports = getConfig;
