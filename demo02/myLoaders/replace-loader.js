// const loaderUtils = require("loader-utils");//官⽅推荐处理loader,query的⼯具

// 必须是声明函数 不能是箭头函数
// 必须有返回值
// 返回多值 this.callback
// 处理异步
// 如何处理多个自由loader
module.exports = function (source) {
  // const options = loaderUtils.getOptions(this);
  // console.log( source, 'sign')
  // console.log(this.query, 'webpack loader options sign')
  return source.replace('hello', this.query.name || 'wawa')

  // const result = source.replace('hello', this.query.name);
  // this.callback(null, result)

  // const callback = this.async()
  // setTimeout(() => {
  //   const result = source.replace('hello', this.query.name);
  //   callback(null, result)
  // }, 2000)
}