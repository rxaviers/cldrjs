define([
	"./init",
	"./item/get-resolved",
	"./util/json/merge"
], function( init, itemGetResolved, jsonMerge ) {

	var Cldr = function() {
		init.apply( this, arguments );
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
			return itemGetResolved( Cldr, this.locale, path );
		}
	};

	return Cldr;

});
