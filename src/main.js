define([
	"./init",
	"./item/lookup",
	"./item/get-resolved",
	"./util/object/extend"
], function( init, itemLookup, itemGetResolved, objectExtend ) {

	var Cldr = function() {
		init.apply( this, arguments );
	};

	Cldr._resolved = {};
	Cldr._raw = {};

	// Load unresolved cldr data
	// @json [JSON]
	Cldr.loadUnresolved = function( json ) {
		objectExtend( Cldr._raw, json );
	};

	// Load resolved cldr data
	// @json [JSON]
	Cldr.load = function( json ) {
		objectExtend( Cldr._resolved, json );
	};

	Cldr.prototype = {
		get: function( path ) {
			return itemGetResolved( Cldr, this.locale, path ) ||
				itemLookup( Cldr, this, this.locale, path );
		}
	};

	return Cldr;

});
