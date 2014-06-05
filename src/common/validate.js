define([
	"./create_error"
], function( createError ) {

	return function( code, check, attributes ) {
		if ( !check ) {
			throw createError( code, attributes );
		}
	};

});
