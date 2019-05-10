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
        path: path.resolve(__dirname, '../dist'),
        filename: 'js/[name].[chunkhash].js',
    },
    // 插件
    plugins: [
        // new CleanWebpackPlugin(['dist'], {
        //     root: path.resolve(__dirname, '../') // webpack打包报错：clean-webpack-plugin only accepts an options object
        // }),
        new CleanWebpackPlugin(),
        new webpack.HashedModuleIdsPlugin()
    ],
    // 代码分离相关
    optimization: {
        nodeEnv: 'production',
        minimizer: [new UglifyJSPlugin()],
        runtimeChunk: {
            name: 'manifest'
        },// TODO 会抽取项目公共资源??
        splitChunks: {
            minSize: 30000,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            name: false,
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendor',
                    chunks: 'initial',
                }
            }
        }
    }
});