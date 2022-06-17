var path = require('path');
var fs = require('fs-extra');
var webpack = require('webpack');
var BuildPaths = require('./lib/build-paths');
var BuildExtension = require('./lib/build-extension-webpack-plugin');
var TerserPlugin = require('terser-webpack-plugin');
var CleanPlugin = require('clean-webpack-plugin');
var MiniCssExtractPlugin = require('mini-css-extract-plugin');

var manifest = fs.readJSONSync(path.join(BuildPaths.SRC_ROOT, 'manifest.json'));
var version = manifest.version;

var entries = {
  viewer: ['./extension/src/viewer.js'],
  'viewer-alert': ['./extension/styles/viewer-alert.scss'],
  options: ['./extension/src/options.js'],
  backend: ['./extension/src/backend.js'],
  omnibox: ['./extension/src/omnibox.js'],
  'omnibox-page': ['./extension/src/omnibox-page.js'],
};

function findThemes(darkness) {
  return fs
    .readdirSync(path.join('extension', 'themes', darkness))
    .filter(function (filename) {
      return /\.js$/.test(filename);
    })
    .map(function (theme) {
      return theme.replace(/\.js$/, '');
    });
}

function includeThemes(darkness, list) {
  list.forEach(function (filename) {
    entries[filename] = ['./extension/themes/' + darkness + '/' + filename + '.js'];
  });
}

var lightThemes = findThemes('light');
var darkThemes = findThemes('dark');
var themes = { light: lightThemes, dark: darkThemes };

includeThemes('light', lightThemes);
includeThemes('dark', darkThemes);

console.log('Entries list:');
console.log(entries);
console.log('\n');

var manifest = {
  mode: process.env.NODE_ENV || 'development',
  // As of manifest V3, we should use inline-source-map that doesn't contains any eval.
  devtool: 'inline-source-map',
  context: __dirname,
  entry: entries,
  output: {
    path: path.join(__dirname, 'build/json_viewer_plus/assets'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.(css|scss)$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'sass-loader',
          },
        ],
      },
    ],
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
      })
    ],
    concatenateModules: true,
  },
  resolve: {
    extensions: ['.js', '.css', '.scss'],
    modules: [path.resolve(__dirname, './extension'), 'node_modules'],
  },
  externals: [{ 'chrome-framework': 'chrome' }],
  plugins: [
    new CleanPlugin.CleanWebpackPlugin(),
    new MiniCssExtractPlugin({ filename: '[name].css' }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
        VERSION: JSON.stringify(version),
        THEMES: JSON.stringify(themes),
      },
    }),
    new webpack.NoEmitOnErrorsPlugin(),
    new BuildExtension(),
  ],
};

module.exports = manifest;
