const path = require('path');
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin")

module.exports = {
  // entry: './src/index.js', // 打包入口文件 简写 单入口 SPA
  entry: {  // 多入口 entry 就是个对象
    main: './src/index.js',
    login: './src/module_a.js'
  },

  output: { // 输出结构
    // filename: 'main.js', // 输出文件名 占位符写法 -> [name].js
    // path: path.resolve(__dirname, "dist"), // 输出文件到磁盘目录，必须是绝对路径

    // 多入口 
    filename: '[name][chunkhash:8].js',
    path: path.resolve(__dirname, "dist")
  },

  mode: 'development', // production development | none

  module: {
    // 模块 Webpack 会从配置的 Entry 开始递归找出所有依赖的模块。
    // 当webpack处理到不认识的模块时，需要在webpack中的module处进⾏配置，当检测到是什么格式的模块，使⽤什么loader来处理。

    rules: [ // loader 模块处理 ⽤于把模块原内容按照需求转换成新内容
      {
        test: /\.css$/,
        // use: ["style-loader", "css-loader"],
        use: [{
          loader: "style-loader",
          options: {
            injectType: "singletonStyleTag" // 将所有的style标签合并成⼀个
          }
        }, "css-loader"]
      },
      {
        test: /\.(png|jpe?g|gif)$/,
        use: { //use使⽤⼀个loader可以⽤对象，字符串，两个loader需要⽤数组
          loader: "file-loader", // 处理静态资源模块 原理是把打包⼊⼝中识别出的资源模块，移动到输出⽬录，并且返回⼀个地址名称
          // options额外的配置，⽐如资源名称
          options: {
            name: "[name]_[hash].[ext]",
            //打包后的存放位置
            outputPath: "images/"
          }
        }
      }
    ]
  },
  plugins: [ 
    // 插件配置
    // plugin 可以在webpack运⾏到某个阶段的时候，帮你做⼀些事情，类似于⽣命周期的概念扩展插件
    // 在 Webpack 构建流程中的特定时机注⼊扩展逻辑来改变构建结果或做你想要的事情。作⽤于整个构建过程

    new HtmlWebpackPlugin({ 
      title: "My App",
      filename: "app.html",
      template: "./src/index.html"
    }),
    new CleanWebpackPlugin()
  ]
}
