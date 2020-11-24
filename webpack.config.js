const path = require('path');
const webpack = require('webpack');
const CopyPlugin = require("copy-webpack-plugin");
const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const ReactRefreshTypeScript = require('react-refresh-typescript').default;

const isDevelopment = process.env.NODE_ENV !== 'production'

console.log('Mode: ', isDevelopment ? 'development' : 'production');

module.exports = {
  mode: isDevelopment ? 'development' : 'production',
  entry: './src/client/App.tsx',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        loader: "ts-loader",
        exclude: /node_modules/,
        options: {
          configFile: 'tsconfig.client.json',
          getCustomTransformers: () => (
            isDevelopment
              ? {
                // before: [ReactRefreshTypeScript()]
              }
              : {}
          ),
        }
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
    hot: true,
    historyApiFallback: true,
    liveReload: false,
    sockHost: 'localhost',
    sockPort: 8080,
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "./src/client/index.html", to: "index.html" },
      ],
    }),
    isDevelopment && new webpack.HotModuleReplacementPlugin(),
    isDevelopment && new ReactRefreshPlugin({
      overlay: {
        sockIntegration: "wds",
        sockHost: 'localhost',
        sockPort: 8080,
      },
    }),
  ].filter(Boolean),
};
