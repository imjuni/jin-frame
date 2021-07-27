const path = require('path');
const tsconfigPathsWebpackPlugin = require('tsconfig-paths-webpack-plugin');
const webpackNodeExternals = require('webpack-node-externals');
const distPath = path.resolve(path.join(__dirname, 'dist'));
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
