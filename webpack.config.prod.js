const tsconfigPathsWebpackPlugin = require('tsconfig-paths-webpack-plugin');
const devConfig = require('./webpack.config.dev');

const config = {
  ...devConfig,
  devtool: 'source-map',
  mode: 'production',
  target: 'node',

  resolve: {
    ...devConfig.resolve,
    plugins: [
      new tsconfigPathsWebpackPlugin({
        configFile: 'tsconfig.prod.json',
      }),
    ],
  },
};

module.exports = config;
