define(function() {

	return function( locale ) {
		// When a locale id does not specify a region, they are obtained from Likely Subtags.

		// TODO normalize locale
		this.locale = locale;
	};

});
