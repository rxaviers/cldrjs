const baseConfig = require("../rollup-base-config");

module.exports = Object.assign({}, baseConfig, {
  input: "src/core.js",
  output: {
    file: `packages/cldrjs-core/${process.env.BABEL_ENV}.js`,
    format: "cjs",
    sourcemap: "inline",
    intro: baseConfig.output.intro
  }
});
