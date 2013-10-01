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

	"./spec/likely-subtags",
	"./spec/remove-likely-subtags",
	"./spec/init",

	"./spec/bundle/parent-lookup",
	"./spec/item/lookup"

], function() {
	mocha.run();
});
