const path = require('path');
const miniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin")

module.exports = {
  entry: './src/index.js',
  // entry: {
  //   index: './src/index.js',
  //   login: './src/login.js'
  // },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name]-[chunkhash:6].js'
  },
  mode: 'development',
  module: {
    rules: [{
      test: /\.css$/,
      use: ["style-loader", "css-loader"],
    }, {
      test: /\.less$/,
      use: [
        miniCssExtractPlugin.loader,
        "css-loader",
        'postcss-loader',
        'less-loader'], // "style-loader", 
    }, {
      test: /\.js$/,
      // use: path.resolve(__dirname, './myLoaders/replace-loader.js')
      // use: { // 传参
      //   loader: path.resolve(__dirname, './myLoaders/replace-loader.js'),
      //   options: {
      //     name: 'huakang-nb'
      //   }
      // }
      // use: [ // 处理多个loader
      //   path.resolve(__dirname, './myLoaders/replace-loader.js'),
      //   {
      //     loader: path.resolve(__dirname, './myLoaders/replace-loader-async.js'),
      //     options: {
      //       name: 'kk-nb'
      //     }
      //   }
      // ]
      use: [ // resolveLoader
        'replace-loader',
        {
          loader: 'replace-loader-async',
          options: {
            name: 'kk'
          }
        }
      ]
    }]
  },
  resolveLoader: {
    modules: ['mode_modules', './myLoaders']
  },
  plugins: [
    new miniCssExtractPlugin({
      filename: 'css/index-[contenthash:6].css' //'css/index-[chunkhash:6].css'
    }),
    new CleanWebpackPlugin(),
    // 创建多个html 引用各自chunks
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "./src/index.html",
      // chunks: ['index']
    }),
    // new HtmlWebpackPlugin({ 
    //   filename: "login.html",
    //   template: "./src/index.html",
    //   chunks: ['login']
    // }),
  ]
}