var del = require('del')
var env = require('./env.config')
var dllDevWebpackConfig = require('./dll.webpack.config.dev')

del.sync(env.PATH.dllProd, {force: true})
del.sync(env.PATH.dllDev, {force: true})

var webpack = require('webpack')
var compilerDev = webpack(dllDevWebpackConfig)

compilerDev.run(function (err) {
  if (err) {
    console.error(err)
    return
  }

  console.log('[SUCCESS] dll for Development bundle 编译完成, 请笑纳...')
})

var dllProdWebpackConfig = require('./dll.webpack.config.prod')

var webpack = require('webpack')

var compilerProd = webpack(dllProdWebpackConfig)

compilerProd.run(function (err) {
  if (err) {
    console.error(err)
    return
  }

  console.log('[SUCCESS] dll for Production bundle 编译完成, 请笑纳...')
})
