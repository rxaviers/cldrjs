/* global describe, it, expect */

import setAvailableBundles from "../../../src/core/set_available_bundles.js";

describe("Core setAvailableBundles", function() {
  var fakeCldr = {
    _availableBundleMap: {},
    _availableBundleMapQueue: []
  };

  it("should set availableBundleMapQueue", function() {
    setAvailableBundles(fakeCldr, {
      main: { "en-US": {} }
    });
    expect(fakeCldr._availableBundleMapQueue).to.eql(["en-US"]);
    setAvailableBundles(fakeCldr, {
      main: { "pt-BR": {} }
    });
    expect(fakeCldr._availableBundleMapQueue).to.eql(["en-US", "pt-BR"]);
  });
});
