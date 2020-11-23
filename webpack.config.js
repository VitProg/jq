const path = require('path');
const webpack = require('webpack');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: "production",
  entry: './src/client/App.tsx',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "ts-loader",
            options: {
              configFile: 'tsconfig.client.json',
            }
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist/client')
  },
  devServer: {
    contentBase: path.resolve(__dirname, './dist/client'),
    hot: true
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "./src/client/index.html", to: "index.html" },
      ],
    }),
    new webpack.HotModuleReplacementPlugin({
      //
    })
  ],
};
