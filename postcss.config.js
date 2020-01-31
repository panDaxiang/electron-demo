module.exports = {
  ident: "postcss",
  plugins: [require("postcss-sprites")(), require("autoprefixer")()]
};
