require.config({
	paths: {
		cldr: "../src"
	}
});

require([

	"./spec/util/json/merge",
	"./spec/resource/get",
	"./spec/resource/set",
	"./spec/path/normalize",

	"./spec/likely_subtags",
	"./spec/remove_likely_subtags",
	"./spec/init",
	"./spec/common",
	"./spec/supplemental",

	"./spec/bundle/parent_lookup",
	"./spec/item/lookup"

], function() {
	mocha.run();
});
