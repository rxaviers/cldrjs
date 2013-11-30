define([
	"cldr/main.runtime",
	"cldr/bundle/parent_lookup"
], function( Cldr, parentLookup ) {

	Cldr.load({
		supplemental: {
			parentLocales: {
				parentLocale: {
					en_IN: "en_GB"
				}
			}
		}
	});

	describe( "Bundle Parent Lookup", function() {

		it( "should truncate locale", function() {
			expect( parentLookup( Cldr, "pt_BR" ) ).to.equal( "pt" );
		});

		it( "should end with root", function() {
			expect( parentLookup( Cldr, "en" ) ).to.equal( "root" );
		});

		it( "should use supplemental resource", function() {
			expect( parentLookup( Cldr, "en_IN" ) ).to.equal( "en_GB" );
		});

	});

});
