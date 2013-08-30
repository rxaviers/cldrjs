define([
	"jquery"
], function( $ ) {

		// TODO name it .mixin?
		// TODO implement inline, drop dependency
	return function() {
		return $.extend.apply( $, arguments );
	};

});
