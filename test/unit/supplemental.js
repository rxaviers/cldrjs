define([
	"src/core",
	"src/supplemental/main",
	"json!cldr-data/supplemental/likelySubtags.json",
	"json!cldr-data/supplemental/timeData.json",
	"json!cldr-data/supplemental/weekData.json"
], function( Cldr, supplemental, likelySubtagsJson, timeDataJson, weekDataJson ) {

	describe( "Supplemental", function() {
		var en, enGb, fr, ptBr, ty;

		before(function() {
			Cldr.load(
				likelySubtagsJson,
				timeDataJson,
				weekDataJson
			);

			en = new Cldr( "en" ),
			enGb = new Cldr( "en_GB" ),
			fr = new Cldr( "fr" ),
			ptBr = new Cldr( "pt_BR" ),
			ty = new Cldr( "ty" );

			en.supplemental = supplemental( en );
			enGb.supplemental = supplemental( enGb );
			fr.supplemental = supplemental( fr );
			ptBr.supplemental = supplemental( ptBr );
			ty.supplemental = supplemental( ty );
		});

		it( "should get weekData.firstDay", function() {
			// Explicitly defined firstDay.
			expect( en.supplemental.weekData.firstDay() ).to.equal( "sun" );

			// Or default (001).
			expect( ty.supplemental.weekData.firstDay() ).to.equal( "mon" );
		});

		it( "should get weekData.minDays", function() {
			// Explicitly defined minDays.
			expect( fr.supplemental.weekData.minDays() ).to.equal( 4 );

			// Or default (001).
			expect( en.supplemental.weekData.minDays() ).to.equal( 1 );
		});

		it( "should get timeData.allowed", function() {
			// Explicitly defined allowed.
			expect( en.supplemental.timeData.allowed() ).to.equal( "h hb H hB" );
			expect( ptBr.supplemental.timeData.allowed() ).to.equal( "H hB" );

			// Or default (001).
			expect( enGb.supplemental.timeData.allowed() ).to.equal( "H h hb hB" );
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
