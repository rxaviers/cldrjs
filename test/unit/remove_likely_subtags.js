define([
	"src/main",
	"src/remove_likely_subtags"
], function( Cldr, removeLikelySubtags ) {

	Cldr.load({
		supplemental: {
			likelySubtags: {
				"az_Arab": "az_Arab_IR",
				"en": "en_Latn_US",
				"pt": "pt_Latn_BR",
				"zh_HK": "zh_Hant_HK"
			}
		}
	});

	describe( "Remove Likely Subtags", function() {

		var cldr = new Cldr( "root" );

		it( "Should reduce \"en_Latn_US\" into \"en\"", function() {
			expect( removeLikelySubtags( cldr, [ "en", "Latn", "US" ] ) ).to.eql( [ "en" ] );
		});

		it( "Should reduce \"pt_Latn_BR\" into \"pt\"", function() {
			expect( removeLikelySubtags( cldr, [ "pt", "Latn", "BR" ] ) ).to.eql( [ "pt" ] );
		});

		it( "Should reduce \"en_Latn_GB\" into \"en_GB\"", function() {
			expect( removeLikelySubtags( cldr, [ "en", "Latn", "GB" ] ) ).to.eql( [ "en", "GB" ] );
		});

		it( "Should reduce \"zh_Hant_HK\" into \"zh_HK\"", function() {
			expect( removeLikelySubtags( cldr, [ "zh", "Hant", "HK" ] ) ).to.eql( [ "zh", "HK" ] );
		});

		it( "Should reduce \"az_Arab_IR\" into \"az_Arab\"", function() {
			expect( removeLikelySubtags( cldr, [ "az", "Arab", "IR" ] ) ).to.eql( [ "az", "Arab" ] );
		});

	});

});
