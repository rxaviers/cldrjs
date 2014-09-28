define([
	"./array/is_array"
], function( arrayIsArray ) {

	return function( somethingOrArray ) {
		return arrayIsArray( somethingOrArray ) ?  somethingOrArray : [ somethingOrArray ];
	};

});
