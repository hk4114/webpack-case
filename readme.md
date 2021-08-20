# webpack 基础

> 起步 环境准备

```bash
# 局部安装 安装webpack V4+版本时，需要额外安装webpack-cli
npm i -D webpack webpack-cli
# npx帮助我们在项⽬中的node_modules⾥查找webpack
npx webpack -v
mkdir src
cd ./src
echo "" > index.js
# 执行
npx webpack
# .npmrc 设置国内源
# 指定使用国内淘宝源安装依赖
# registry=https://registry.npm.taobao.org
```

## webpack 配置 

> 默认配置

```js
// webpack.config.js
const path = require('path');
module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, "dist")
  }
}
```

webpack 的默认配置文件 `webpack.config.js`，通过修改该文件对打包进行个性化配置。

**自定义配置文件**：不使用默认配置文件，可以通过 `package.json` 增加脚本命令 `webpack --config ./webpack.xxxx.js`指定使用配置文件来进行构建

[demo](./demo01)

### entry 入口文件

```js
entry: './src/index.js', // 打包入口文件 简写 单入口 SPA

entry: {  // 多入口 entry 就是个对象
  main: './src/index.js',
  login: './src/module_a.js'
},
```

### output
Webpack 经过⼀系列处理并得出最终想要的代码后输出结果。

```js
filename: 'main.js', // 输出文件名
path: path.resolve(__dirname, "dist"), // 输出文件到磁盘目录，必须是绝对路径

// 存在多入口时，可以使用占位符的写法
filename: '[name][hash:8].js', // hash chunkhash contenthash 
path: path.resolve(__dirname, "dist")
```
#### hash 

代码改变 hash 改变 output [name]-[hash:6].js -> 即使是小改动也会造成整个项目里的文件名变化

每一次构建后生成的哈希值都不一样，即使文件内容压根没有改变。

#### chunkhash
影响范围只有 同一个chunk -> module 内有引用关系.

实现缓存效果，根据不同的入口文件(Entry)进行依赖文件解析、构建对应的 chunk 生成对应的哈希值。
把一些公共库和程序入口文件区分开，只要我们不改动公共库的代码，就可以保证其哈希值不会受影响。就可以利用缓存。

#### ontenthash 
自身内容变化才会更新 filename: [name]-[contenthash:6].css <- mini-css...

即使index.css被index.js引用了，只要css文件所处的模块里就算其他文件内容改变，只要css文件内容不变，那么不会重复构建。

> [demo2](./demo02)

```js
const miniCssExtractPlugin = require('mini-css-extract-plugin')
{
  test: /\.less$/,
  use: [
    miniCssExtractPlugin.loader,
    "css-loader",
    'postcss-loader',
    'less-loader'],
},
new miniCssExtractPlugin({ // 将css单独打包成一个文件的插件
  filename: 'css/index-[contenthash:6].css' //'css/index-[chunkhash:6].css'
}),
```

### mode
|    选项     | 描述                                                                                               |
| :---------: | :------------------------------------------------------------------------------------------------- |
|    none     | 退出任何默认优化选项                                                                               |
| development | 将definePlugin中process.env.NODE_ENV的值设置为development,启用NamedChunksPlugin和NamedModulePlugin |
| production  | 将definePlugin中process.env.NODE_ENV  设为    production                                           |
开发阶段的开启会有利于热更新的处理，识别哪个模块变化

⽣产阶段的开启会有帮助模块压缩，处理副作⽤等⼀些功能

### module
> [demo](./demo01)

Webpack 会从配置的 Entry 开始递归找出所有依赖的模块。
当webpack处理到不认识的模块时，需要在webpack中的module处进⾏配置，当检测到是什么格式的模块，使⽤什么loader来处理。

### loader
> [demo02](./demo02/webpack.config.js)
webpack 默认处理js和JSON模块，其他格式的模块处理，和处理⽅式则需要
loader。本质就是把模块原内容按照需求转换成新内容。

比如：`postcss   npm i postcss-loader postcss autoprefixer -D `
```js
// webpack.config.js
{
  test: /\.less$/,
  use: [
    "style-loader", 
    "css-loader",
    'postcss-loader',
    'less-loader']
}
// postcss.config.js
module.exports = {
  plugins: [
    require("autoprefixer")({
      // 覆盖package中的css兼容目标环境
      // 兼容浏览器最近的两个版本
      // 大于1%浏览器占有率
      overrideBrowserslist: ['last 2 versions', '>1%']
    })
  ]
}
```

#### 编写一个loader
> [官⽅⽂档](https://webpack.js.org/contribute/writing-a-loader/) [接⼝⽂档](https://webpack.js.org/api/loaders/)

> [myLoader](./demo02/myLoaders/replace-loader.js)

```js
// ./demo02/src/index.js
console.log('hello huakang')

//replaceLoader.js 
// 需要⽤声明式函数，因为要上到上下⽂的this,⽤到this的数据
module.exports = function(source) {
  console.log(source, this, this.query);
  return source.replace('hello','shit')；
  // 返回多值 this.callback
  const result = source.replace('hello', this.query.name);
  this.callback(null, result)
  // 处理异步
  const callback = this.async()
  setTimeout(() => {
    const result = source.replace('hello', this.query.name);
    callback(null, result)
  }, 2000)
};

// webpack.config.js
{
  test: /\.js$/,
  use: path.resolve(__dirname, './myLoaders/replace-loader.js'),
  use: { // 需要传参时，use是个对象
    loader: path.resolve(__dirname, './myLoaders/replace-loader.js'),
    options: {
      name: 'huakang-nb'
    }
  },
  use: [ // 用到多个loader时，use是数组
    path.resolve(__dirname, './myLoaders/replace-loader.js'),
    {
      loader: path.resolve(__dirname, './myLoaders/replace-loader-async.js'),
      options: {
        name: 'huakang-nb'
      }
    }
  ]
}
```
可以通过配置 resolveLoader 简化写法
```js
resolveLoader: {
  modules: ["node_modules", "./loader"]
},
use: [
  'replaceLoader', 'replaceLoaderAsync'
] 
```

### plugins
> [demo](./demo01/webpack.config.js)

plugin 可以在webpack运⾏到某个阶段的时候，帮你做⼀些事情，类似于⽣命周期的概念扩展插件，在 Webpack 构建流程中的特定时机注⼊扩展逻辑来改变构建结果或做你想要的事情。

比如 HtmlWebpackPlugin 会在打包结束后，⾃动⽣成⼀个html⽂件，并把打包⽣成的js模块引⼊到该html中。

### bundle chunk module 三者联系
- chunk  代码片段 模块文件被webpack处理之后 entry[key] -> chunk name
- module
- bundle 输出的资源文件

一个chunk可以对应一个或多个模块。
一个bundle对应一个chunks

coder -> module -> webpack deal -> chunks 代码片段 -> bundle 

### sourceMap

```json
devtool:"cheap-module-eval-source-map",// 开发环境配置
//线上不推荐开启
devtool:"cheap-module-source-map", // 线上⽣成配置
```

#### WebpackDevServer 提升开发体验
每次改完代码都需要重新打包⼀次，打开浏览器，刷新⼀次，很麻烦,我们可以安装使⽤webpackdevserver来改善这块的体验

```
npm install webpack-dev-server -D

"scripts": {
  "server": "webpack-dev-server"
},

// webpack.config.js
devServer: {
  contentBase: "./dist",
  open: true,
  port: 8080
},
```
