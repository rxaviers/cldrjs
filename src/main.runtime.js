define([
	"./init",
	"./item/get-resolved",
	"./util/json/merge"
], function( init, itemGetResolved, jsonMerge ) {

	var Cldr = function() {
		// Inserting Cldr as first argument
		var args = [].slice.call( arguments, 0 );
		args.splice( 0, 0, Cldr );

		init.apply( this, args );
	};

	Cldr._resolved = {};

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
			return itemGetResolved( Cldr, path, this.attributes );
		}
	};

	return Cldr;

});
