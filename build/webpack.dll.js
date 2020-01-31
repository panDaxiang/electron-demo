const { resolve } = require('path')
const webpack = require('webpack')

module.exports = {
  mode: 'production',
  entry: {
    vendors: ['react', 'react-dom', 'redux', 'react-redux'],
  },
  output: {
    filename: '[name].dll.js',
    path: resolve(__dirname, '../dll'),
    library: '[name]',
  },
  plugins: [
    new webpack.DllPlugin({
      name: '[name]',
      path: resolve(__dirname, '../dll/[name].manifest.json'),
    }),
  ],
}
