define([
	"src/core",
	"src/core/likely_subtags",
	"json!cldr-data/supplemental/likelySubtags.json"
], function( Cldr, likelySubtags, likelySubtagsJson ) {

	describe( "Likely Subtags", function() {
		var cldr = new Cldr( "root" );

		before(function() {
			Cldr.load( likelySubtagsJson );
		});

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

		it( "should lookup und", function() {
			expect( likelySubtags( Cldr, cldr, [ "und", "Zzzz", "ZZ" ] ) ).to.eql( [ "en", "Latn", "US" ] );
		});

		it( "should lookup non-existent when option { force: true }", function() {
			expect( likelySubtags( Cldr, cldr, [ "foo", "Zzzz", "bar" ], { force: true } ) ).to.eql( [ "en", "Latn", "US" ] );
		});

		it( "should lookup variant subtag", function() {
			expect( likelySubtags( Cldr, cldr, [ "en", "Zzzz", "US", "POSIX" ] ) ).to.eql( [ "en", "Latn", "US", "POSIX" ] );
			expect( likelySubtags( Cldr, cldr, [ "ca", "Zzzz", "ES", "VALENCIA" ] ) ).to.eql( [ "ca", "Latn", "ES", "VALENCIA" ] );
		});

	});

});
