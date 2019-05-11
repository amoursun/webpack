'use strict'
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.config.base');
const webpackApiMocker = require('webpack-api-mocker');

const path = require('path');
const webpack = require('webpack');
const env = require('./env.config');

const mocker = path.resolve(__dirname, '../_mocker_/index.js');

const webpackConfig = merge(baseWebpackConfig, {
    mode: 'development', // webpack4新增属性，默认返回production,提供一些默认配置，例如cache:true
    devtool: 'cheap-module-eval-source-map',
    // source-map每个module生成对应的map文件
    // eval 每一个module模块执行eval，不生成map文件，在尾部生成一个sourceURL对应前后关系，所以更快
    // cheap 列信息 VLQ编码
    // module 包含了模块之间的sourcemap

    devServer: { // 配置webpack-dev-server， 在本地启动一个服务器运行
        contentBase:path.resolve(__dirname, '../src'),// 配置开发服务运行时的文件根目录
        // host: 'localhost', // 服务器的ip地址 希望服务器外可以访问就设置 0.0.0.0
        // port: 8088, // 端口
        // open: true, // 自动打开页面
        // hot: true,
        overlay: true, // 如果代码出错，会在浏览器页面弹出“浮动层”
        host: env.HOST,
        port: env.PORT,
        hot: env.HOT,
        inline: env.INLINE,
        https: true,
        before(app) {
            webpackApiMocker(app, mocker);
        },
        // 接口代理
        proxy: {
            '/api/*': {
                target: 'https://m.mock.com/api', // 接口地址域名
                secure: false, // https接口参数为true, http接口参数为false
                changeOrigin: true, // 如果接口跨域，需要进行这个参数配置为true
                // pathRewrite: { // pathRewrite来重写地址
                //     '/api': '/'
                // }
            }
        }
    },
    plugins: [
        // 热更新相关
        // new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ],
    optimization: {
        nodeEnv: 'development',
    }
});

console.log(webpackConfig)

module.exports = webpackConfig;
