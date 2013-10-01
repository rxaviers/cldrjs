define([
	"cldr/main.runtime",
	"cldr/likely-subtags"
], function( Cldr, likelySubtags ) {

	Cldr.load({
		supplemental: {
			likelySubtags: {
				"az_Arab": "az_Arab_IR",
				"und": "en_Latn_US",
				"und_Java": "jv_Java_ID",
				"und_Latn_RU": "krl_Latn_RU",
				"zh_HK": "zh_Hant_HK"
				
			}
		}
	});

	describe( "Likely Subtags", function() {

		it( "should skip empty language tag", function() {
			expect( likelySubtags( Cldr, [ "en", "Latn", "US" ] ) ).to.eql( [ "en", "Latn", "US" ] );
		});

		it( "should lookup language_script_territory's", function() {
			expect( likelySubtags( Cldr, [ "und", "Latn", "RU" ] ) ).to.eql( [ "krl", "Latn", "RU" ] );
		});

		it( "should lookup language_territory's", function() {
			expect( likelySubtags( Cldr, [ "zh", "Zzzz", "HK" ] ) ).to.eql( [ "zh", "Hant", "HK" ] );
		});

		it( "should lookup language_script's", function() {
			expect( likelySubtags( Cldr, [ "az", "Arab", "ZZ" ] ) ).to.eql( [ "az", "Arab", "IR" ] );
		});

		it( "should lookup und_scripts's", function() {
			expect( likelySubtags( Cldr, [ "und", "Java", "ZZ" ] ) ).to.eql( [ "jv", "Java", "ID" ] );
		});

		it( "should lookup root", function() {
			expect( likelySubtags( Cldr, [ "und", "Zzzz", "ZZ" ] ) ).to.eql( [ "en", "Latn", "US" ] );
		});

		it( "should lookup inexistent when option { force: true }", function() {
			expect( likelySubtags( Cldr, [ "foo", "Zzzz", "bar" ], { force: true } ) ).to.eql( [ "en", "Latn", "US" ] );
		});

	});

});
