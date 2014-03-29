define([
	"src/main",
	"src/item/lookup",
	"src/main_unresolved"
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
			},
			likelySubtags: {
				"pt": "pt-Latn-BR",
				"und": "en-Latn-US"
			}
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

	});

});
