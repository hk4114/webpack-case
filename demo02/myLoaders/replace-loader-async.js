module.exports = function (source) {
  const callback = this.async()
  setTimeout(() => {
    const result = source.replace('huakang', this.query.name);
    callback(null, result)
  }, 2000)
}