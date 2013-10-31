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

		it( "should get weekData.firstDay", function() {
			// Explicitly defined firstDay.
			expect( en.supplemental.weekData.firstDay() ).to.equal( "sun" );

			// Or default (001).
			expect( ptBr.supplemental.weekData.firstDay() ).to.equal( "mon" );
		});

		it( "should get weekData.minDays", function() {
			// Explicitly defined minDays.
			expect( fr.supplemental.weekData.minDays() ).to.equal( 4 );

			// Or default (001).
			expect( en.supplemental.weekData.minDays() ).to.equal( 1 );
		});

	});

});
