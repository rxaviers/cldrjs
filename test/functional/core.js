define([
	"cldr",
	"../util",
	"json!fixtures/cldr/main/en/numbers.json",
	"json!fixtures/cldr/supplemental/likelySubtags.json"
], function( Cldr, util, enNumbersJson, likelySubtagsJson ) {

	Cldr.load( enNumbersJson );
	Cldr.load( likelySubtagsJson );

	describe( "new Cldr( locale )", function() {

		it( "should throw error on missing locale parameter", function() {
			expect(function() {
				new Cldr();
			}).to.throw( Error, /E_MISSING_PARAMETER/ );
		});

		it( "should throw error on invalid locale parameter type", function() {
			util.assertStringParameter( expect, function( invalidValue ) {
				return function() {
					new Cldr( invalidValue );
				};
			});
		});

	});

	describe( ".get( path )", function() {
		var cldr = new Cldr( "en" );

		it( "should throw error on invalid parameter type", function() {
			util.assertPathParameter( expect, function( invalidValue ) {
				return function() {
					cldr.get( invalidValue );
				};
			});
		});

	});

	describe( ".main( path )", function() {
		var cldr = new Cldr( "en" );

		it( "should throw error on invalid parameter type", function() {
			util.assertPathParameter( expect, function( invalidValue ) {
				return function() {
					cldr.main( invalidValue );
				};
			});
		});

	});

});
