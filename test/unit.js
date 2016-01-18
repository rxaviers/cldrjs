require.config({
	paths: {
		"cldr-data": "../bower_components/cldr-data",
		json: "../bower_components/requirejs-plugins/src/json",
		src: "../src",
		text: "../bower_components/requirejs-text/text"
	}
});

require([

	// 1st unit tests group.
	"./unit/core/subtags",
	"./unit/path/normalize",
	"./unit/resource/get",
	"./unit/resource/set",
	"./unit/util/json/merge",

	// 2nd unit tests group.
	"./unit/core/load",
	"./unit/core/set_available_bundles",

	// 3rd unit tests group.
	"./unit/core",
	"./unit/core/likely_subtags",
	"./unit/core/remove_likely_subtags",
	"./unit/supplemental",

	// 4th unit tests group.
	"./unit/bundle/lookup"

], function() {
	mocha.run();
});
