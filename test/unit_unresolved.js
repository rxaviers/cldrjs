require.config({
	paths: {
		fixtures: "./fixtures",
		json: "../bower_components/requirejs-plugins/src/json",
		src: "../src",
		text: "../bower_components/requirejs-text/text"
	}
});

require( [ "src/main_unresolved" ], function() {

	require([
		"./unit/item/lookup",
		"./unit/bundle/parent_lookup"
	], function() {
		mocha.run();
	});

});
