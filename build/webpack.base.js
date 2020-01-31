const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HappyPack = require('happypack')
const os = require('os')
const WebpackBar = require('webpackbar')
const CircularDependencyPlugin = require('circular-dependency-plugin')
// const CopyPlugin = require('copy-webpack-plugin')

const resolve = url => path.resolve(__dirname, url)
// 环境变量
const { NODE_ENV } = process.env

const source = resolve('../src')

module.exports = {
  context: source, // 基础目录
  // 统计信息， node.js api无效
  stats: {
    assets: true, // 添加资源信息
    builtAt: true, // 添加构建日期和构建时间信息
    children: false, // 添加 children 信息
    colors: true,
    chunks: false, // 添加 chunk 信息（设置为 `false` 能允许较少的冗长输出）
    chunkModules: true, // 将构建模块信息添加到 chunk 信息
    env: true, // 添加 --env information
    entrypoints: true,
    errors: true, // 添加错误信息
    errorDetails: true, // 添加错误的详细信息（就像解析日志一样）
    hash: true, // 添加 compilation 的哈希值
    modules: false, // 添加构建模块信息
    moduleTrace: true, // 显示警告/错误的依赖和来源（从 webpack 2.5.0 开始）
    performance: true, // 当文件大小超过 `performance.maxAssetSize` 时显示性能提示
    publicPath: true, // 添加 public path 的信息
    timings: true, // 添加时间信息
    version: true, // 添加 webpack 版本信息
    warnings: false, // 添加警告
  },
  watchOptions: {
    // 不监听的 node_modules 目录下的文件
    ignored: /node_modules/,
  },
  entry: resolve('../src/index.js'),
  output: {
    filename: 'js/[name].[contenthash:5].js',
    chunkFilename: 'js/[name].chunk.[contenthash:5].js',
    path: resolve('../dist'), // 对应一个绝对路径，此路径是你希望一次性打包的目录
    publicPath: '', // 静态文件的
    // library:'library', // 导出的变量名 或者 模块名
    // libraryTarget:'umd'
  },
  resolve: {
    extensions: ['.js', '.json'],
    // 创建 import 或 require 的别名
    alias: {
      '@': source,
    },
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'happypack/loader?id=happyBabel',
        exclude: /node_modules/,
        include: source,
        // use: {
        //   loader: 'babel-loader?cacheDirectory=true',
        // },
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: NODE_ENV === 'production' ? MiniCssExtractPlugin.loader : 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              // 支持@import引入css也会被postcss-loader/sass-loader处理
              importLoaders: 2,
            },
          },
          {
            loader: 'postcss-loader',
          },
        ],
      },
      {
        test: /\.(scss|sass)$/,
        use: [
          {
            loader: NODE_ENV === 'production' ? MiniCssExtractPlugin.loader : 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              // 支持@import引入css也会被postcss-loader/sass-loader处理
              importLoaders: 2,
            },
          },
          {
            loader: 'postcss-loader',
          },
          {
            loader: 'sass-loader',
          },
        ],
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: {
          loader: 'url-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'images',
            limit: 3000,
          },
        },
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        use: {
          loader: 'file-loader',
          options: {
            outputPath: 'font',
          },
        },
      },
    ],
  },
  plugins: [
    new HappyPack({
      // 这个HappyPack的“名字”就叫做happyBabel，和楼上的查询参数遥相呼应
      id: 'happyBabel',
      // 指定进程池
      threadPool: HappyPack.ThreadPool({ size: os.cpus().length }),
      loaders: ['babel-loader?cacheDirectory', 'eslint-loader'],
    }),
    // new CopyPlugin([
    //   {
    //     from: resolve('../dll'),
    //     ignore: ['dll/*'],
    //     to: resolve('../dist'),
    //   },
    // ]),
    new WebpackBar(),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:5].css',
      chunkFilename: 'css/[name].chunk.[contenthash:5].css',
    }),
    new HtmlWebpackPlugin({
      // 生成页面title标题， <%=htmlWebpackPlugin.options.title%>在html这样使用
      title: '首页',
      // 生成html的文件名
      filename: 'index.html',
      // 指定生成的文件所依赖的模板
      template: resolve('../src/index.html'),
      // script标签插入在html文件中的位置
      inject: true,
      // 对html文件进行压缩
      minify: {
        // 移除属性的引号
        removeAttributeQuotes: true,
        // 移除注释
        removeComments: true,
        // 去掉文件中的空格
        collapseWhitespace: true,
      },
    }),
    new webpack.ProvidePlugin({
      NODE_ENV: process.env.NODE_ENV,
    }),
    new CircularDependencyPlugin({
      // exclude detection of files based on a RegExp
      exclude: /a\.js|node_modules/,
      // include specific files based on a RegExp
      include: /dir/,
      // add errors to webpack instead of warnings
      failOnError: true,
      // allow import cycles that include an asyncronous import,
      // e.g. via import(/* webpackMode: "weak" */ './file.js')
      allowAsyncCycles: false,
      // set the current working directory for displaying module paths
      cwd: process.cwd(),
    }),
  ],
}
