const fs = require('fs')
const path = require('path')
const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default;

module.exports = class webpack {
  constructor(options) {
    const { entry, output } = options;
    this.entry = entry;
    this.output = output;
  }
  run() {
    // 分析入口模块的依赖和内容
    const content = fs.readFileSync(this.entry, 'utf-8');

    const ast = parser.parse(content, {
      sourceType: 'module'
    })

    traverse(ast, {
      // 需要提炼的名称作为关键字
      ImportDeclaration({ node }) { // 引入
        console.log(node.source.value)
      }
    })
    // console.log(ast.program.body, 'sign')
  }
}