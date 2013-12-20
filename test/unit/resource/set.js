define([
	"src/resource/set",
], function( resourceSet ) {

	var data = {};

	describe("Resource Set", function() {

		it( "should set value into new JSON data structure", function() {
			resourceSet( data, [ "i" ], 1 );
			expect( data.i ).to.equal( 1 );

			resourceSet( data, [ "a", "b", "c" ], 5 );
			expect( data.a.b.c ).to.equal( 5 );
		});

		it( "should set value into existing JSON data structure", function() {
			resourceSet( data, [ "a", "b", "e" ], 7 );
			expect( data.a.b.e ).to.equal( 7 );
		});

	});

});
