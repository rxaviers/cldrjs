define([
	"../util/array/is-array"
], function( arrayIsArray ) {

	return function( locale, path ) {
		if ( arrayIsArray( path ) ) {
			path = path.join( "/" );
		}
		if ( typeof path !== "string" ) {
			throw new Error( "invalid path \"" + path + "\"" );
		}
		// 1: Ignore leading slash `/`
		// 2: Ignore leading `cldr/`
		path = path
			.replace( /^\// , "" ) /* 1 */
			.replace( /^cldr\// , "" ) /* 2 */
			.split( "/" );

		// Supplemental
		if ( path[ 0 ] === "supplemental" ) {
			return path;
		}

		// Main, Casing, Collation, Rbnf: insert locale on path[ 1 ].
		path.splice( 1, 0, locale );

		return path;
	};

});
