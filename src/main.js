define([
	"./init",
	"./item/lookup",
	"./item/get-resolved",
	"./util/json/merge"
], function( init, itemLookup, itemGetResolved, jsonMerge ) {

	var Cldr = function() {
		init.apply( this, arguments );
	};

	Cldr._resolved = {};
	Cldr._raw = {};

	// Load unresolved cldr data
	// @json [JSON]
	Cldr.loadUnresolved = function( json ) {
		if ( typeof json !== "object" ) {
			throw new Error( "invalid json" );
		}
		Cldr._raw = jsonMerge( Cldr._raw, json );
	};

	// Load resolved cldr data
	// @json [JSON]
	Cldr.load = function( json ) {
		if ( typeof json !== "object" ) {
			throw new Error( "invalid json" );
		}
		Cldr._resolved = jsonMerge( Cldr._resolved, json );
	};

	Cldr.prototype = {
		get: function( path ) {
			return itemGetResolved( Cldr, this.locale, path ) ||
				itemLookup( Cldr, this, this.locale, path );
		}
	};

	return Cldr;

});
