const ExtractTextPlugin = require('extract-text-webpack-plugin')
const webpack = require('webpack')

export default {
  resolve: {

    extensions: ['.js', '.scss'],

  },
  entry: {
    app: './src/client/app/app.js',
    www: './src/client/app/vndr.js',
  },
  output: {
    filename: '[name].js',
    sourceMapFilename: '[name].map',
  },

  devtool: 'cheap-module-source-map',
  watch: true,

  module: {
    rules: [

      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [{
          loader: 'babel-loader',
        }],
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        loader: ExtractTextPlugin.extract({
          fallbackLoader: 'style-loader',
          loader: [
                   { loader: 'css-loader', query: { modules: false } },
            'sass-loader',
          ],
        }),
      },


    ],
  },

  plugins: [
    new webpack.LoaderOptionsPlugin({

      minimize: false,
      debug: false,


    }),
    new ExtractTextPlugin({
      filename: '[name].css',
      disable: false,
      allChunks: true,
    }),

  ],

}
