const path = require('path');
const copyrightwebpackplugin = require("./myPlugin/copyright-webpack-plugin");

module.exports = {
  mode: 'development',

  entry: './src/index.js',

  output: { 
    filename: '[name].js',
    path: path.resolve(__dirname, "dist")
  },

  plugins: [
    new copyrightwebpackplugin({ name: "huakang" })
  ]
}
