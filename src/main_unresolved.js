define([
	"./main",
	"./item/lookup",
	"./item/get_resolved",
	"./util/json/merge"
], function( Cldr, itemLookup, itemGetResolved, jsonMerge ) {

	var getSuper;

	Cldr._raw = {};

	// Load resolved or unresolved cldr data
	// @json [JSON]
	//
	// Overwrite Cldr.load().
	Cldr.load = function( json ) {
		if ( typeof json !== "object" ) {
			throw new Error( "invalid json" );
		}
		Cldr._raw = jsonMerge( Cldr._raw, json );
	};

	// Overload Cldr.prototype.get().
	getSuper = Cldr.prototype.get;
	Cldr.prototype.get = function( path ) {
		// Simplify locale using languageId (there are no other resource bundles)
		// 1: during init(), get is called, but languageId is not defined. Use "" as a workaround in this very specific scenario.
		var locale = this.attributes && this.attributes.languageId || "" /* 1 */;

		return getSuper.apply( this, arguments ) ||
			itemLookup( Cldr, locale, path, this.attributes );
	};

	return Cldr;

});
