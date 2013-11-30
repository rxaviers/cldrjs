define([
	"../bundle/parent_lookup",
	"../path/normalize",
	"../resource/get",
	"../resource/set",
	"../util/json/merge"
], function( bundleParentLookup, pathNormalize, resourceGet, resourceSet, jsonMerge ) {

	var lookup;

	lookup = function( Cldr, locale, path, attributes, childLocale ) {
		var normalizedPath, parent, value;

		// 1: Finish recursion
		// 2: Avoid infinite loop
		if ( typeof locale === "undefined" /* 1 */ || locale === childLocale /* 2 */ ) {
			return;
		}

		// Resolve path
		normalizedPath = pathNormalize( path, attributes );

		// Check resolved (cached) data first
		value = resourceGet( Cldr._resolved, normalizedPath );
		if ( value ) {
			return value;
		}

		// Check raw data
		value = resourceGet( Cldr._raw, normalizedPath );

		if ( !value ) {
			// Or, lookup at parent locale
			parent = bundleParentLookup( Cldr, locale );
			value = lookup( Cldr, parent, path, jsonMerge( attributes, { languageId: parent }), locale );
		}

		// Set resolved (cached)
		resourceSet( Cldr._resolved, normalizedPath, value );

		return value;
	};

	return lookup;

});
