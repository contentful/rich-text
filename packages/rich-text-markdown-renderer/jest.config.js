const getBaseConfig = require('../../baseJestConfig');
const package = require('./package.json');
const packageName = package.name.split('@contentful/')[1];

module.exports = {
  ...getBaseConfig(packageName),
};
