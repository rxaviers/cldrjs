define([
	"src/main",
	"src/likely_subtags"
], function( Cldr, likelySubtags ) {

	Cldr.load({
		supplemental: {
			likelySubtags: {
				"az-Arab": "az-Arab-IR",
				"und": "en-Latn-US",
				"und-Java": "jv-Java-ID",
				"und-Latn-RU": "krl-Latn-RU",
				"zh-HK": "zh-Hant-HK"
			}
		}
	});

	describe( "Likely Subtags", function() {
		var cldr = new Cldr( "root" );

		it( "should skip empty language tag", function() {
			expect( likelySubtags( Cldr, cldr, [ "en", "Latn", "US" ] ) ).to.eql( [ "en", "Latn", "US" ] );
		});

		it( "should lookup language_script_territory's", function() {
			expect( likelySubtags( Cldr, cldr, [ "und", "Latn", "RU" ] ) ).to.eql( [ "krl", "Latn", "RU" ] );
		});

		it( "should lookup language_territory's", function() {
			expect( likelySubtags( Cldr, cldr, [ "zh", "Zzzz", "HK" ] ) ).to.eql( [ "zh", "Hant", "HK" ] );
		});

		it( "should lookup language_script's", function() {
			expect( likelySubtags( Cldr, cldr, [ "az", "Arab", "ZZ" ] ) ).to.eql( [ "az", "Arab", "IR" ] );
		});

		it( "should lookup und_scripts's", function() {
			expect( likelySubtags( Cldr, cldr, [ "und", "Java", "ZZ" ] ) ).to.eql( [ "jv", "Java", "ID" ] );
		});

		it( "should lookup root", function() {
			expect( likelySubtags( Cldr, cldr, [ "und", "Zzzz", "ZZ" ] ) ).to.eql( [ "en", "Latn", "US" ] );
		});

		it( "should lookup inexistent when option { force: true }", function() {
			expect( likelySubtags( Cldr, cldr, [ "foo", "Zzzz", "bar" ], { force: true } ) ).to.eql( [ "en", "Latn", "US" ] );
		});

	});

});
