define([
	"cldr/resource/set",
], function( resourceSet ) {

	var data = {};

	describe("Resource Set", function() {

		it( "should set value into JSON data structure", function() {
			resourceSet( data, [ "i" ], 1 );
			expect( data.i ).to.equal( 1 );

			resourceSet( data, [ "a", "b", "c" ], 5 );
			expect( data.a.b.c ).to.equal( 5 );
		});

	});

});
