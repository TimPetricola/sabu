var webpack = require('webpack')
var path = require('path')
var ExtractTextPlugin = require('extract-text-webpack-plugin')

var postcssImport = require('postcss-import')
var autoprefixer = require('autoprefixer')
var postcssCustomProperties = require('postcss-custom-properties')

var entries = ['./app/index']
if (process.env.NODE_ENV !== 'production') {
  entries.push('webpack-dev-server/client?http://localhost:3000')
}

module.exports = {
  devtool: 'eval',
  entry: entries,
  output: {
    path: path.resolve('app/dist'),
    filename: 'bundle.js',
    publicPath: '/dist/'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ['babel?stage=0'],
        exclude: /node_modules/,
        include: __dirname
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style', 'css!postcss')
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin('bundle.css'),
    new webpack.NoErrorsPlugin(),
  ],
  postcss: function() {
    return [
      postcssImport({
        onImport: function (files) {
          files.forEach(this.addDependency);
        }.bind(this)
      }),
      autoprefixer,
      postcssCustomProperties
    ];
  }
}

