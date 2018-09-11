const baseConfig = require("../rollup-base-config");

module.exports = Object.assign({}, baseConfig, {
  input: "src/supplemental.js",
  output: {
    file: `packages/cldrjs-supplemental/${process.env.BABEL_ENV}.js`,
    format: "cjs",
    sourcemap: "inline",
    intro: baseConfig.output.intro
  }
});
