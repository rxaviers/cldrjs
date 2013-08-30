require.config({
	paths: {
		cldr: "./src"
	}
});

require([

	"./spec/resource/get",
	"./spec/resource/set",
	"./spec/path/normalize"

], function() {
	mocha.run();
});
