const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

const vueLoaderConfig = require('./vue-loader.conf')
const utils = require('./utils')

const isProduction = process.env.NODE_ENV === 'production'

function assetsPath (_path) {
  return path.posix.join('static', _path)
}

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

const base = {
  context: path.resolve(__dirname, '../'),
  devtool: isProduction ? '#source-map' : false,
  entry: {
    app: './src/main.js'
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src')
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: [resolve('src'), resolve('test')],
        options: {
          formatter: require('eslint-friendly-formatter'),
          emitWarning: false
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test'), resolve('node_modules/webpack-dev-server/client')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  node: {
    // prevent webpack from injecting useless setImmediate polyfill because Vue
    // source contains it (although only uses it if it's native).
    setImmediate: false,
    // prevent webpack from injecting mocks to Node native modules
    // that does not make sense for the client
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': { NODE_ENV: isProduction ? '"production"' : '"development"' }
    }),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: 'static',
        ignore: ['.*']
      }
    ]),
    new FriendlyErrorsPlugin({
      compilationSuccessInfo: {
        messages: [ isProduction ? 'Build success' : `Your application is running here: http://localhost:6501` ],
      },
      onErrors: utils.createNotifierCallback()
    })
  ]
}

const devServer = {
  clientLogLevel: 'warning',
  historyApiFallback: {
    rewrites: [
      { from: /.*/, to: 'static/index.html' },
    ],
  },
  hot: true,
  contentBase: false, // since we use CopyWebpackPlugin.
  compress: true,
  host: 'localhost',
  port: 6501,
  open: false,
  overlay: { warnings: false, errors: true },
  publicPath: '/',
  quiet: true,
  watchOptions: {
    poll: false
  }
}

module.exports = function (config = { webpack: {} }) {
  config.out = config.out || path.resolve(process.cwd(), 'dist')
  const output = Object.assign(
    {
      path: config.out,
      publicPath: '/',
      filename: isProduction ? assetsPath('js/[name].[hase].js') : '[name].js'
    },
    config.webpack.output
  )

  const markdownRule = {
    test: /\.md$/,
    loader: path.resolve(__dirname, './markdown-loader'),
    options: config.markdown
  }

  const rules = [ markdownRule ].concat(
    utils.styleLoaders({ sourceMap: true, usePostCSS: true })
  )
  const plugins = [
    new HtmlWebpackPlugin({
      filename: isProduction ? path.resolve(config.out, 'index.html') : 'index.html',
      template: 'index.html',
      inject: true,
      chunksSortMode: 'dependency'
    })
  ]

  let webpackConfig = base
  if (!isProduction) {
    plugins.push(
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NamedModulesPlugin(),
      new webpack.NoEmitOnErrorsPlugin()
    )
    webpackConfig = merge(base, {
      output,
      module: { rules },
      devServer,
      plugins
    })
  } else {
    plugins.push(
      new UglifyJsPlugin({
        uglifyOptions: {
          compress: {
            warnings: false
          }
        },
        sourceMap: true,
        parallel: true
      }),
      new ExtractTextPlugin({
        filename: assetsPath('css/[name].[contenthash].css'),
        allChunks: true
      }),
      new OptimizeCSSPlugin({
        cssProcessorOptions: { safe: true, map: { inline: false } }
      }),
      new webpack.HashedModuleIdsPlugin(),
      new webpack.optimize.ModuleConcatenationPlugin(),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        minChunks (module) {
          return (
            module.resource &&
            /\.js$/.test(module.resource) &&
            module.resource.indexOf(
              path.join(__dirname, '../node_modules')
            ) === 0
          )
        }
      }),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'manifest',
        minChunks: Infinity
      }),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'app',
        async: 'vendor-async',
        children: true,
        minChunks: 3
      })
    )
    webpackConfig = merge(base, {
      output,
      module: { rules },
      plugins
    })
  }

  return merge(webpackConfig, config.webpack)
}
