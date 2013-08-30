define([
	"../util/array/is-array"
], function( arrayIsArray ) {

	return function( locale, path ) {
		if ( typeof path === "string" ) {
			path = path.split( "/" );
		}
		if ( !arrayIsArray( path ) ) {
			throw new Error( "invalid path \"" + path + "\"" );
		}

		// Supplemental
		if ( path[ 0 ] === "supplemental" ) {
			return path;
		}

		// Main, Casing, Collation, Rbnf: insert locale on path[ 1 ].
		path.splice( 1, 0, locale );

		return path;
	};

});
