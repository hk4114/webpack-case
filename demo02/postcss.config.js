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