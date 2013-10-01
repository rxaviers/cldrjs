define([
	"cldr/main.runtime"
], function( Cldr ) {

	Cldr.load({
		supplemental: {
			likelySubtags: {
				"pt": "pt_Latn_BR",
				"en": "en_Latn_US"
			}
		}
	});

	describe( "Init", function() {

		it( "should normalize a locale", function() {
			var cldr = new Cldr( "pt-BR" );
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

	});

});
