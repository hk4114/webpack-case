class CopyRightWebpackPlugin {
  constructor(options) {
    console.log(options);
  }

  // compiler webpack实例 包含整个构建周期
  apply(compiler) { 
    // hooks.emit 定义在某个钩子(时刻)
    compiler.hooks.emit.tapAsync(
      "CopyRightWebpackPlugin",
      (compilation, cb) => {
        // 创建一个text文件
        compilation.assets["test.txt"] = {
          source: function() {
            return "hello txt";
          },
          size: function() {
            return 20;
          }
        };
        cb();
      }
    );
    // 同步的写法
    compiler.hooks.compile.tap("CopyRightWebpackPlugin", compilation => {
      console.log("whats up");
    });
  }
}

module.exports = CopyRightWebpackPlugin;
