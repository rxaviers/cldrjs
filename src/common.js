define(function() {

	return function( Cldr ) {

		Cldr.prototype.main = function( path ) {
			if ( typeof path === "string" ) {
				path = [ path ];
			}
			return this.get( [ "main/{languageId}" ].concat( path ) );
		};

	};

});
