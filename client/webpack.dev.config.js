const HtmlWebpackPlugin = require('html-webpack-plugin')
const FlowtypePlugin = require('flowtype-loader/plugin')
const { resolve } = require('path')
const webpack = require('webpack')

const src = resolve(__dirname, 'src')
const dist = resolve(__dirname, 'dist')

module.exports = {
  context: src,

  entry: [
    'babel-polyfill',
    'react-hot-loader/patch',
    'webpack-dev-server/client?http://localhost:3000',
    'webpack/hot/only-dev-server',
    './index.js'
  ],

  output: {
    filename: 'bundle.js',
    path: dist,
    publicPath: '/'
  },

  devtool: 'cheap-eval-source-map',

  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        loader: 'blyss-loader'
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        enforce: 'pre',
        test: /\.styl$/,
        loader: 'stylint-loader'
      },
      {
        test: /\.styl$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              importLoaders: 1,
              localIdentName: '[name]__[local]--[hash:base64:5]'
            }
          },
          'stylus-loader'
        ]
      },
      {
        test: /\.(jpg|jpeg|png|gif|ico|svg|pdf|eof|eot|woff|ttf|woff2)$/,
        loader: 'url-loader',
        options: {
          limit: 10000
        }
      }
    ]
  },

  plugins: [
    new FlowtypePlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new HtmlWebpackPlugin({
      template: '../public/index.html',
      inject: 'body',
      favicon: '../public/favicon.ico'
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV)
      }
    })
  ],

  devServer: {
    host: 'localhost',
    port: 3000,
    hot: true,
    overlay: true,
    historyApiFallback: {
      rewrites: [{ from: /^\/$/, to: '../public/index.html' }]
    },
    proxy: {
      '/api/**': {
        target: 'http://localhost:3001',
        secure: false
      }
    }
  }
}
