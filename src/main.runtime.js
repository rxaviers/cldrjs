define([
	"./init",
	"./item/get-resolved",
	"./util/object/extend"
], function( init, itemGetResolved, objectExtend ) {

	var Cldr = function() {
		init.apply( this, arguments );
	};

	Cldr._resolved = {};

	Cldr.loadResolved = function( json ) {
		objectExtend( Cldr._resolved, json );
	};

	Cldr.prototype = {
		get: function( path ) {
			return itemGetResolved( Cldr, this.locale, path );
		}
	};

	return Cldr;

});
