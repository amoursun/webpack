var path = require('path')
var config = require('./env.config')
module.exports =  {
    rules: [
        {
            test: /\.jsx?$/,
            exclude: /(node_modules|bower_components)/,// 屏蔽不需要处理的文件（文件夹）（可选）
            include: [config.PATH.src],
            loader: 'babel-loader',
            options: {
                presets: ['es2015', 'stage-0', 'react'],
                cacheDirectory: true
            },
        },
        {
            test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
            loader: 'url-loader',
            options: {
                limit: 10000,
                name: 'images/[name].[hash:7].[ext]'
            }
        },
        {
            test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
            loader: 'url-loader',
            options: {
                limit: 10000,
                name: 'fonts/[name].[hash:7].[ext]'
            }
        },
        {
            test: /\.css|less$/,
            use: [
                { loader: 'style-loader' },
                {
                    loader: 'css-loader',
                    options: {
                        modules: true,
                        localIdentName: '[path][name]__[local]--[hash:base64:5]'
                    }
                },
                { loader: 'less-loader',
                    options: {
                        modules: true,
                        localIdentName: '[path][name]__[local]--[hash:base64:5]'
                    }
                }
            ]
        }
    ]
};