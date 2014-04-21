define([
	"src/main",
	"json!fixtures/cldr/main/en/numbers.json",
	"json!fixtures/cldr/supplemental/likelySubtags.json"
], function( Cldr, enNumbersJson, likelySubtagsJson ) {

	Cldr.load( enNumbersJson );
	Cldr.load( likelySubtagsJson );

	describe( "Cldr (core)", function() {
		var cldr;

		it( "should normalize a locale on initialization", function() {
			cldr = new Cldr( "pt-BR" );
			expect( cldr.attributes.language ).to.equal( "pt" );
			expect( cldr.attributes.script ).to.equal( "Latn" );
			expect( cldr.attributes.territory ).to.equal( "BR" );

			cldr = new Cldr( "en" );
			expect( cldr.attributes.language ).to.equal( "en" );
			expect( cldr.attributes.script ).to.equal( "Latn" );
			expect( cldr.attributes.territory ).to.equal( "US" );

			cldr = new Cldr( "en-GB" );
			expect( cldr.attributes.language ).to.equal( "en" );
			expect( cldr.attributes.script ).to.equal( "Latn" );
			expect( cldr.attributes.territory ).to.equal( "GB" );

			cldr = new Cldr( "lkt" );
			expect( cldr.attributes.language ).to.equal( "lkt" );
			expect( cldr.attributes.script ).to.equal( "Latn" );
			expect( cldr.attributes.territory ).to.equal( "US" );

			cldr = new Cldr( "root" );
			expect( cldr.attributes.language ).to.equal( "en" );
			expect( cldr.attributes.script ).to.equal( "Latn" );
			expect( cldr.attributes.territory ).to.equal( "US" );

			// Should not identify nonExistent as a language subtag, due to its length. So, it should become `und_Zzzz_ZZ`. Then, the `und` likelySubtags value.
			cldr = new Cldr( "nonExistent" );
			expect( cldr.attributes.language ).to.equal( "en" );
			expect( cldr.attributes.script ).to.equal( "Latn" );
			expect( cldr.attributes.territory ).to.equal( "US" );
		});

		it( "should implement cldr.main as an alias of get( \"main/{languageId}...\" )", function() {
			cldr = new Cldr( "en" );
			expect( cldr.main( "numbers/symbols-numberSystem-latn/decimal" ) ).to.equal( "." );
		});

	});

});
