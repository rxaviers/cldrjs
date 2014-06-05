define(function() {

var allTypes = {
	array: [],
	date: new Date(),
	"function": function() {},
	"null": null,
	number: 7,
	object: new Foo(),
	plainObject: {},
	string: "foo"
};

function assertParameterType( expect, type, fn ) {
	Object.keys( allTypes ).filter( not( type ) ).forEach(function( type ) {
		expect( fn( allTypes[ type ] ) ).to.throw( Error, /E_INVALID_PAR_TYPE/ );
	});
}

function Foo() {}

/**
 * not() should be used with Array.prototype.filter().
 *
 * Return true only if b is different than any a.
 *
 * For example:
 * [ 1, 2, 3 ].filter( not( 2 ) ) => [ 1, 3 ]
 * [ 1, 2, 3 ].filter( not( [ 2, 3 ] ) ) => [ 1 ]
 */
function not( a ) {
	return function( b ) {
		if ( Array.isArray( a ) ) {
			return !a.some(function( a ) {
				return a === b;
			});
		}
		return a !== b;
	};
}

return {

	assertStringParameter: function( expect, fn ) {
		assertParameterType( expect, [ "string" ], fn );
	}

};

});
