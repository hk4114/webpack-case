const path = require("path");
const htmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const webpack = require("webpack");

module.exports = {
  mode: "development",
  // entry: "./src/index.js",
  // entry: './src/hotCss.js',
  entry: './src/babel-test.js',
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "[name].js"
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
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
  devtool: "inline-source-map",
  devServer: {
    contentBase: path.resolve(__dirname, "./dist"),
    open: true,
    hot: true,
    hotOnly: true,
    port: 8081,
    proxy: {
      "/api": {
        target: "http://localhost:9092"
      }
    }
  },
  plugins: [
    new CleanWebpackPlugin(),
    new htmlWebpackPlugin({
      title: "demo",
      template: "./index.html",
      filename: "index.html"
    }),
    new webpack.HotModuleReplacementPlugin()
  ]
};