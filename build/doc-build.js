'use strict'
require('./check-versions')()

process.env.NODE_ENV = 'production'

const ora = require('ora')
const rm = require('rimraf')
const path = require('path')
const chalk = require('chalk')
const webpack = require('webpack')

const configFn = require('./webpack.conf')

const spinner = ora('building for production...')

module.exports = function (config) {
  const outPath = config.out || path.join(process.cwd(), 'dist')
  const webpackConfig = configFn(config)

  spinner.start()

  rm(path.join(outPath, 'static'), err => {
    if (err) throw err

    webpack(webpackConfig, (err, stats) => {
      spinner.stop()
      if (err) throw err
      
      if (stats.hasErrors()) {
        console.log(chalk.red('  Build failed with errors.\n'))
        process.exit(1)
      }

      console.log(chalk.cyan('  Build complete.\n'))
      console.log(chalk.yellow(
        '  Tip: built files are meant to be served over an HTTP server.\n' +
        '  Opening index.html over file:// won\'t work.\n'
      ))
    })
  })
}
