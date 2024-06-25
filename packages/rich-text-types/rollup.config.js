import copy from 'rollup-plugin-copy';

import config from '../../rollup.config';
import { main as outputFile } from './package.json';

const customConfig = () => {
  const baseConfig = config(outputFile);

  return {
    ...baseConfig,
    output: {
      // Maintain the same file names & folders structure as "src"
      // This is necessary to resolve generated JSON schema files
      //
      // https://rollupjs.org/guide/en/#outputpreservemodules
      preserveModules: true,
    },
    plugins: [
      ...baseConfig.plugins,
      copy({
        targets: [
          {
            src: 'src/schemas/generated',
            dest: 'dist/schemas',
          },
        ],
      }),
    ],
  };
};

export default customConfig();
