const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const miniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "js/[name]_[hash:6].js"
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        include: path.resolve(__dirname, "./src"),
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.png$/,
        include: path.resolve(__dirname, "./src"),
        use: {
          loader: "file-loader",
          options: {
            name: "images/[name].[ext]"
          }
        }
      },
      {
        test: /\.less$/,
        include: path.resolve(__dirname, "./src"),
        use: [
          miniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
          "less-loader"
        ]
      },
      {
        test: /\.js$/,
        include: path.resolve(__dirname, "./src"),
        loader: "babel-loader"
      }
    ]
  },
  resolve: {
    modules: [path.resolve(__dirname, "./node_modules")],
    alias: {
      react: path.resolve(
        __dirname,
        "./node_modules/react/umd/react.production.min.js"
      ),
      "react-dom": path.resolve(
        __dirname,
        "./node_modules/react-dom/umd/react-dom.production.min.js"
      )
    },
    extensions: ["js"]
  },

  plugins: [
    new CleanWebpackPlugin(),
    new miniCssExtractPlugin({
      filename: "css/[name]_[contenthash:6].css"
    })
  ]
};
