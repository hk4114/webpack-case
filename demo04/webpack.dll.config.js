/**
 * @desc 静态公共资源打包配置
 */

const path = require("path");
const { DllPlugin } = require("webpack");

const NODE_ENV = process.env.NODE_ENV;

module.exports = {
  mode: NODE_ENV,
  entry: ["react", "react-dom"],
  output: {
    path: path.resolve(__dirname, '..', 'dll'),
    filename: 'react.dll.js',
    library: 'react',
  },
  plugins: [
    new DllPlugin({
      // manifest.json 文件的输出位置
      path: path.resolve(__dirname, 'dll/react-manifest.json'),
      // 定义打包的公共vendor文件对外暴露的函数名
      name: 'react'
    })
  ]
}