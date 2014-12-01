require.config({
	paths: {
		"cldr-data": "../bower_components/cldr-data",
		json: "../bower_components/requirejs-plugins/src/json",
		src: "../src",
		text: "../bower_components/requirejs-text/text"
	}
});

require( [ "src/unresolved" ], function() {

	require([
		"./unit/item/lookup",
		"./unit/bundle/parent_lookup"
	], function() {
		mocha.run();
	});

});
