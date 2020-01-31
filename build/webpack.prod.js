const webpack = require('webpack')
const merge = require('webpack-merge')
// const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptmizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
// const UglifyjsPlugin = require('uglifyjs-webpack-plugin')
const ImageminPlguin = require('imagemin-webpack-plugin').default
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const baseConfig = require('./webpack.base')

const prodConfig = {
  mode: 'production',
  // devtool: "cheap-module-source-map",
  plugins: [
    // 使用HashedModuleIdsPlugin稳定moduleId
    new webpack.HashedModuleIdsPlugin({
      hashDigest: 'hex',
    }),
    // 使用NamedChunksPlugin稳定chunkId
    new webpack.NamedChunksPlugin(
      chunk => chunk.name || Array.from(chunk.modulesIterable, m => m.id).join('_'),
    ),
    // img压缩
    new ImageminPlguin({
      pngquant: {
        quality: '95-100',
      },
    }),
    new CompressionWebpackPlugin({
      filename: '[path].gz[query]',
      algorithm: 'gzip',
      test: /\.(js|css|html|svg)$/,
      compressionOptions: { level: 9 },
      threshold: 10240,
      minRatio: 0.8,
    }),
    new CleanWebpackPlugin(),
  ],
  optimization: {
    usedExports: true, // tree-shaking
    // moduleIds: 'hashed',
    // runtimeChunk: {
    //   name: 'manifest',
    // },
    minimize: true,
    minimizer: [
      // new UglifyjsPlugin({
      //   // 开启缓存
      //   cache: true,
      //   // 允许并发
      //   parallel: true,
      //   sourceMap: false,
      // }),
      new TerserPlugin({
        test: /\.js(\?.*)?$/i,
        cache: true,
        parallel: true,
        sourceMap: false,
      }),
      new OptmizeCssAssetsWebpackPlugin({
        cssProcessor: require('cssnano'),
        cssProcessorOptions: {
          discardComments: { removeAll: true },
        },
      }),
    ],
    splitChunks: {
      // 同时分割同步和异步代码
      chunks: 'all',
      // 形成一个代码块最小的体积
      minSize: 1000,
      // 被分割的代码需要最少被引用的次数
      minChunks: 1,
      maxAsyncRequests: 5, // 按需加载时候最大的并行请求数
      maxInitialRequests: 3, // 最大初始化请求数
      automaticNameDelimiter: '~', // 打包分割符
      // 决定生成的文件
      cacheGroups: {
        vender: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vender',
          priority: 10,
        },
        common: {
          name: 'common',
          minChunks: 2,
          priority: 30,
        },
      },
    },
  },
}

exports.default = merge(baseConfig, prodConfig)
