const packageJson = require("../package.json");
const dco = require("dco");

// Merge task-specific and/or target-specific options with these defaults.
var options = Object.assign(
  {},
  {
    committish: "HEAD",
    path: "."
  },
  packageJson.dco
);

dco.getCommitErrors(options, function(error, errors) {
  if (error) {
    throw error;
  }

  if (errors.length) {
    errors.forEach(function(error) {
      console.error(error);
    });

    console.error("Invalid commits.");
    process.exit(1);
  }

  console.log("All commits have appropriate licensing.");
});
