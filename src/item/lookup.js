import bundleParentLookup from "../bundle/parent_lookup";
import pathNormalize from "../path/normalize";
import resourceGet from "../resource/get";
import resourceSet from "../resource/set";
import jsonMerge from "../util/json/merge";

var lookup;

export default (lookup = function(Cldr, locale, path, attributes, childLocale) {
  var normalizedPath, parent, value;

  // 1: Finish recursion
  // 2: Avoid infinite loop
  if (typeof locale === "undefined" /* 1 */ || locale === childLocale /* 2 */) {
    return;
  }

  // Resolve path
  normalizedPath = pathNormalize(path, attributes);

  // Check resolved (cached) data first
  // 1: Due to #16, never use the cached resolved non-leaf nodes. It may not
  //    represent its leafs in its entirety.
  value = resourceGet(Cldr._resolved, normalizedPath);
  if (value !== undefined && typeof value !== "object" /* 1 */) {
    return value;
  }

  // Check raw data
  value = resourceGet(Cldr._raw, normalizedPath);

  if (value === undefined) {
    // Or, lookup at parent locale
    parent = bundleParentLookup(Cldr, locale);
    value = lookup(
      Cldr,
      parent,
      path,
      jsonMerge(attributes, { bundle: parent }),
      locale
    );
  }

  if (value !== undefined) {
    // Set resolved (cached)
    resourceSet(Cldr._resolved, normalizedPath, value);
  }

  return value;
});
