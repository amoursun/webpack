const path = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const rootDir = path.resolve(__dirname);

const utils = require('./utils')
const names = require('./name.config');
const env = require('./env.config');

module.exports = {
  mode: 'development',
  context: utils.p(env.PATH.src),
  entry: {
    vendor: names.dependencies.concat([/*添加其他依赖*/]),
  },
  output: {
    path: env.PATH.dllDev,
    filename: '[name].bundle.[chunkhash:6].js',
    library: 'dll_[name]_lib',
  },
  // optimization: {}, // dllDev 不需要压缩
  module: require('./loader.base'),
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"development"',
      '__PRODUCTION__': false,
      '__DEVELOPMENT__': true,
      '__DEVTOOLS__': true
    }),
    new webpack.DllPlugin({
      // manifest.json文件的输出位置
      path: utils.p(env.PATH.dllDev + '/[name]-manifest.json'),
      // path: path.resolve(staticDir, 'dll', '[name]-manifest.dll.json'),
      // 定义打包的公共vendor文件对外暴露的函数名
      name: 'dll_[name]_lib',
      context: utils.p(env.PATH.src),
    }),
    new MiniCssExtractPlugin({
      filename: '[name].bundle.[chunkhash:6].css',
      allChunks: true,
    }),
  ],
};

