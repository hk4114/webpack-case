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

    this.modules = []
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
    
    const { code } = transformFromAst(ast, null, {
      presets: ["@babel/preset-env"]
    });

    return {
      entryFile, // 文件名
      dependencies, // 依赖
      code // 内容
    }
  }
  run() {
    // 分析入口模块 依赖和内容
    const info = this.parse(this.entry);
    this.modules.push(info)

    // 分析所有依赖模块
    for (let i = 0; i < this.modules.length; i++) {
      const item = this.modules[i];
      const { dependencies } = item;
      if (dependencies) {
        for (let k in dependencies) {
          this.modules.push(this.parse(dependencies[k]))
        }
      }
    }

    // 数据转换 数组变成对象
    const obj = {};
    this.modules.forEach(item => {
      obj[item.entryFile] = {
        dependencies: item.dependencies,
        code: item.code
      }
    })
    this.file(obj)
  }
  file(code) {
    // 通过生成文件目录地址, 文件内容生成文件
    const filePath = path.join(this.output.path, this.output.filename);
    const newCode = JSON.stringify(code);

    const bundle = `(function(graph){
      function require(module) {
        function reRequire(relativePath) {
          return require(graph[module].dependencies[relativePath])
        }
        var exports = {};
        (function(require, exports, code) {
          eval(code)
        })(reRequire, exports, graph[module].code)
        return exports;
      }
      require('${this.entry}')
    })(${newCode})`

    // 手动创建一个dist空目录
    fs.writeFileSync(filePath, bundle, 'utf-8')
  }
}