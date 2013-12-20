define([
	"./main",
	"./supplemental"
], function( Cldr, supplemental ) {

	var alwaysArray,
		initSuper = Cldr.prototype.init;

	// Build optimization hack to avoid duplicating functions across modules.
	alwaysArray = Cldr._alwaysArray;

	Cldr.prototype.init = function() {
		initSuper.apply( this, arguments );
		this.supplemental = supplemental( this );
	};

	return Cldr;

});
