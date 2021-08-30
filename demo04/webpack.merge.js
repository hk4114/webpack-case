const devConig = require("./webpack.dev.js");
const proConig = require("./webpack.pro.js");

module.exports = process.env.NODE_ENV === 'production'? proConig : devConig