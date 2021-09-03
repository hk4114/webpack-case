const path = require('path');

module.exports = {
  mode: 'development',

  entry: './src/index.js',

  output: { 
    filename: '[name][chunkhash:8].js',
    path: path.resolve(__dirname, "dist")
  },

  plugins: []
}
