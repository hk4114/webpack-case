const htmlWebpackPlugin = require("html-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const merge = require("webpack-merge");
const baseConig = require("./webpack.base.js");
// const path = require("path");

const proConfig = {
  mode: "production",
  
  plugins: [
    new OptimizeCSSAssetsPlugin({
      cssProcessor: require('cssnano'),
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
        removeComments: true,
        collapseWhitespace: true,
        minifyCSS: true
      }
    })
  ]
};

module.exports = merge(baseConig, proConfig);
