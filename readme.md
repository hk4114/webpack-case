# webpack

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

## 1 webpack 配置 

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

### 1.1 entry 入口文件

```js
entry: './src/index.js', // 打包入口文件 简写 单入口 SPA

entry: {  // 多入口 entry 就是个对象
  main: './src/index.js',
  login: './src/module_a.js'
},
```

### 1.2 output
Webpack 经过⼀系列处理并得出最终想要的代码后输出结果。

```js
filename: 'main.js', // 输出文件名
path: path.resolve(__dirname, "dist"), // 输出文件到磁盘目录，必须是绝对路径

// 存在多入口时，可以使用占位符的写法
filename: '[name][hash:8].js', // hash chunkhash contenthash 
path: path.resolve(__dirname, "dist")
```
#### 1.2.1 hash 

代码改变 hash 改变 output [name]-[hash:6].js -> 即使是小改动也会造成整个项目里的文件名变化

每一次构建后生成的哈希值都不一样，即使文件内容压根没有改变。

#### 1.2.2 chunkhash
影响范围只有 同一个chunk -> module 内有引用关系.

实现缓存效果，根据不同的入口文件(Entry)进行依赖文件解析、构建对应的 chunk 生成对应的哈希值。
把一些公共库和程序入口文件区分开，只要我们不改动公共库的代码，就可以保证其哈希值不会受影响。就可以利用缓存。

#### 1.2.3 ontenthash 
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

### 1.3 mode
|    选项     | 描述                                                                                               |
| :---------: | :------------------------------------------------------------------------------------------------- |
|    none     | 退出任何默认优化选项                                                                               |
| development | 将definePlugin中process.env.NODE_ENV的值设置为development,启用NamedChunksPlugin和NamedModulePlugin |
| production  | 将definePlugin中process.env.NODE_ENV  设为    production                                           |
开发阶段的开启会有利于热更新的处理，识别哪个模块变化

⽣产阶段的开启会有帮助模块压缩，处理副作⽤等⼀些功能

### 1.4 module
> [demo](./demo01)

Webpack 会从配置的 Entry 开始递归找出所有依赖的模块。
当webpack处理到不认识的模块时，需要在webpack中的module处进⾏配置，当检测到是什么格式的模块，使⽤什么loader来处理。

### 1.5 loader
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

#### 1.5.1 编写一个loader
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

### 1.6 plugins
> [demo](./demo01/webpack.config.js)

plugin 可以在webpack运⾏到某个阶段的时候，帮你做⼀些事情，类似于⽣命周期的概念扩展插件，在 Webpack 构建流程中的特定时机注⼊扩展逻辑来改变构建结果或做你想要的事情。

比如 HtmlWebpackPlugin 会在打包结束后，⾃动⽣成⼀个html⽂件，并把打包⽣成的js模块引⼊到该html中。

### 1.7 bundle chunk module 三者联系
- chunk  代码片段 模块文件被webpack处理之后 entry[key] -> chunk name
- module
- bundle 输出的资源文件

一个chunk可以对应一个或多个模块。
一个bundle对应一个chunks

coder -> module -> webpack deal -> chunks 代码片段 -> bundle 

### 1.8 sourceMap

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

## 2 webpack 项目
> [demo03](./demo03)
### 2.1 webpack-dev-server 自动更新 
webpack-dev-server 实现自动更新

> `npm install webpack-dev-server -D`

```json
"scripts": {
  "serve": "webpack-dev-server"
},
```

```js
// webpack.config.js
devServer: {
  contentBase: "./dist",
  open: true,
  port: 8081
},
```

### mock 数据
#### 安装 
`npm i express -D`

#### 配置
```js
// 新建 server.js
const express = require('express');

const app = express();

app.get('/api/info.json', (req, res)=> {
  res.json({
    name: 'kane',
    age: 5,
    msg: 'success'
  })
})

app.listen('9092')

// package.json
"scripts": {
  "server": "node server.js"
}

// src/index.js
import axios from 'axios';

axios.get('http://localhost:9092/api/info.json').then(res => {
  console.log(res, 'sign')
})
```
启动后端服务 以及 前端项目。
```sh
node server.js
webpack-dev-server
```

url 输入 `http://localhost:9092/api/info.json` 可以看到服务结果，但是前端里面提示`CORS` 跨域。

#### 本地 mock, 解决跨域
```js
// webpack.config.js
{
  'devServer.proxy': {
    '/api': {
      target: 'http://localhost:9092'
    }
  }
}
// index.js 删除 http://localhost:9092
```

### HMR 热模块替换
> [hotCss](./demo03/src/hotCss.js)

css 抽离不会生效，不支持 contenthash，chunkhash

```js
// webpack.config.js
const webpack = require("webpack");

plugins: [
  new webpack.HotModuleReplacementPlugin()
]

devServer: {
  hot: true,
  hotOnly: true,
}
```

处理 JS 模块 HMR 则需要使用 module.hot.accept 监听模块更新


