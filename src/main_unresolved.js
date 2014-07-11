define([
	"./main",
	"./item/lookup",
	"./util/json/merge"
], function( Cldr, itemLookup, jsonMerge ) {

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

	// Overwrite Cldr.prototype.get().
	Cldr.prototype.get = function( path ) {
		// 1: use languageId as locale on item lookup for simplification purposes, because no other extended subtag is used anyway on bundle parent lookup.
		// 2: during init(), this method is called, but languageId is yet not defined. Use "" as a workaround in this very specific scenario.
		return itemLookup( Cldr, this.attributes && this.attributes.languageId /* 1 */ || "" /* 2 */, path, this.attributes );
	};

	return Cldr;

});
