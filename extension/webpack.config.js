const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: 'src/popup.html' },
        { from: 'src/manifest.json' },
        { from: 'src/popup.css' }  
      ]
    })
  ],
  entry: {
    background: path.resolve(__dirname, 'src', 'typescript', 'background.ts'),
    popup: path.resolve(__dirname, 'src', 'typescript', 'popup.ts')
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts'],
  },
};
