require.config({
	paths: {
		jquery: "../bower_components/jquery/jquery",
		cldr: "../src"
	}
});

require([

	"./spec/resource/get",
	"./spec/resource/set",
	"./spec/path/normalize",
	"./spec/bundle/parent-lookup",
	"./spec/item/lookup"

], function() {
	mocha.run();
});
