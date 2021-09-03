const fs = require('fs')

module.exports = class webpack {
  constructor(options) {
    const { entry, output } = options;
    this.entry = entry;
    this.output = output;
  }
  run() {
    // 分析入口模块的依赖和内容
    const content = fs.readFileSync(this.entry, 'utf-8');
    console.log(content, 'sign')
  }
}