define([
	"./set_available_bundles",
	"../common/validate/presence",
	"../common/validate/type/plain_object",
	"../util/always_array",
	"../util/json/merge"
], function( coreSetAvailableBundles, validatePresence, validateTypePlainObject, alwaysArray, jsonMerge ) {

	/**
	 * load( Cldr, source, jsons )
	 *
	 * @Cldr [Cldr class]
	 *
	 * @source [Object]
	 *
	 * @jsons [arguments]
	 */
	return function( Cldr, source, jsons ) {
		var i, j, json;

		validatePresence( jsons[ 0 ], "json" );

		// Support arbitrary parameters, e.g., `Cldr.load({...}, {...})`.
		for ( i = 0; i < jsons.length; i++ ) {

			// Support array parameters, e.g., `Cldr.load([{...}, {...}])`.
			json = alwaysArray( jsons[ i ] );

			for ( j = 0; j < json.length; j++ ) {
				validateTypePlainObject( json[ j ], "json" );
				source = jsonMerge( source, json[ j ] );
				coreSetAvailableBundles( Cldr, json[ j ] );
			}
		}

		return source;
	};
});
