define([
	"src/main"
], function( Cldr ) {

	Cldr.load({
		main: {
			en: {
				numbers: {
					"symbols-numberSystem-latn": {
						decimal: "."
					}
				}
			}
		},
		supplemental: {
			likelySubtags: {
				"en": "en-Latn-US",
				"pt": "pt-Latn-BR",
				"und": "en-Latn-US"
			}
		}
	});

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

			cldr = new Cldr( "root" );
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
