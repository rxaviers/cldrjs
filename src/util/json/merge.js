define(function() {

	// Returns merged JSON.
	//
	// Eg.
	// merge( { a: { b: 1, c: 2 } }, { a: { b: 3, d: 4 } } )
	// -> { a: { b: 3, d: 4 } }
	//
	// @arguments JSON's
	// 
	return function() {
		var i, json,
			jsons = [];
		for ( i = 0; i < arguments.length; i++ ) {
			json = JSON.stringify( arguments[ i ] ).replace( /^{/, "" ).replace( /}$/, "" );
			if ( json ) {
				jsons.push( json );
			}
		}
		return JSON.parse( "{" + jsons.join( "," ) + "}" );
	};

});
