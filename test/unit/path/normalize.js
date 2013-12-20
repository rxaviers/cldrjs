define([
	"src/path/normalize",
], function( pathNormalize ) {

	describe("Path Normalize", function() {

		it( "should throw Error on invalid path", function() {
			var invalidPath = 5;
			expect(function() {
				pathNormalize( invalidPath );
			}).to.throw( Error );
		});

		it( "should split a String into an Array", function() {
			var value = pathNormalize( "supplemental/likelySubtags" );
			expect( value ).to.be.instanceof( Array );
			expect( value ).to.eql( [ "supplemental", "likelySubtags" ] );
		});

		it( "should ignore a leading slash / on path", function() {
			var value = pathNormalize( "/supplemental/likelySubtags" );
			expect( value ).to.be.instanceof( Array );
			expect( value ).to.eql( [ "supplemental", "likelySubtags" ] );
		});

		it( "should ignore a leading /cldr/ or cldr/ on path", function() {
			[ "/cldr/supplemental/likelySubtags", "cldr/supplemental/likelySubtags" ].forEach(function( path ) {
				var value = pathNormalize( path );
				expect( value ).to.be.instanceof( Array );
				expect( value ).to.eql( [ "supplemental", "likelySubtags" ] );
			});
		});

		it( "should replace attribute variables", function() {
			expect( pathNormalize( "main/{languageId}/numbers/decimalFormats-numberSystem-latn", { languageId: "root" } ) ).to.eql( [ "main", "root", "numbers", "decimalFormats-numberSystem-latn" ] );
		});

		it( "should split the inner Strings of an Array into a flatten Array", function() {
			expect( pathNormalize( [ "main/{languageId}/numbers", "decimalFormats-numberSystem-latn" ], { languageId: "root" } ) ).to.eql( [ "main", "root", "numbers", "decimalFormats-numberSystem-latn" ] );
		});

	});

});
