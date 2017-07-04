define([
	"src/core",
	"src/item/lookup",
	"json!cldr-data/main/pt/numbers.json",
	"json!cldr-data/supplemental/gender.json",
	"json!cldr-data/supplemental/likelySubtags.json",
	"src/unresolved"
], function( Cldr, itemLookup, ptNumbersJson, genderJson, likelySubtagsJson ) {

	describe( "Item Lookup", function() {

		before(function() {
			Cldr.load(
				genderJson,
				likelySubtagsJson,
				ptNumbersJson,
				{
					"lookup-test": {
						a: 1,
						b: 2
					},
					"falsy-items": {
						boolean: false,
						nan: NaN,
						null: null,
						number: 0,
						string: "",
						undefined: undefined
					}
				}
			);
		});

		it( "should get resolved items", function() {
			var cldr = new Cldr( "root" );
			expect( itemLookup( Cldr, cldr.locale, "/supplemental/gender/personList/de", cldr.attributes ) ).to.equal( "neutral" );
		});

		it( "should resolve and get unresolved items", function() {
			var cldr = new Cldr( "pt_BR" );
			expect( itemLookup( Cldr, cldr.locale, "/main/{bundle}/numbers/symbols-numberSystem-latn/decimal", cldr.attributes ) ).to.equal( "," );
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

		it( "should get falsy items", function() {
			var cldr = new Cldr( "root" );
			expect( itemLookup( Cldr, cldr.locale, "/falsy-items/boolean", cldr.attributes ) ).to.equal( false );
			expect( isNaN( itemLookup( Cldr, cldr.locale, "/falsy-items/nan", cldr.attributes ) ) ).to.equal( true );
			expect( itemLookup( Cldr, cldr.locale, "/falsy-items/null", cldr.attributes ) ).to.equal( null );
			expect( itemLookup( Cldr, cldr.locale, "/falsy-items/number", cldr.attributes ) ).to.equal( 0 );
			expect( itemLookup( Cldr, cldr.locale, "/falsy-items/string", cldr.attributes ) ).to.equal( "" );
			expect( itemLookup( Cldr, cldr.locale, "/falsy-items/undefined", cldr.attributes ) ).to.equal( undefined );
		});
	});

});
