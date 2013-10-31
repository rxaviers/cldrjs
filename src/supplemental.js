define([
	"./util/always-array"
], function( alwaysArray ) {

	return function( cldr ) {

		var prepend, supplemental;
		
		prepend = function( prepend ) {
			return function( path ) {
				path = alwaysArray( path );
				return cldr.get( [ prepend ].concat( path ) );
			};
		};

		supplemental = prepend( "supplemental" );

		// Week Data
		// http://www.unicode.org/reports/tr35/tr35-dates.html#Week_Data
		supplemental.weekData = prepend( "supplemental/weekData" );

		supplemental.weekData.firstDay = function() {
			return cldr.get( "supplemental/weekData/firstDay/{territory}" ) ||
				cldr.get( "supplemental/weekData/firstDay/001" );
		};

		supplemental.weekData.minDays = function() {
			var minDays = cldr.get( "supplemental/weekData/minDays/{territory}" ) ||
				cldr.get( "supplemental/weekData/minDays/001" );
			return parseInt( minDays, 10 );
		};

		return supplemental;

	};

});
