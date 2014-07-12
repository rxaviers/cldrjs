define([
	"src/core",
	"src/bundle/parent_lookup",
	"json!fixtures/cldr/supplemental/parentLocales.json"
], function( Cldr, parentLookup, parentLocalesJson ) {

	Cldr.load( parentLocalesJson );

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
