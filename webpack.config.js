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
      exclude: [
        /node_modules/,
        /src\/server/,
        /server/,
      ],
      include: [
        /\.([jt]sx?)$/i
      ]
    }),
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development',
      FORUM_AVATAR_BASE_URL: '',
      FORUM_GALLERY_BASE_URL: '',
      FORUM_ATTACHMENTS_BASE_URL: '',
      FORUM_USER_LINK_PATTERN: '',
      FORUM_DEFAULT_AVATAR: '',
      SEO_BASE_TITLE: '',
      SEO_BASE_DESCRIPTION: '',
      SEO_BASE_KEYWORDS: '',
      FORUM_MESSAGE_PAGE_SIZE: '',
      FORUM_MESSAGE_LATEST_MAX_PAGES: '',
      FORUM_TOPIC_PAGE_SIZE: '',
      FORUM_USER_PAGE_SIZE: '',
    }),
    new webpack.DefinePlugin({
      PRODUCTION: JSON.stringify(!isDevelopment),
      DEVELOPMENT: JSON.stringify(isDevelopment),
    })
  ].filter(Boolean),
};
