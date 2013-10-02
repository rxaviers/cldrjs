define([
	"cldr/main.runtime"
], function( Cldr ) {

	Cldr.load({
		main: {
			en: {
				numbers: {
					"symbols-numberSystem-latn": {
						decimal: "."
					}
				}
			}
		},
		supplemental: {
			likelySubtags: {
				"en": "en_Latn_US"
			}
		}
	});

	describe( "Common", function() {
		var cldr = new Cldr( "en" );

		describe( "main()", function() {
			it( "should get main/{languageId} items", function() {
				expect( cldr.main( "numbers/symbols-numberSystem-latn/decimal" ) ).to.equal( "." );
			});

		});

	});

});
