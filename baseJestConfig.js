function getConfig(packageName) {
  return {
    collectCoverage: true,
    testPathIgnorePatterns: ['/dist/'],
    moduleNameMapper: {
      '^(\\.{1,2}/.*)\\.js$': '$1', // strip .js so TS imports resolve
    },
    transform: {
      '^.+\\.(j|t)sx?$': '@swc/jest',
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
