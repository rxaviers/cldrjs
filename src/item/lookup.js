define([
	"../bundle/parent-lookup",
	"../resource/get",
	"../resource/set",
	"../path/normalize"
], function( bundleParentLookup, resourceGet, resourceSet, pathNormalize ) {

	var lookup;

	lookup = function( Cldr, cldr, locale, path, childLocale ) {
		var normalizedPath, value;

		// 1: Finish recursion
		// 2: Avoid infinite loop
		if ( !locale /* 1 */ || locale === childLocale /* 2 */ ) {
			return;
		}

		// Resolve path
		normalizedPath = pathNormalize( locale, path );

		// Check resolved (cached) data first
		value = resourceGet( Cldr._resolved, normalizedPath );
		if ( value ) {
			return value;
		}

		// Check raw data
		value = resourceGet( Cldr._raw, normalizedPath );

		if ( !value ) {
			// Or, lookup at parent locale
			value = lookup( Cldr, cldr, bundleParentLookup( Cldr, locale ), path, locale );
		}

		// Set resolved (cached)
		resourceSet( Cldr._resolved, normalizedPath, value );

		return value;
	};

	return lookup;

});
