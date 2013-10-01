define([
	"./init",
	"./item/lookup",
	"./item/get-resolved",
	"./util/json/merge"
], function( init, itemLookup, itemGetResolved, jsonMerge ) {

	var Cldr = function() {
		// Inserting Cldr as first argument
		var args = [].slice.call( arguments, 0 );
		args.splice( 0, 0, Cldr );

		init.apply( this, args );
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
			return itemGetResolved( Cldr, path, this.attributes ) ||
				itemLookup( Cldr, this, this.locale, path );
		}
	};

	return Cldr;

});
