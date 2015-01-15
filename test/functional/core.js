define([
	"cldr",
	"../util",
	"json!cldr-data/main/en/numbers.json",
	"json!cldr-data/supplemental/likelySubtags.json"
], function( Cldr, util, enNumbersJson, likelySubtagsJson ) {

	var isLoaded;

	function cldrLoad() {
		if ( isLoaded ) {
			return;
		}
		Cldr.load( enNumbersJson, likelySubtagsJson );
		isLoaded = true;
	}

	describe( "Cldr.load( json )", function() {

		it( "should throw error on missing json parameter", function() {
			expect(function() {
				Cldr.load();
			}).to.throw( Error, /E_MISSING_PARAMETER/ );
		});

		it( "should throw error on invalid locale parameter type", function() {
			util.assertObjectParameter( expect, function( invalidValue ) {
				return function() {
					Cldr.load( invalidValue );
				};
			});
		});

		it( "should throw error on invalid locale parameter type", function() {
			util.assertObjectParameter( expect, function( invalidValue ) {
				return function() {
					Cldr.load([ { a: 1 }, invalidValue ]);
				};
			});
		});

		it( "should throw error on invalid locale parameter type", function() {
			util.assertObjectParameter( expect, function( invalidValue ) {
				return function() {
					Cldr.load( { a: 1 }, invalidValue );
				};
			});
		});

	});

	describe( "new Cldr( locale )", function() {
		cldrLoad();

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
		var cldr;
		cldrLoad();
		cldr = new Cldr( "en" );

		it( "should throw error on invalid parameter type", function() {
			util.assertPathParameter( expect, function( invalidValue ) {
				return function() {
					cldr.get( invalidValue );
				};
			});
		});

	});

	describe( ".main( path )", function() {
		var cldr;
		cldrLoad();
		cldr = new Cldr( "en" );

		it( "should throw error on invalid parameter type", function() {
			util.assertPathParameter( expect, function( invalidValue ) {
				return function() {
					cldr.main( invalidValue );
				};
			});
		});

		it( "should throw error on missing bundle", function() {
			var cldr = new Cldr( "sr-RS" );
			expect( cldr.attributes.bundle ).to.be.null;
			expect(function() {
				cldr.main( "numbers" );
			}).to.throw( Error, /E_MISSING_BUNDLE/ );
		});

	});

});
