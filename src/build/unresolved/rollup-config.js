const baseConfig = require("../rollup-base-config");

module.exports = Object.assign({}, baseConfig, {
  input: "src/unresolved.js",
  output: {
    file: `packages/cldrjs-unresolved/${process.env.BABEL_ENV}.js`,
    format: "cjs",
    sourcemap: "inline",
    intro: baseConfig.output.intro
  }
});
