define([
	"cldr/main.runtime"
], function( Cldr ) {

	Cldr.load({
		supplemental: {
			likelySubtags: {
				"en": "en_Latn_US",
				"fr": "fr_Latn_FR",
				"pt": "pt_Latn_BR"
			},
			weekData: {
				firstDay: {
					"001": "mon",
					"US": "sun"
				},
				minDays: {
					"001": "1",
					"FR": "4"
				}
			}
		}
	});

	describe( "Supplemental", function() {
		var en = new Cldr( "en" ),
			fr = new Cldr( "fr" ),
			ptBr = new Cldr( "pt_BR" );

		it( "should get firstDay", function() {
			// Defined firstDays.
			expect( en.supplemental.firstDay() ).to.equal( "sun" );

			// Or default (001).
			expect( ptBr.supplemental.firstDay() ).to.equal( "mon" );
		});

		it( "should get minDays", function() {
			// Defined firstDays.
			expect( fr.supplemental.minDays() ).to.equal( 4 );

			// Or default (001).
			expect( en.supplemental.minDays() ).to.equal( 1 );
		});

	});

});
