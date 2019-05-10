const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 生成html模板

const env = require('./env.config');

const rootDir = path.resolve(__dirname);
const srcDir = path.join(rootDir, '../src');
const distDir = path.join(rootDir, '../dist');

const pathJoin = (dir) => path.join(__dirname, '..', dir);
const pathResolve = (dir) => path.resolve(__dirname, dir);

module.exports = {
    // 入口起点
    entry: [
        'babel-polyfill',
        'react-hot-loader/patch',
        srcDir + '/index.js'
    ],
    // 输出
    output: {
        path: pathResolve('../dist'),
        filename: '[name].js'
    },
    // 解析
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json'],
        alias: { // import xxx from 'components/xxx'
            '@': pathJoin('src'),
            components: path.join(srcDir, 'components'),
            layouts: path.join(srcDir, 'layouts'),
            module: path.join(srcDir, 'module'),
            utils: path.join(srcDir, 'utils')
        },
    },
    externals: {
        React: 'react',
        ReactDOM: 'react-dom',
        PropTypes: 'prop-types',
        ReactRouterDOM: 'react-router-dom',
        Mobx: 'mobx',
        MobxReact: 'mobx-react',
    },
    // loader
    module: require('./loader.base'),
    // 目标运行环境
    target: "web",
    // 插件
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'index.html',
            inject: 'body'
        })
    ]
};
