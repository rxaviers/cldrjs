define([
	"./common",
	"./init",
	"./item/lookup",
	"./item/get-resolved",
	"./util/json/merge"
], function( common, init, itemLookup, itemGetResolved, jsonMerge ) {

	var Cldr = function() {
		init.apply( this, arguments );
	};

	Cldr._resolved = {};
	Cldr._raw = {};

	// Load resolved or unresolved cldr data
	// @json [JSON]
	Cldr.load = function( json ) {
		if ( typeof json !== "object" ) {
			throw new Error( "invalid json" );
		}
		Cldr._raw = jsonMerge( Cldr._raw, json );
	};

	Cldr.prototype.get = function( path ) {
		// Simplify locale using languageId (there are no other resource bundles)
		// 1: during init(), get is called, but languageId is not defined. Use "" as a workaround in this very specific scenario.
		var locale = this.attributes && this.attributes.languageId || "" /* 1 */;
		return itemGetResolved( Cldr, path, this.attributes ) ||
			itemLookup( Cldr, locale, path, this.attributes );
	};

	common( Cldr );

	return Cldr;

});
