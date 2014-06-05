define([
	"../type",
	"../../../util/array/is_array"
], function( validateType, arrayIsArray ) {

	return function( value, name ) {
		validateType( value, name, typeof value === "string" || arrayIsArray( value ), "String or Array" );
	};

});
