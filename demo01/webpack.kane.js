const path = require('path')

module.exports = {
  entry: './src/index.js',

  output: {
    filename: 'kane.js',
    path: path.resolve(__dirname, "build"),
  },

  mode: 'development',

  module: {
    rules: [
      {
        test: /\.css$/,
        use: "css-loader" // ["style-loader", "css-loader"]
      },
      {
        test: /\.(png|jpe?g|gif)$/,
        use: {
          loader: "file-loader",
          options: {
            name: "[name]_[hash].[ext]",
            outputPath: "images/"
          }
        }
      }
    ]
  },
}
