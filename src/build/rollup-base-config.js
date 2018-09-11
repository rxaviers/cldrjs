const babel = require("rollup-plugin-babel");
const replace = require("rollup-plugin-replace");
const stripIndent = require("common-tags").stripIndent;

const version = require("../../package").version;
const date = new Date().toISOString().replace(/:\d+\.\d+Z$/, "Z");

module.exports = {
  plugins: [
    replace({
      "process.env.ENV": JSON.stringify(process.env.ENV)
    }),
    babel({
      exclude: "node_modules/**"
    })
  ],
  external(id) {
    if (/^core-js/.test(id)) {
      return true;
    }
    if (/^@cldrjs/.test(id)) {
      return true;
    }
    return /^[\w-]+$/.test(id);
  },
  output: {
    intro: stripIndent`
      /*!
       * CLDR JavaScript Library v${version} ${date} MIT license © Rafael Xavier
       * http://git.io/h4lmVg
       */
      `
  }
};
