const path = require("path");
const htmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const miniCssExtractPlugin = require('mini-css-extract-plugin')

const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

const webpack = require("webpack");

const AddAssetHtmlWebpackPlugin = require("add-asset-html-webpack-plugin");

// Css tree shaking 
const PurifyCSS = require('purifycss-webpack')
const glob = require('glob-all')

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "[name].js"
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        include: path.resolve(__dirname, './src'),
        use: ["style-loader", "css-loader"],
        
      },
      {
        test: /\.less$/,
        include: path.resolve(__dirname, './src'),
        use: [
          miniCssExtractPlugin.loader, 
          "css-loader",
          'postcss-loader',
          'less-loader']
      },
      {
        test: /\.png$/,
        use: {
          loader: "file-loader",
          options: {
            name: "[name].[ext]"
          }
        }
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      }
    ]
  },
  devtool: "inline-source-map",// "cheap-module-eval-source-map"
  devServer: {
    contentBase: path.resolve(__dirname, "./dist"),
    open: true,
    hot: true,
    hotOnly: true,
    port: 8081
  },
  // optimization: {
  //   usedExports: true // 哪些导出的模块使用，再做打包
  // },
  plugins: [
    new CleanWebpackPlugin(),
    new miniCssExtractPlugin({
      filename: 'css/[name].css'
    }),
    // 清除无用css
    new PurifyCSS({
      paths: glob.sync([
        path.resolve(__dirname, './src/*.html'),
        path.resolve(__dirname, './src/*.js'),
      ])
    }),
    new OptimizeCSSAssetsPlugin({
      cssProcessor: require('cssnano'), // 引入cssnano配置压缩选项
      cssProcessorOptions: {
        discardComments: {
          removeAll: true
        }
      }
    }),
    new htmlWebpackPlugin({
      title: "demo",
      template: "./index.html",
      filename: "index.html",
      minify: {
        // 压缩html文件
        removeComments: true, // 移除注释
        collapseWhitespace: true, // 删除空白符和换行符
        minifyCSS: true // 压缩行内css
      }
    }),
    new AddAssetHtmlWebpackPlugin({
      filepath: path.resolve(__dirname, '../dll/react.dll.js')
    }),
    new webpack.DllReferencePlugin({
      manifest: path.resolve(__dirname, '.', 'dll/react-manifest.json')
    }),
    new webpack.HotModuleReplacementPlugin()
  ]
};