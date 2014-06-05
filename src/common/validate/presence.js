define([
	"../validate"
], function( validate ) {

	return function( value, name ) {
		validate( "E_MISSING_PARAMETER", typeof value !== "undefined", {
			name: name
		});
	};

});