### babel
js 编译器。babel 在执行编译过程中，首先读取 `.babelrc` JSON 文件中的配置，如果没有则会从 `loader.options` 中读取配置。

#### 基础使用
- 安装 `npm i babel-loader @babel/core @babel/preset-env -D`
- 配置 
```js
// webpack.config.js module.rules
{
  test: /\.js$/,
  exclude: /node_modules/,
  use: {
    loader: "babel-loader",
    options: {
      presets: ["@babel/preset-env"]
    }
  }
}
```
默认 babel 只支持 let 等一些基础的特性转换，Promise 等新特性的转换需要其他插件的支持，例如 @babel/polyfill @babel/plugin-transform-runtime。


#### @babel/polyfill
> 不适合开发组件库或者工具库，挂载在全局 window 下，污染全局环境。

`npm i @babel/polyfill -S`

在入口顶部引入包 `import "@babel/polyfill";`

由于polyfill默认把所有特性注入，为了减少体积，我们需要通过配置 `useBuiltIns` 实现按需加载。

```json
// create new file .babelrc
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "targets": {
          "edge": "17",
          "firefox": "60",
          "chrome": "67",
          "safari": "11.1"
        },
        "corejs": 2, // 新版本需要指定核心库版本
        "useBuiltIns": "usage" 
        // entry 入口文件中引入 import "@babel/polyfill" 根据使用情况倒入垫片
        // usage 不需要import,全自动检测，需要安装 @babel/polyfill
        // false 全量加载
      }
    ]
  ]
}
```
但是在开发组件库或者工具库的时候，由于polyfill挂载在window下，污染了全局环境。

#### @babel/plugin-transform-runtime
> 通过闭包方式，不会造成全局污染

```sh
npm i @babel/plugin-transform-runtime -D
npm i @babel/runtime -S
```

```json
// .babelrc 不需要设置 presets
{
  "plugins": [
    [
    "@babel/plugin-transform-runtime",
    {
      "absoluteRuntime": false,
      "corejs": false,
      "helpers": true,
      "regenerator": true,
      "useESModules": false
    }]
  ]
}
```

> externals 通过配置该项，可以在打包时不把项目的共同依赖给打进来。

#### react
`npm install react react-dom --S`

babel JSX 编译需要新包支持

`npm install --save-dev @babel/preset-react`

```json
// .babelrc
"presets": [
  // ...
  "@babel/preset-react"
]
```

## webpack 构建优化
> 优化开发体验 优化输出质量

[demo04](./demo04)


### 缩小文件范围
优化loader配置
- test include exclude三个配置项来缩⼩小loader的处理理范围
- 推荐include

`include: path.resolve(__dirname, './src'),`

通过这种方式缩小文件loader数量。

### 优化resolve.alias配置
resolve.alias配置通过别名来将原导⼊入路路径映射成⼀一个新的导⼊入路路径

```js
alias: {
  "@": path.join(__dirname, "./pages")
}
```

### 优化resolve.extensions配置
extensions在导⼊入语句句没带⽂文件后缀时，webpack会⾃自动带上后缀后，去尝试查找⽂文件是否存在。

`extensions:['js','json','jsx','ts']`

后缀尝试列列表尽量量的小，导入语句尽量的带上后缀

### 优化resolve.modules配置
寻找第三⽅方模块，默认是在当前项⽬目⽬目录下的node_modules⾥里里⾯面去找，如果没有找到，就会去上⼀一级⽬目录../node_modules找，再没有会去../../node_modules中找，以此类推，和Node.js的模块寻找机制很类似。
如果我们的第三⽅方模块都安装在了了项⽬目根⽬目录下，就可以直接指明这个路路径。

```js
module.exports = {
  resolve: {
    modules: [path.resolve(__dirname, './node_modules')],
    alias: {
      "@": path.join(__dirname, "./pages")
    },
    extensions: ['js','json','jsx','ts']
  }
}
```

### 使⽤用静态资源路路径publicPath(CDN)
接入CDN，需要把网页的静态资源上传到CDN服务上，在访问这些资源时，使⽤用CDN服务提供的URL。

```js
// ##webpack.config.js
output:{
  publicPath: '//cdnURL.com', //指定存放JS文件的CDN地址
}
```


### css文件的处理(分离)
- 1.2.3 ontenthash 
- 1.5 loader

### 压缩css
`npm i cssnano optimize-css-assets-webpack-plugin -D`

```js
// webpack.config.js
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

plugins: [
  // code
  new OptimizeCSSAssetsPlugin({
    cssProcessor: require('cssnano'), // 引入cssnano配置压缩选项
    cssProcessorOptions: {
      discardComments: {
        removeAll: true
      }
    }
  }),
  // code
]
```

### 压缩 html
``
```js
// webpack.config.js
new htmlWebpackPlugin({
  title: "demo",
  template: "./index.html",
  filename: "index.html",
  minify: {
    // 压缩html文件
    removeComments: true, // 移除注释
    collapseWhitespace: true, // 删除空白符和换行符
    minifyCSS: true // 压缩行内css
  }
})
```