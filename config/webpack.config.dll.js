const path = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const rootDir = path.resolve(__dirname);
const staticDir = path.resolve(rootDir, '../dist');

module.exports = {
    mode: 'production',
    entry: {
        vendor: [
            'react',
            'react-dom',
            'prop-types',
            'classnames',
            'react-router',
            'lodash',
            'mobx',
            'mobx-react',
            'moment',
            'core-js'
        ],
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
            path: path.resolve(staticDir, 'dll', 'manifest.dll.json'),
            name: 'dll_[name]_[chunkhash]',
            context: rootDir,
        }),
        new MiniCssExtractPlugin({
            filename: 'dll.[name].[chunkhash].css',
            allChunks: true,
        }),
    ],
};
