/*
 * grunt-compare-size
 * https://github.com/rwldrn/grunt-compare-size
 *
 * Copyright (c) 2012 Rick Waldron <waldron.rick@gmail.com> &
 *                     Richard Gibson <richard.gibson@gmail.com> &
 *                      Corey Frang <gnarf@gnarf.net> &
 *                       Mike Sherov <mike.sherov@gmail.com>
 * Licensed under the MIT license.
 */

"use strict";

const _ = require("lodash");
const fs = require("fs");
const exec = require("child_process").exec;
const glob = require("glob");
const debug = require("debug")("compare-size");
const chalk = require("chalk");
const table = require("text-table");

const options = {
  files: ["dist/cldr.js", "dist/cldr/*.js"],
  options: {
    compress: {
      gz: function(fileContents) {
        return require("gzip-size").sync(fileContents);
      }
    }
  }
};

// Grunt utilities & task-wide assignments
const file = {
  read(filepath) {
    debug("Reading " + filepath + "...");
    try {
      return fs.readFileSync(String(filepath));
    } catch (e) {
      throw new Error(
        'Unable to read "' + filepath + '" file (Error code: ' + e.code + ").",
        e
      );
    }
  },
  readJSON(filepath) {
    var src = file.read(filepath);
    debug("Parsing " + filepath + "...");
    try {
      return JSON.parse(src);
    } catch (e) {
      throw new Error(
        'Unable to parse "' + filepath + '" file (' + e.message + ").",
        e
      );
    }
  },
  write(filepath, contents) {
    debug("Writing " + filepath + "...");

    try {
      fs.writeFileSync(filepath, contents);

      return true;
    } catch (e) {
      throw new Error(
        'Unable to write "' + filepath + '" file (Error code: ' + e.code + ").",
        e
      );
    }
  }
};

const defaultCache = ".sizecache.json";
const lastrun = " last run";

var processPatterns = function(patterns, fn) {
  // Filepaths to return.
  var result = [];
  // Iterate over flattened patterns array.
  _.flatten(patterns).forEach(function(pattern) {
    // If the first character is ! it should be omitted
    var exclusion = pattern.indexOf("!") === 0;
    // If the pattern is an exclusion, remove the !
    if (exclusion) {
      pattern = pattern.slice(1);
    }
    // Find all matching files for this pattern.
    var matches = fn(pattern);
    if (exclusion) {
      // If an exclusion, remove matching files.
      result = _.difference(result, matches);
    } else {
      // Otherwise add matching files.
      result = _.union(result, matches);
    }
  });
  return result;
};

