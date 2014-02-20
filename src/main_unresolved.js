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
		// 1: use languageId as locale on item lookup for simplification purposes, because no other extended subtag is used anyway on bundle parent lookup.
		// 2: during init(), this method is called, but languageId is yet not defined. Use "" as a workaround in this very specific scenario.
		return getSuper.apply( this, arguments ) ||
			itemLookup( Cldr, this.attributes && this.attributes.languageId /* 1 */ || "" /* 2 */, path, this.attributes );
	};

	return Cldr;

});
