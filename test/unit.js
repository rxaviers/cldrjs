require.config({
	paths: {
		fixtures: "./fixtures",
		json: "../bower_components/requirejs-plugins/src/json",
		src: "../src",
		text: "../bower_components/requirejs-text/text"
	}
});

require([

	// 1st unit tests group.
	"./unit/util/json/merge",
	"./unit/resource/get",
	"./unit/resource/set",
	"./unit/path/normalize",

	// 2nd unit tests group.
	"./unit/core",
	"./unit/core/likely_subtags",
	"./unit/core/remove_likely_subtags",
	"./unit/supplemental"

], function() {
	mocha.run();
});
