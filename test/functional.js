require.config({
	paths: {
		cldr: "../dist/cldr",
		"cldr-data": "../bower_components/cldr-data",
		json: "../bower_components/requirejs-plugins/src/json",
		text: "../bower_components/requirejs-text/text"
	}
});

require([

	"./functional/core",
	"./functional/event"

], function() {
	mocha.run();
});
