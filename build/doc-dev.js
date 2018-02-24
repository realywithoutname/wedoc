process.env.NODE_ENV = 'development'

const webpack = require('webpack')
const DevServer = require('webpack-dev-server')
const configFn = require('./webpack.conf')

module.exports = function (config) {
  const webpackConfig = configFn(config)
  const compiler = webpack(webpackConfig)
  const server = new DevServer(compiler, webpackConfig.devServer)
  server.listen(6501)
}