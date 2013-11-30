define([
	"./util/always_array"
], function( alwaysArray ) {

	return function( Cldr ) {

		Cldr.prototype.main = function( path ) {
			path = alwaysArray( path );
			return this.get( [ "main/{languageId}" ].concat( path ) );
		};

	};

});
