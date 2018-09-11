/* global describe, it, expect, before */

import Cldr from "../../../src/core.js";
import parentLookup from "../../../src/bundle/parent_lookup.js";
import parentLocalesJson from "cldr-data/supplemental/parentLocales.json";

import "../../../src/unresolved.js";

describe("Bundle Parent Lookup", function() {
  before(function() {
    Cldr.load(parentLocalesJson);
  });

  it("should truncate locale", function() {
    expect(parentLookup(Cldr, ["pt", "BR"].join(Cldr.localeSep))).to.equal(
      "pt"
    );
  });

  it("should end with root", function() {
    expect(parentLookup(Cldr, "en")).to.equal("root");
  });

  it("should use supplemental resource", function() {
    expect(parentLookup(Cldr, ["en", "IN"].join(Cldr.localeSep))).to.equal(
      ["en", "001"].join(Cldr.localeSep)
    );
  });
});
