define([
	"./util/always-array"
], function( alwaysArray ) {

	return function( cldr ) {

		var supplemental = function( path ) {
			path = alwaysArray( path );
			return cldr.get( [ "supplemental" ].concat( path ) );
		};

		// Week Data
		// http://www.unicode.org/reports/tr35/tr35-dates.html#Week_Data
		supplemental.firstDay = function() {
			return cldr.get( "supplemental/weekData/firstDay/{territory}" ) ||
				cldr.get( "supplemental/weekData/firstDay/001" );
		};

		supplemental.minDays = function() {
			var minDays = cldr.get( "supplemental/weekData/minDays/{territory}" ) ||
				cldr.get( "supplemental/weekData/minDays/001" );
			return parseInt( minDays, 10 );
		};

		return supplemental;

	};

});
