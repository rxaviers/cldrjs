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
		var cldr = new Cldr( "root" );

		it( "should skip empty language tag", function() {
			expect( likelySubtags( cldr, [ "en", "Latn", "US" ] ) ).to.eql( [ "en", "Latn", "US" ] );
		});

		it( "should lookup language_script_territory's", function() {
			expect( likelySubtags( cldr, [ "und", "Latn", "RU" ] ) ).to.eql( [ "krl", "Latn", "RU" ] );
		});

		it( "should lookup language_territory's", function() {
			expect( likelySubtags( cldr, [ "zh", "Zzzz", "HK" ] ) ).to.eql( [ "zh", "Hant", "HK" ] );
		});

		it( "should lookup language_script's", function() {
			expect( likelySubtags( cldr, [ "az", "Arab", "ZZ" ] ) ).to.eql( [ "az", "Arab", "IR" ] );
		});

		it( "should lookup und_scripts's", function() {
			expect( likelySubtags( cldr, [ "und", "Java", "ZZ" ] ) ).to.eql( [ "jv", "Java", "ID" ] );
		});

		it( "should lookup root", function() {
			expect( likelySubtags( cldr, [ "und", "Zzzz", "ZZ" ] ) ).to.eql( [ "en", "Latn", "US" ] );
		});

		it( "should lookup inexistent when option { force: true }", function() {
			expect( likelySubtags( cldr, [ "foo", "Zzzz", "bar" ], { force: true } ) ).to.eql( [ "en", "Latn", "US" ] );
		});

	});

});
