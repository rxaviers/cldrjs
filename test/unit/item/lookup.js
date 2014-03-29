define([
	"src/main",
	"src/item/lookup",
	"json!fixtures/cldr/main/pt/numbers.json",
	"json!fixtures/cldr/supplemental/gender.json",
	"json!fixtures/cldr/supplemental/likelySubtags.json",
	"src/main_unresolved"
], function( Cldr, itemLookup, ptNumbersJson, genderJson, likelySubtagsJson ) {

	Cldr.load( genderJson );
	Cldr.load( likelySubtagsJson );
	Cldr.load( ptNumbersJson );

	describe( "Item Lookup", function() {

		it( "should get resolved items", function() {
			var cldr = new Cldr( "root" );
			expect( itemLookup( Cldr, cldr.locale, "/supplemental/gender/personList/de", cldr.attributes ) ).to.equal( "neutral" );
		});

		it( "should resolve and get unresolved items", function() {
			var cldr = new Cldr( "pt_BR" );
			expect( itemLookup( Cldr, cldr.locale, "/main/{languageId}/numbers/symbols-numberSystem-latn/decimal", cldr.attributes ) ).to.equal( "," );
		});

	});

});
