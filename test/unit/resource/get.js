define([
	"src/resource/get",
], function( resourceGet ) {

	var data = { a: { b: { c: 5 } } };

	describe("Data Get", function() {

		it( "should return existing data value", function() {
			expect( resourceGet( data, [ "a", "b", "c" ] ) ).to.equal( 5 );
		});

		it( "should return undefined for non-existing data", function() {
			expect( resourceGet( data, [ "a", "b", "x" ] ) ).to.be.undefined;
		});

		it( "should return undefined for non-existing tree", function() {
			expect( resourceGet( data, [ "x", "y", "z" ] ) ).to.be.undefined;
		});

	});

});
