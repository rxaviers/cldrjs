define([
	"../array/for-each",
	"../array/is-array"
], function( arrayForEach, arrayIsArray ) {

	// Returns new deeply merged JSON.
	//
	// Eg.
	// merge( { a: { b: 1, c: 2 } }, { a: { b: 3, d: 4 } } )
	// -> { a: { b: 3, c: 2, d: 4 } }
	//
	// @arguments JSON's
	// 
	var merge = function() {
		var destination = {},
			sources = [].slice.call( arguments, 0 );
		arrayForEach( sources, function( source ) {
			var prop;
			for ( prop in source ) {
				if ( prop in destination && arrayIsArray( destination[ prop ] ) ) {

					// Concat Arrays
					destination[ prop ] = destination[ prop ].concat( source[ prop ] );

				} else if ( prop in destination && typeof destination[ prop ] === "object" ) {

					// Merge Objects
					destination[ prop ] = merge( destination[ prop ], source[ prop ] );

				} else {

					// Set new values
					destination[ prop ] = source[ prop ];

				}
			}
		});
		return destination;
	};

	return merge;

});
