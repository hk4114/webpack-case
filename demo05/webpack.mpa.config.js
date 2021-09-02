const path = require("path");
const htmlwebpackplugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const glob = require("glob");

const setMpa = () => {
  const entry = {};
  const htmlwebpackplugins = [];

  const entryFiles = glob.sync(path.join(__dirname, "./src/pages/*/index.js"));

  entryFiles.map((item, index) => {
    const entryFile = entryFiles[index];
    const match = entryFile.match(/src\/pages\/(.*)\/index\.js$/);
    console.log(match, 'sign');
    const pageName = match && match[1];
    entry[pageName] = entryFile;

    htmlwebpackplugins.push(
      new htmlwebpackplugin({
        template: path.join(__dirname, `src/pages/${pageName}/index.html`),
        filename: `${pageName}.html`,
        chunks: [pageName]
      })
    );
  });

  return {
    entry,
    htmlwebpackplugins
  };
};

const { entry, htmlwebpackplugins } = setMpa();

module.exports = {
  entry: entry,
  mode: "development",
  output: {
    path: path.resolve(__dirname, "./Mpa"),
    filename: "[name].js"
  },
  plugins: [...htmlwebpackplugins, new CleanWebpackPlugin()]
};

// module.exports = {
//   mode: "development",
//   entry: {
//     index: './src/pages/index/index.js',
//     list: './src/pages/list/index.js',
//     detail: './src/pages/detail/index.js'
//   },
//   output: {
//     path: path.resolve(__dirname, "./Mpa"),
//     filename: "[name].js"
//   },
//   plugins: []
// }
