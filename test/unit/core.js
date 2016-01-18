define([
	"src/core",
	"json!cldr-data/main/en/numbers.json",
	"json!cldr-data/supplemental/likelySubtags.json"
], function( Cldr, enNumbersJson, likelySubtagsJson ) {

	describe( "Cldr (core)", function() {
		before(function() {
			Cldr.load( enNumbersJson, likelySubtagsJson );
		});

		describe( "Cldr.load()", function() {

			it( "should load json", function() {
				expect( Cldr._resolved && Cldr._resolved.supplemental ).to.be.ok;
			});

		});

		describe( "Constructor", function() {
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

				// Variant
				cldr = new Cldr( "en-POSIX" );
				expect( cldr.attributes.language ).to.equal( "en" );
				expect( cldr.attributes.script ).to.equal( "Latn" );
				expect( cldr.attributes.territory ).to.equal( "US" );
				expect( cldr.attributes.variant ).to.equal( "POSIX" );
			});

			it( "should set unicode locale extensions attributes", function() {
				cldr = new Cldr( "en-u-cu-usd" );
				expect( cldr.attributes[ "u-cu" ] ).to.equal( "usd" );

				cldr = new Cldr( "en-u-foo-bar-nu-arab-cu-usd" );
				expect( cldr.attributes[ "u-foo" ] ).to.be.true;
				expect( cldr.attributes[ "u-bar" ] ).to.be.true;
				expect( cldr.attributes[ "u-cu" ] ).to.equal( "usd" );
				expect( cldr.attributes[ "u-nu" ] ).to.equal( "arab" );
			});

			it( "should implement cldr.main as an alias of get( \"main/{bundle}...\" )", function() {
				cldr = new Cldr( "en" );
				expect( cldr.main( "numbers/symbols-numberSystem-latn/decimal" ) ).to.equal( "." );
			});

		});

	});

});
