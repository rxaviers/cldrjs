define([
	"src/main",
	"src/bundle/parent_lookup"
], function( Cldr, parentLookup ) {

	Cldr.load({
		supplemental: {
			parentLocales: {
				parentLocale: {
					"en-IN": "en-GB"
				}
			}
		}
	});

	describe( "Bundle Parent Lookup", function() {

		it( "should truncate locale", function() {
			expect( parentLookup( Cldr, [ "pt", "BR" ].join( Cldr.localeSep ) ) ).to.equal( "pt" );
		});

		it( "should end with root", function() {
			expect( parentLookup( Cldr, "en" ) ).to.equal( "root" );
		});

		it( "should use supplemental resource", function() {
			expect( parentLookup( Cldr, [ "en", "IN" ].join( Cldr.localeSep ) ) ).to.equal( [ "en", "GB" ].join( Cldr.localeSep ) );
		});

	});

});
