const path = require('path');

module.exports = {
  entry: {
    background: path.resolve(__dirname, 'src', 'typescript', 'background.ts'),
    popup: path.resolve(__dirname, 'src', 'typescript', 'popup.ts')
  },
  output: {
    path: path.resolve(__dirname, 'src'),
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
