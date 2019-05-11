'use strict'
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.config.base');

const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin'); // 引入清除文件插件
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = merge(baseWebpackConfig, {
    // 模式
    mode: 'production',
    // 调试工具
    devtool: '#source-map',
    // 输出
    output: {
        path: path.resolve(__dirname, '../dest'),
        filename: 'js/[name].[chunkhash].js',
    },
    // 插件
    plugins: [
        // new CleanWebpackPlugin(['dest'], {
        //     root: path.resolve(__dirname, '../') // webpack打包报错：clean-webpack-plugin only accepts an options object
        // }),
        new CleanWebpackPlugin(),
        new webpack.HashedModuleIdsPlugin()
    ],
});