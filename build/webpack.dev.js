const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
// const AddAssetHtmlWebpackPlugin = require('add-asset-html-webpack-plugin')

const baseConfig = require('./webpack.base')

const resolve = url => path.resolve(__dirname, url)

const devConfig = {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  plugins: [
    // new Webpack.HotModuleReplacementPlugin()
    new webpack.DllReferencePlugin({
      manifest: resolve('../dll/vendors.manifest.json'),
    }),
    // new AddAssetHtmlWebpackPlugin({
    //   filepath: resolve('../dll/vendors.dll.js'),
    // }),
  ],
  optimization: {
    usedExports: true,
  },
  devServer: {
    overlay: true,
    port: 3000,
    // open: true,
    stats: 'errors-only',
    // hot:true,
    // hotOnly:true
  },
}

exports.default = merge(baseConfig, devConfig)
