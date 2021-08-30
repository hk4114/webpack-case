const htmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const path = require("path");
const baseConig = require("./webpack.base.js");
const merge = require("webpack-merge");

const devConfig = {
  mode: "development",
  
  devtool: "cheap-module-eval-source-map",

  devServer: {
    contentBase: path.resolve(__dirname, "./dist"),
    open: true,
    port: 8081,
    hot: true,
    hotOnly: true
  },

  plugins: [
    new htmlWebpackPlugin({
      title: "demo",
      template: "./index.html",
      filename: "index.html"
    }),

    new webpack.HotModuleReplacementPlugin()
  ]
};

module.exports = merge(baseConig, devConfig);