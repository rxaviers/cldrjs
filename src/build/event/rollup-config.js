const baseConfig = require("../rollup-base-config");

module.exports = Object.assign({}, baseConfig, {
  input: "src/event.js",
  output: {
    file: `packages/cldrjs-event/${process.env.BABEL_ENV}.js`,
    format: "cjs",
    sourcemap: "inline",
    intro: baseConfig.output.intro
  }
});
