define([
	"src/util/json/merge"
], function( jsonMerge ) {

	var data1 = { a: { b: 1, c: 2 } },
		data2 = { a: { b: 3, d: 4 } },
		empty = {};

	describe( "Util Json Merge", function() {

		it( "should merge two JSONs deeply", function() {
			expect( jsonMerge( data1, data2 ) ).to.eql( { a: { b: 3, c: 2, d: 4 } } );
		});

		it( "should merge empty JSONs", function() {
			expect( jsonMerge( empty ) ).to.eql( empty );
			expect( jsonMerge( empty, data1 ) ).to.eql( data1 );
			expect( jsonMerge( data1, empty ) ).to.eql( data1 );
			expect( jsonMerge( empty, data1, empty ) ).to.eql( data1 );
		});

	});

});
