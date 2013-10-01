define([
	"cldr/main",
	"cldr/item/lookup"
], function( Cldr, itemLookup ) {

	Cldr.loadUnresolved({
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
			},
			likelySubtags: {
				"pt": "pt_Latn_BR"
			}
		}
	});

	describe( "Item Lookup", function() {

		it( "should get resolved items", function() {
			var cldr = new Cldr( "root" );
			expect( itemLookup( Cldr, cldr, "root", "/supplemental/gender/personList/de" ) ).to.equal( "neutral" );
		});

		it( "should resolve and get unresolved items", function() {
			var cldr = new Cldr( "pt_BR" );
			expect( itemLookup( Cldr, cldr, "pt_BR", "/main/{languageId}/numbers/symbols-numberSystem-latn/decimal" ) ).to.equal( "," );
		});

	});

});
