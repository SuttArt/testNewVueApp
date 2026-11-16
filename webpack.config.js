import path from 'node:path'
import webpack from 'webpack'
import { VueLoaderPlugin } from 'vue-loader'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import { rootDirectory, selectProject } from './config/selection.js'
import { loadEnvironment } from './config/environment.js'

export default function createConfig(env = {}, argv = {}) {
  const project = selectProject(env.project)
  const mode = argv.mode ?? 'production'
  const production = mode === 'production'
  const variables = loadEnvironment(rootDirectory, project.config.id)
  const wsUrl = process.env.WS_URL ?? variables.WS_URL
    ?? process.env.VITE_WS_URL ?? variables.VITE_WS_URL ?? 'ws://localhost:8080/'

  return {
    mode,
    context: rootDirectory,
    entry: './src/main.js',
    output: {
      path: path.join(rootDirectory, 'dist', project.config.id),
      filename: 'assets/[name].[contenthash:8].js',
      publicPath: 'auto',
      clean: true,
    },
    resolve: {
      extensions: ['.js', '.vue', '.json'],
      alias: {
        '@': path.join(rootDirectory, 'src'),
        '@project-app$': path.resolve(rootDirectory, project.entry),
      },
    },
    module: {
      rules: [
        { test: /\.vue$/, loader: 'vue-loader' },
        { test: /\.css$/, use: [production ? MiniCssExtractPlugin.loader : 'vue-style-loader', 'css-loader'] },
        { test: /\.(png|jpe?g|gif|svg|ico|webp|woff2?)$/i, type: 'asset/resource' },
      ],
    },
    plugins: [
      new VueLoaderPlugin(),
      new webpack.DefinePlugin({
        __APP_PROJECT__: JSON.stringify(project.config),
        __TRAIN_WS_URL__: JSON.stringify(wsUrl),
        __VUE_OPTIONS_API__: true,
        __VUE_PROD_DEVTOOLS__: false,
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false,
      }),
      new HtmlWebpackPlugin({ template: './index.html', title: project.config.title }),
      new CopyWebpackPlugin({ patterns: [{ from: 'public', to: '.', noErrorOnMissing: true }] }),
      ...(production ? [new MiniCssExtractPlugin({ filename: 'assets/[name].[contenthash:8].css' })] : []),
    ],
    devtool: production ? false : 'eval-source-map',
    devServer: {
      host: '127.0.0.1',
      port: 5173,
      hot: true,
      static: false,
      historyApiFallback: true,
    },
    stats: 'minimal',
  }
}
