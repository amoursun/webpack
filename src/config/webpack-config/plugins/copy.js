var CopyWebpackPlugin = require('copy-webpack-plugin')
var minify = require('minify')
var config = require('../../basic-config/env.config')
var nps = require('path')

var array = [
  {
    // from: {
    //   glob: nps.join(config.PATH.extra, '**/*'), dot: false
    // },
    from: nps.join(config.PATH.src, 'extra'),
    // relative path
    context: config.PATH.extra,
    // to: '../extra',
    to: nps.join(config.PATH.prod, 'extra'),
    toType: 'dir',
    // cache: true,
    transform: function (body, from) {
      var ext = from.replace(/.+\.(.+?)$/, '$1')
      var isI18n = /\/i18n\//.test(from) && ext === 'js'

      return new Promise(function (resolve, reject) {
        var method = minify[ext]
        if (!method) {
          resolve(body)
          return
        }
        method(body.toString(), function (error, data) {
          if (error) {
            reject(error)
            console.error(error)
            process.exit(1)
          }
          if (isI18n) {
            data = data + '\nlang || _lang;'
          }
          if (ext === 'js') {
            data = '/* eslint-disable */\n' + data
          }
          resolve(data)
        })
      })
    }
  }
]

module.exports = new CopyWebpackPlugin(array, {debug: null})
