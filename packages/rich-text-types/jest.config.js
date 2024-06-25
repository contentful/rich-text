/* eslint-disable */

const getBaseConfig = require('../../baseJestConfig');
const packageJson = require('./package.json');
const packageName = packageJson.name.split('@contentful/')[1];

module.exports = {
  ...getBaseConfig(packageName),
};
