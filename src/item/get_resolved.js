define([
	"../resource/get",
	"../path/normalize"
], function( resourceGet, pathNormalize ) {

	return function( Cldr, path, attributes ) {
		// Resolve path
		var normalizedPath = pathNormalize( path, attributes );

		return resourceGet( Cldr._resolved, normalizedPath );
	};

});
