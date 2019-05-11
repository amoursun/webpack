const path = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const rootDir = path.resolve(__dirname);
const staticDir = path.resolve(rootDir, '../dest');

const names = require('./name.config');

console.log('dependencies', names.dependencies);

module.exports = {
    mode: 'production',
    entry: {
        vendor: names.dependencies.concat([/*添加其他依赖*/]),
    },
    output: {
        path: path.resolve(staticDir, 'dll'),
        filename: 'dll.[name].[chunkhash].js',
        library: 'dll_[name]_[chunkhash]',
    },
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                sourceMap: true,
            }),
            new OptimizeCSSAssetsPlugin({}),
        ],
    },
    module: require('./loader.base'),
    plugins: [
        new webpack.DllPlugin({
            // manifest.json文件的输出位置
            path: path.resolve(staticDir, 'dll', 'manifest.dll.json'),
            // 定义打包的公共vendor文件对外暴露的函数名
            name: 'dll_[name]_[chunkhash]',
            context: rootDir,
        }),
        new MiniCssExtractPlugin({
            filename: 'dll.[name].[chunkhash].css',
            allChunks: true,
        }),
    ],
};

