define([
	"./common/validate/presence",
	"./common/validate/type/path",
	"./common/validate/type/plain_object",
	"./core",
	"./item/lookup",
	"./util/always_array",
	"./util/json/merge"
], function( validatePresence, validateTypePath, validateTypePlainObject, Cldr, itemLookup, alwaysArray, jsonMerge ) {

	Cldr._raw = {};

	/**
	 * Load resolved or unresolved cldr data
	 * @json [JSON]
	 *                                       
	 * Overwrite Cldr.load().
	 */
	Cldr.load = function( json ) {
		var i, j;

		validatePresence( json, "json" );

		// Support arbitrary parameters, e.g., `Cldr.load({...}, {...})`.
		for ( i = 0; i < arguments.length; i++ ) {

			// Support array parameters, e.g., `Cldr.load([{...}, {...}])`.
			json = alwaysArray( arguments[ i ] );

			for ( j = 0; j < json.length; j++ ) {
				validateTypePlainObject( json[ j ], "json" );
				Cldr._raw = jsonMerge( Cldr._raw, json[ j ] );
			}
		}
	};

	/**
	 * Overwrite Cldr.prototype.get().
	 */
	Cldr.prototype.get = function( path ) {
		validatePresence( path, "path" );
		validateTypePath( path, "path" );

		// 1: use languageId as locale on item lookup for simplification purposes, because no other extended subtag is used anyway on bundle parent lookup.
		// 2: during init(), this method is called, but languageId is yet not defined. Use "" as a workaround in this very specific scenario.
		return itemLookup( Cldr, this.attributes && this.attributes.languageId /* 1 */ || "" /* 2 */, path, this.attributes );
	};

	// In case cldr/unresolved is loaded after cldr/event, we trigger its overloads again. Because, .get is overwritten in here.
	if ( Cldr._eventInit ) {
		Cldr._eventInit();
	}

	return Cldr;

});
