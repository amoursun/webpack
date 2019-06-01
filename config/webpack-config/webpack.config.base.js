const path = require('path');
const _ = require('lodash')
const webpack = require('webpack');
// const merge = require('webpack-merge');
const assign = require('../basic-config/assign')
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 生成html模板
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin'); // 优化或者压缩CSS资源
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin; // 打包依赖图
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
// extract-text-webpack-plugin@next 也可以解决 从webpack v4开始，extract-text-webpack-plugin不应该用于css。请改用mini-css-extract-plugin。
require('babel-polyfill');

const utils = require('../basic-config/utils')

const env = require('../basic-config/env.config');

const onlineStaticUrl = ''; // 静态资源上传地址

// join 链接两个文件 path.join('foo', 'baz', 'bar'); // 返回 'foo/baz/bar'
// resolve 把一个路径或路径片段的序列解析为一个绝对路径(resolve把‘／’当成根目录)
const pathJoin = (dirBase = __dirname, dir = '') => path.join(dirBase, dir);

function getLibraryPath(isDev) {
  let manifestPath;
  let libraryPath;

  if (isDev) {
    libraryPath = utils.p(env.PATH.dllDev + '/vendor-manifest.json');
    manifestPath = utils.p(env.PATH.dllDev + '/vendor-manifest.json');
  } else {
    libraryPath = utils.p(env.PATH.dllProd + '/vendor-manifest.json');
    manifestPath = utils.p(env.PATH.dllProd + '/vendor-manifest.json');
  }

  return {
    plugin: new webpack.DllReferencePlugin({
      context: utils.p(env.PATH.root),
      manifest: require(manifestPath)
    }),
    manifestPath,
    libraryPath
  };
}

const htmlWebpackPluginOptions = {
  getMinify(isDev) {
    if (isDev) {
      return false;
    }

    return {
      removeAttributeQuotes: true,
      collapseWhitespace: true,
      html5: true,
      minifyCSS: true,
      removeComments: true,
      removeEmptyAttributes: true
    };
  },

  getFileName(isDev, entryName) {
    if (isDev) {
      return `pages/${entryName}.html`;
    }

    return `../pages/${entryName}.html`;
  },

  extendData() {
  }
};

module.exports = function (options) {
  let customConfig = env.DEV ? require('../build-config/webpack.config.dev') : require('../build-config/webpack.config.prod');

  options = options || {}
  let dev = 'dev' in options ? options.dev : process.env.NODE_ENV !== 'production'
  let template =
    options.template ||
    (
      dev ? path.join(env.PATH.templates, 'dev-page.html')
        : path.join(env.PATH.templates, 'prod-page.html')
    )
  let entryName = options.entryName || 'entryName'
  let data = options.data || {}
  let entry = options.entry

  if (_.isString(entry)) {
    entry = {[entryName]: entry}
  }

  let presets = dev ? ['webpack-hot-middleware/client?reload&name=' + entryName, 'react-hot-loader/patch'] : [];
  _.each(entry, function (value, key) {
    entry[key] = presets.concat(value)
  });

  let dll = getLibraryPath(dev);

  // return merge({
  return assign({
    // 入口起点
    // entry: presets.concat(['babel-polyfill', env.PATH.src + '/index.js']),
    entry: entry,
    cache: true,
    name: entryName,
    context: env.PATH.root,
    // 输出
    output: {
      filename: !dev ? '[name].bundle.[chunkhash:6].js' : '[name].bundle.[hash:6].js',
      // publicPath: env.DEV ? env.CLIENT : `${onlineStaticUrl}/`,
      publicPath: dev ? '/dist/' : '../dest/',
      path: env.PATH.prodDist,
      chunkFilename: '[name].[chunkhash:6].js',
    },
    // 解析
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.json'],
      alias: { // import xxx from 'components/xxx'
        '@': pathJoin(env.PATH.root, 'src'),
        components: utils.p(env.PATH.src + '/components/'),
        layouts: utils.p(env.PATH.src + '/layouts/'),
        module: utils.r(env.PATH.src, 'module'),
        routes: utils.p(env.PATH.src + '/routes/'),
        stores: utils.p(env.PATH.src + '/stores/'),
        utils: utils.p(env.PATH.srcNodeModules + '/utils/'),
        common: utils.p(env.PATH.srcNodeModules + '/common/')
      },
    },
    externals: { // const {...} = React === import {...} from 'react'
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
          uglifyOptions: {
            warnings: false // 默认 false
          }
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
          // styles: {
          //   name: 'styles',
          //   test: /\.css|less$/,
          //   chunks: 'all',
          //   minChunks: 1,
          //   reuseExistingChunk: true,
          //   enforce: true,
          // }
        }
      }
    },
    // loader
    // module: {
    //   rules: require('./loader.base')(dev)
    // }, html报错要求解析 html loader
    module: assign({
      rules: require('./loader.base')(dev)
    }, {
      rules: [
        {
          test: /\.(html|md)$/,
          exclude: [env.PATH.templates],
          use: {
            loader: 'html-loader'
          }
        }
      ]
    }),
    // 目标运行环境
    // target: "web",
    // 插件
    plugins: [
      new webpack.optimize.ModuleConcatenationPlugin(),
      // new HtmlWebpackPlugin({
      //   filename: 'index.html',
      //   template: utils.p(env.PATH.static + '/index.html'),
      //   inject: true
      // }),
      new HtmlWebpackPlugin({
        hash: false,
        inject: true, // 移动端 false

        minify: htmlWebpackPluginOptions.getMinify(dev),

        filename: htmlWebpackPluginOptions.getFileName(dev, entryName),

        template: template,
        data: _.extend({
          TIME: new Date().getFullYear().toString()
          + (new Date().getMonth() + 1).toString()
          + (new Date().getDate()).toString()
          + (new Date().getHours()).toString()
          + (new Date().getMinutes()).toString(),
          I18N_VERSION: '',
          entryName: entryName,
          CONTEXT: ''
        }, data),
        // 使用 templateParameters html 里就不能使用htmlWebpackPlugin.options.xxx, 直接使用xxx
        // templateParameters: _.extend({
        //   TIME: new Date().getFullYear().toString()
        //   + (new Date().getMonth() + 1).toString()
        //   + (new Date().getDate()).toString()
        //   + (new Date().getHours()).toString()
        //   + (new Date().getMinutes()).toString(),
        //   I18N_VERSION: '',
        //   entryName: entryName,
        //   CONTEXT: ''
        // }, data)
      }),
      new AddAssetHtmlPlugin({
        filepath: dll.libraryPath,
        includeSourcemap: false,
        publicPath: '../dll',
        outputPath: dev ? 'dll' : '../dll'
      }),
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        Mobx: 'mobx',
        ReactDOM: 'react-dom',
        PropTypes: 'prop-types',
        Immutable: 'immutable',
        MobxReact: 'mobx-react',
        ReactRouterDOM: 'react-router-dom',
        Promise: 'bluebird', // 全功能的Promise库
        _: 'lodash'
      }),
      new webpack.DefinePlugin(
        Object.keys(env).reduce((res, k) => {
          res[`__${k}__`] = JSON.stringify(env[k]);
          return res;
        }, {}),
      ),
      dll.plugin,
      new ExtractTextWebpackPlugin({
        filename: '[name].[contenthash:6].css',
        disable: dev
      }),
      // new BundleAnalyzerPlugin({analyzerPort: 4000})
    ]
  }, customConfig)
};