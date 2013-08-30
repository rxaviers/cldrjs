define([
	"cldr/main.runtime",
	"cldr/bundle/parent-lookup"
], function( Cldr, parentLookup ) {

	var cldr = new Cldr( "root" );

	Cldr.loadResolved({
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
			expect( parentLookup( cldr, "pt_BR" ) ).to.equal( "pt" );
		});

		it( "should end with root", function() {
			expect( parentLookup( cldr, "en" ) ).to.equal( "root" );
		});

		it( "should use supplemental resource", function() {
			expect( parentLookup( cldr, "en_IN" ) ).to.equal( "en_GB" );
		});

	});

});
