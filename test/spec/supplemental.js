define([
	"cldr/main.runtime"
], function( Cldr ) {

	Cldr.load({
		supplemental: {
			likelySubtags: {
				"en": "en_Latn_US",
				"pt": "pt_Latn_BR"
			},
			weekData: {
				firstDay: {
					"001": "mon",
					"US": "sun"
				}
			}
		}
	});

	describe( "Supplemental", function() {
		var en = new Cldr( "en" ),
			ptBr = new Cldr( "pt_BR" );

		it( "should get firstDay", function() {
			// Defined firstDays.
			expect( en.supplemental.firstDay() ).to.equal( "sun" );

			// Or default (001).
			expect( ptBr.supplemental.firstDay() ).to.equal( "mon" );
		});

	});

});
