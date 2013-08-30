require.config({
	paths: {
		cldr: "./src"
	}
});

require([

	"./spec/data/get"

], function() {
	mocha.run();
});
