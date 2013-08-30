define([
	"../resource/get",
	"../path/normalize"
], function( resourceGet, pathNormalize ) {

	return function( Cldr, locale ) {
		var parent;

		if ( locale === "root" ) {
			return;
		}

		// First, try to find parent on supplemental data.
		parent = resourceGet( Cldr._resolved, pathNormalize( "root", "supplemental/parentLocales/parentLocale/" + locale ) );
		if ( parent ) {
			return parent;
		}

		// Or truncate locale.
		parent = locale.substr( 0, locale.lastIndexOf( "_" ) );
		if ( !parent ) {
			return "root";
		}

		return parent;
	};

});
