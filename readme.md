# webpack 基础

```bash
# 局部安装 安装webpack V4+版本时，需要额外安装webpack-cli
npm i -D webpack webpack-cli
# npx帮助我们在项⽬中的node_modules⾥查找webpack
npx webpack -v
```

## 启动 webpack
```bash
mkdir src
cd ./src
echo "" > index.js
# 执行
npx webpack
# 或者 package.json 加命令
# "dev": "webpack"
```

## 配置 webpack

### 自定义配置

> webpack.config.js

> webpack.dev.config.js webpack.base.config.js -> webpack --config ./webpack.kane.js 指定执行命令 
> 尝试执行 npm run mine

### 核心概念
- entry
- output
- mode
- loader 模块转换器 模块处理器
- plugin webpack 功能扩展
- chunk  代码片段 模块文件被webpack处理之后 entry[key] -> chunk name
- module
- bundle 输出的资源文件

bundle chunk module 三者联系
一个chunk可以对应一个或多个模块。
一个bundle对应一个chunks

coder -> module -> webpack deal -> chunks 代码片段 -> bundle 

### 项目
- 工具类
  + .npmrc 设置国内源
  + 安装依赖包 切换国内源 npm config 

[详细](./webpack.config.js)