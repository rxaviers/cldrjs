require.config({
	paths: {
		src: "../src"
	}
});

require([

	// 1st unit tests group.
	"./unit/util/json/merge",
	"./unit/resource/get",
	"./unit/resource/set",
	"./unit/path/normalize",

	// 2nd unit tests group.
	"./unit/main",
	"./unit/likely_subtags",
	"./unit/remove_likely_subtags",
	"./unit/supplemental"

], function() {
	mocha.run();
});
