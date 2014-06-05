define([
	"../type",
	"../../../util/is_plain_object"
], function( validateType, isPlainObject ) {

	return function( value, name ) {
		validateType( value, name, typeof value === "undefined" || isPlainObject( value ), "Plain Object" );
	};

});