const helpers = {
  // Label sequence helper
  sorted_labels: function(cache) {
    var tips = cache[""].tips;

    // Sort labels: metadata, then branch tips by first add,
    // then user entries by first add, then last run
    // Then return without metadata
    return Object.keys(cache)
      .sort(function(a, b) {
        var keys = Object.keys(cache);

        return (
          (a ? 1 : 0) - (b ? 1 : 0) ||
          (a in tips ? 0 : 1) - (b in tips ? 0 : 1) ||
          (a.charAt(0) === " " ? 1 : 0) - (b.charAt(0) === " " ? 1 : 0) ||
          keys.indexOf(a) - keys.indexOf(b)
        );
      })
      .slice(1);
  },

  // Label with optional commit
  label: function(label, commit) {
    return (
      label.replace(/^ /, "") + (commit ? " " + ("@ " + commit)["grey"] : "")
    );
  },

  // Color-coded size difference
  delta: function(delta) {
    var color = "green";

    if (delta > 0) {
      delta = "+" + delta;
      color = "red";
    } else if (!delta) {
      delta = delta === 0 ? "=" : "?";
      color = "grey";
    }

    return chalk[color](delta);
  },

  // Size cache helper
  get_cache: function(src) {
    var cache;

    try {
      cache = fs.existsSync(src) ? file.readJSON(src) : undefined;
    } catch (e) {
      debug(e);
    }

    // Progressively upgrade `cache`, which is one of:
    // empty
    // {}
    // { file: size [,...] }
    // { "": { tips: { label: SHA1, ... } }, label: { file: size, ... }, ... }
    // { "": { version: 0.4, tips: { label: SHA1, ... } },
    //   label: { file: { "": size, compressor: size, ... }, ... }, ... }
    if (typeof cache !== "object") {
      cache = undefined;
    }
    if (!cache || !cache[""]) {
      // If promoting cache to dictionary, assume that data are for last run
      cache = _.zipObject(["", lastrun], [{ version: 0, tips: {} }, cache]);
    }
    if (!cache[""].version) {
      cache[""].version = 0.4;
      _.forEach(cache, function(sizes, label) {
        if (!label || !sizes) {
          return;
        }

        // If promoting sizes to dictionary, assume that compressed size data are indicated by suffixes
        Object.keys(sizes)
          .sort()
          .forEach(function(file) {
            var parts = file.split("."),
              prefix = parts.shift();

            // Append compressed size data to a matching prefix
            while (parts.length) {
              if (typeof sizes[prefix] === "object") {
                sizes[prefix][parts.join(".")] = sizes[file];
                delete sizes[file];
                return;
              }
              prefix += "." + parts.shift();
            }

            // Store uncompressed size data
            sizes[file] = { "": sizes[file] };
          });
      });
    }

    return cache;
  },

  // Files helper.
  sizes: function(task, compressors) {
    var sizes = {},
      files = processPatterns(task.files, function(pattern) {
        // Find all matching files for this pattern.
        return glob.sync(pattern, { filter: "isFile" });
      });

    files.forEach(function(src) {
      var contents = file.read(src),
        fileSizes = (sizes[src] = { "": contents.length });
      if (compressors) {
        Object.keys(compressors).forEach(function(compressor) {
          fileSizes[compressor] = compressors[compressor](contents);
        });
      }
    });

    return sizes;
  },

  // git helper.
  git_status: function(done) {
    debug("Running `git branch` command...");
    exec(
      "git branch --no-color --verbose --no-abbrev --contains HEAD",
      function(err, stdout) {
        var status = {},
          matches = /^\* (.+?)\s+([0-9a-f]{8,})/im.exec(stdout);

        if (err || !matches) {
          done(err || "branch not found");
        } else if (matches[1].indexOf(" ") >= 0) {
          done("not a branch tip: " + matches[2]);
        } else {
          status.branch = matches[1];
          status.head = matches[2];
          exec("git diff --quiet HEAD", function(err) {
            status.changed = !!err;
            done(null, status);
          });
        }
      }
    );
  }
};

// Compare size to saved sizes
// Derived and adapted from Corey Frang's original `sizer`
function compareSizes(task) {
  var compressors = task.options.compress,
    newsizes = helpers.sizes(task, compressors),
    files = Object.keys(newsizes),
    sizecache = defaultCache,
    cache = helpers.get_cache(sizecache),
    tips = cache[""].tips,
    labels = helpers.sorted_labels(cache);

  // Obtain the current branch and continue...
  helpers.git_status(function(err, status) {
    var prefixes = compressors ? [""].concat(Object.keys(compressors)) : [""],
      commonHeader = prefixes.map((label, i) =>
        i === 0 && compressors ? "raw" : label
      );

    const tableOptions = {
      align: prefixes.map(() => "r").concat("l"),
      // eslint-disable-next-line no-control-regex
      stringLength: s => s.replace(/\x1B\[\d+m/g, "").length // Return a string, uncolored (suitable for testing .length, etc).
    };

    if (err) {
      console.warn(err);
      status = {};
    }

    let rows = [];
    rows.push(commonHeader.concat("Sizes"));

    // Raw sizes
    files.forEach(function(key) {
      rows.push(prefixes.map(prefix => newsizes[key][prefix]).concat(key + ""));
    });

    console.log(table(rows, tableOptions));

    // Comparisons
    labels.forEach(function(label) {
      var oldsizes = cache[label];

      // Skip metadata key and empty cache entries
      if (label === "" || !cache[label]) {
        return;
      }

      rows = [];

      // Header
      rows.push(
        commonHeader.concat("Compared to " + helpers.label(label, tips[label]))
      );

      // Data
      files.forEach(function(key) {
        var old = oldsizes && oldsizes[key];
        rows.push(
          prefixes
            .map(function(prefix) {
              return helpers.delta(old && newsizes[key][prefix] - old[prefix]);
            })
            .concat(key + "")
        );
      });

      console.log();
      console.log(table(rows, tableOptions));
    });

    // Update "last run" sizes
    cache[lastrun] = newsizes;

    // Remember if we're at a branch tip and the branch name is an available key
    if (
      status.branch &&
      !status.changed &&
      (status.branch in tips || !cache[status.branch])
    ) {
      tips[status.branch] = status.head;
      cache[status.branch] = newsizes;
      console.log("\nSaved as: " + status.branch);
    }

    // Write to file
    file.write(sizecache, JSON.stringify(cache));
  });
}

compareSizes(options);
