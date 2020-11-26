const path = require('path');
const webpack = require('webpack');
const CopyPlugin = require("copy-webpack-plugin");
const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const ReactRefreshTypeScript = require('react-refresh-typescript').default;
const dotenv = require('dotenv');

const isDevelopment = process.env.NODE_ENV !== 'production'

dotenv.config({
  path: '.env'
});

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
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development',
      FORUM_AVATAR_BASE_URL: undefined,
      FORUM_GALLERY_BASE_URL: undefined,
      FORUM_ATTACHMENTS_BASE_URL: undefined,
      FORUM_USER_LINK_PATTERN: undefined,
      FORUM_DEFAULT_AVATAR: undefined,
      REDIS_HOST: undefined,
      REDIS_PORT: undefined,
      REDIS_DB: undefined,
      REDIS_PASSWORD: undefined,
      REDIS_PREFIX: undefined,
    })
  ].filter(Boolean),
};
