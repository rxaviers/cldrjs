require.config({
	paths: {
		src: "../src"
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
