const fs = require('fs')
const path = require('path')
const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default;
const { transformFromAst } = require('@babel/core')

module.exports = class webpack {
  constructor(options) {
    const { entry, output } = options;
    this.entry = entry;
    this.output = output;
  }
  parse(entryFile) {
    // 分析入口模块的依赖和内容
    const content = fs.readFileSync(entryFile, 'utf-8');

    const ast = parser.parse(content, {
      sourceType: 'module'
    })

    // 保存依赖的路径信息
    const dependencies = {};

    traverse(ast, {
      // 需要提炼的名称作为关键字
      ImportDeclaration({ node }) { // 引入
        const newPath = './' + path.join(path.dirname(entryFile), node.source.value)
        dependencies[node.source.value] = newPath;
      }
    })
    const code = transformFromAst(ast, null, {
      presets: ['@babel/preset-env']
    })
    
    return {
      entryFile, // 文件名
      dependencies, // 依赖
      code // 内容
    }
  }
  run() {
    const info = this.parse(this.entry)
    console.log(info)
  }
}