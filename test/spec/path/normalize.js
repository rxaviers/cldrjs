define([
	"cldr/path/normalize",
], function( pathNormalize ) {

	var locale = "root";

	describe("Path Normalize", function() {

		it( "should throw Error on invalid path", function() {
			var invalidPath = 5;
			expect(function() {
				pathNormalize( locale, invalidPath );
			}).to.throw( Error );
		});

		it( "should split a String into an Array", function() {
			var value = pathNormalize( locale, "supplemental/likelySubtags" );
			expect( value ).to.be.instanceof( Array );
			expect( value ).to.eql( [ "supplemental", "likelySubtags" ] );
		});

		it( "should ignore a leading slash / on path", function() {
			var value = pathNormalize( locale, "/supplemental/likelySubtags" );
			expect( value ).to.be.instanceof( Array );
			expect( value ).to.eql( [ "supplemental", "likelySubtags" ] );
		});

		it( "should insert locale after main", function() {
			expect( pathNormalize( locale, "main/numbers/decimalFormats-numberSystem-latn" ) ).to.eql( [ "main", "root", "numbers", "decimalFormats-numberSystem-latn" ] );
		});

		it( "should not insert locale on supplemental data", function() {
			// OBS: this is already tested above.
			expect( pathNormalize( locale, "supplemental/likelySubtags" ) ).to.eql( [ "supplemental", "likelySubtags" ] );
		});

	});

});
