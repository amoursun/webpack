const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 生成html模板
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin'); // 优化或者压缩CSS资源
require('babel-polyfill');

const env = require('./env.config');

const cdnUrl = ''; // 静态资源上传地址

// join 链接两个文件 path.join('foo', 'baz', 'bar'); // 返回 'foo/baz/bar'
// resolve 把一个路径或路径片段的序列解析为一个绝对路径(resolve把‘／’当成根目录)
const pathJoin = (dirBase = __dirname, dir = '') => path.join(dirBase, dir);

module.exports = {
    // 入口起点
    entry: [
        'babel-polyfill',
        'react-hot-loader/patch', // 用于启动hmr
        'webpack-hot-middleware/client',
        env.PATH.src + '/index.js'
    ],
    // 输出
    output: {
        filename: env.DEV ? '[name].js' : '[name]-[chunkhash:8].js',
        publicPath: env.DEV ? env.CLIENT : `${cdnUrl}/`,
        path: env.PATH.dev,
        chunkFilename: '[name].[chunkhash:8].js',
    },
    // 解析
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json'],
        alias: { // import xxx from 'components/xxx'
            '@': pathJoin(env.PATH.root, 'src'),
            components: path.join(env.PATH.src, '/components/'),
            layouts: path.join(env.PATH.src, '/layouts/'),
            module: path.join(env.PATH.src, '/module/'),
            routes: path.join(env.PATH.src, '/routes/'),
            stores: path.join(env.PATH.src, '/stores/'),
            utils: path.join(env.PATH.srcNodeModules, '/utils/'),
            common: path.join(env.PATH.srcNodeModules, '/common/')
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
    // 代码分离相关
    optimization: {
        nodeEnv: 'production',
        noEmitOnErrors: true, // 替换 new webpack.NoEmitOnErrorsPlugin()
        concatenateModules: true, // 替换 new webpack.optimize.ModuleConcatenationPlugin(),// 预编译
        runtimeChunk: {
            name: 'manifest'
        },// TODO 会抽取项目公共资源??
        // runtimeChunk: "single"
        // 等价于
        // runtimeChunk: {
        //     name: "manifest"
        // }
        minimizer: [
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                sourceMap: true,
            }),
            new OptimizeCSSAssetsPlugin({}),
        ],
        splitChunks: {
            minSize: 30000,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            name: false, // 抽取出来文件的名字，默认为 true，表示自动生成文件名；
            cacheGroups: {
                vendor: {
                    chunks: 'all',
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendor',
                    minChunks: 1,
                    maxInitialRequests: 5,
                    minSize: 0,
                    priority: 100,
                },
                common: {
                    chunks: 'all',
                    test: /[\\/]src[\\/]/,
                    name: 'common',
                    minChunks: 2,
                    maxInitialRequests: 5,
                    minSize: 0,
                    priority: 1,
                },
            }
        }
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
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
            Mobx: 'mobx',
            ReactDOM: 'react-dom',
            PropTypes: 'prop-types',
            Immutable: 'immutable',
            MobxReact: 'mobx-react',
            ReactRouterDOM: 'react-router-dom',
            Promise: 'bluebird', // 全功能的Promise库
        }),
        new webpack.DefinePlugin(
            Object.keys(env).reduce((res, k) => {
                res[`__${k}__`] = JSON.stringify(env[k]);
                return res;
            }, {}),
        ),
        new webpack.DllReferencePlugin({
            context: env.PATH.root,
            manifest: require('../dest/dll/manifest.dll.json'),
        }),
    ]
};
