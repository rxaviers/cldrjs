define([
	"cldr/main",
	"cldr/item/lookup"
], function( Cldr, itemLookup ) {

	Cldr.load({
		main: {
			pt: {
				numbers: {
					"symbols-numberSystem-latn": {
						decimal: ","
					}
				}
			}
		},
		supplemental: {
			gender: {
				personList: {
					de: "neutral"
				}
			}
		}
	});

	describe( "Item Lookup", function() {

		it( "should get resolved items", function() {
			var cldr = new Cldr("root");
			expect( itemLookup( Cldr, cldr, "root", "/supplemental/gender/personList/de" ) ).to.equal( "neutral" );
		});

		it( "should resolve and get unresolved items", function() {
			var cldr = new Cldr("pt_BR");
			expect( itemLookup( Cldr, cldr, "pt_BR", "/main/numbers/symbols-numberSystem-latn/decimal" ) ).to.equal( "," );
		});

	});

});
