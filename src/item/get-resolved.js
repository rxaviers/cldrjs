define([
	"../resource/get",
	"../path/normalize"
], function( resourceGet, pathNormalize ) {

	return function( Cldr, locale, path ) {
		// Resolve path
		path = pathNormalize( locale, path );

		return resourceGet( Cldr._resolved, path );
	};

});
