define([
	"src/main",
	"src/supplemental"
], function( Cldr, supplemental ) {

	Cldr.load({
		supplemental: {
			likelySubtags: {
				"en": "en_Latn_US",
				"fr": "fr_Latn_FR",
				"pt": "pt_Latn_BR"
			},
			timeData: {
				"001": {
					"_allowed": "H h",
					"_preferred": "H"
				},
				"BR": {
					"_allowed": "H",
					"_preferred": "H"
				},
				"US": {
					"_allowed": "H h",
					"_preferred": "h"
				}
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
			enGb = new Cldr( "en_GB" ),
			fr = new Cldr( "fr" ),
			ptBr = new Cldr( "pt_BR" );

		en.supplemental = supplemental( en );
		enGb.supplemental = supplemental( enGb );
		fr.supplemental = supplemental( fr );
		ptBr.supplemental = supplemental( ptBr );

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

		it( "should get timeData.allowed", function() {
			// Explicitly defined allowed.
			expect( en.supplemental.timeData.allowed() ).to.equal( "H h" );
			expect( ptBr.supplemental.timeData.allowed() ).to.equal( "H" );

			// Or default (001).
			expect( enGb.supplemental.timeData.allowed() ).to.equal( "H h" );
		});

		it( "should get timeData.preferred", function() {
			// Explicitly defined preferred.
			expect( en.supplemental.timeData.preferred() ).to.equal( "h" );
			expect( ptBr.supplemental.timeData.preferred() ).to.equal( "H" );

			// Or default (001).
			expect( enGb.supplemental.timeData.preferred() ).to.equal( "H" );
		});

	});

});
