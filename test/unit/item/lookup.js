define([
	"src/core",
	"src/item/lookup",
	"json!fixtures/cldr/main/pt/numbers.json",
	"json!fixtures/cldr/supplemental/gender.json",
	"json!fixtures/cldr/supplemental/likelySubtags.json",
	"src/unresolved"
], function( Cldr, itemLookup, ptNumbersJson, genderJson, likelySubtagsJson ) {

	Cldr.load( genderJson );
	Cldr.load( likelySubtagsJson );
	Cldr.load( ptNumbersJson );
	Cldr.load({
		"lookup-test": {
			a: 1,
			b: 2
		}
	});

	describe( "Item Lookup", function() {

		it( "should get resolved items", function() {
			var cldr = new Cldr( "root" );
			expect( itemLookup( Cldr, cldr.locale, "/supplemental/gender/personList/de", cldr.attributes ) ).to.equal( "neutral" );
		});

		it( "should resolve and get unresolved items", function() {
			var cldr = new Cldr( "pt_BR" );
			expect( itemLookup( Cldr, cldr.locale, "/main/{languageId}/numbers/symbols-numberSystem-latn/decimal", cldr.attributes ) ).to.equal( "," );
		});

		it( "should only cache found resolved items", function() {
			var cldr = new Cldr( "root" );
			itemLookup( Cldr, cldr.locale, "/lookup-inexistent-item/data", cldr.attributes );
			expect( Cldr._resolved[ "lookup-inexistent-item" ] ).to.be.undefined;
		});

		it( "should only cache leaf items", function() {
			var cldr = new Cldr( "root" );
			expect( itemLookup( Cldr, cldr.locale, "/lookup-test/a", cldr.attributes ) ).to.equal( 1 );
			expect( itemLookup( Cldr, cldr.locale, "/lookup-test", cldr.attributes ) ).to.eql({ a: 1, b: 2 });
		});

	});

});
