define([
	"src/core/subtags"
], function( subtags ) {

	describe( "Subtags", function() {
		it( "should match language", function() {
			expect( subtags( "root" ) ).to.eql( [ "root", "Zzzz", "ZZ" ] );
		});

		it( "should match language", function() {
			expect( subtags( "en" ) ).to.eql( [ "en", "Zzzz", "ZZ" ] );
			expect( subtags( "ar" ) ).to.eql( [ "ar", "Zzzz", "ZZ" ] );
			expect( subtags( "zh" ) ).to.eql( [ "zh", "Zzzz", "ZZ" ] );
			expect( subtags( "pt" ) ).to.eql( [ "pt", "Zzzz", "ZZ" ] );
			expect( subtags( "foobar" ) ).to.eql( [ "und", "Zzzz", "ZZ" ] );
		});

		it( "should match language_region", function() {
			expect( subtags( "en-US" ) ).to.eql( [ "en", "Zzzz", "US" ] );
			expect( subtags( "ar-EG" ) ).to.eql( [ "ar", "Zzzz", "EG" ] );
			expect( subtags( "zh-CN" ) ).to.eql( [ "zh", "Zzzz", "CN" ] );
			expect( subtags( "pt-BR" ) ).to.eql( [ "pt", "Zzzz", "BR" ] );
			expect( subtags( "en-001" ) ).to.eql( [ "en", "Zzzz", "001" ] );
			expect( subtags( "en-0001" ) ).to.eql( [ "en", "Zzzz", "ZZ", "0001" ] );
			expect( subtags( "en-01" ) ).to.eql( [ "und", "Zzzz", "ZZ" ] );
		});

		it( "should match language_script", function() {
			expect( subtags( "en-Latn" ) ).to.eql( [ "en", "Latn", "ZZ" ] );
			expect( subtags( "ar-Arab" ) ).to.eql( [ "ar", "Arab", "ZZ" ] );
			expect( subtags( "ar-Arabic" ) ).to.eql( [ "ar", "Zzzz", "ZZ", "Arabic" ] );
		});

		it( "should match language_script_region", function() {
			expect( subtags( "en-Latn-US" ) ).to.eql( [ "en", "Latn", "US" ] );
			expect( subtags( "ar-Arab-EG" ) ).to.eql( [ "ar", "Arab", "EG" ] );
			expect( subtags( "ar-EG-Arab" ) ).to.eql( [ "und", "Zzzz", "ZZ" ] );
		});

		it( "should match language_script_region_variant", function() {
			expect( subtags( "en-US-POSIX" ) ).to.eql( [ "en", "Zzzz", "US", "POSIX" ] );
			expect( subtags( "ca-ES-VALENCIA" ) ).to.eql( [ "ca", "Zzzz", "ES", "VALENCIA" ] );
		});

		it( "should match language_script_region_unicode_extension", function() {
			var aux = subtags( "en-u-cu-usd" );
			expect( aux[ 0 ] ).to.eql( "en" );
			expect( aux[ 1 ] ).to.eql( "Zzzz" );
			expect( aux[ 2 ] ).to.eql( "ZZ" );
			expect( aux[ 4 ] ).to.eql( "cu-usd" );
		});

	});

});
