/**
 * CLDR JavaScript Library v0.0.1
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright 2005, 2013 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-09-30T18:23Z
 */
(function( root, factory ) {

	if ( typeof define === "function" && define.amd ) {
		// AMD.
		define( factory );
	} else if ( typeof module === "object" && typeof module.exports === "object" ) {
		// Node. CommonJS.
		module.exports = factory();
	} else {
		// Global
		root.cldr = factory();
	}

}( this, function() {



	var init = function( locale ) {
		// When a locale id does not specify a region, they are obtained from Likely Subtags.

		// TODO normalize locale
		this.locale = locale;
	};




	// @path: normalized path
	var resourceGet = function( data, path ) {
		var i,
			node = data,
			length = path.length;

		for ( i = 0; i < length - 1; i++ ) {
			node = node[ path[ i ] ];
			if ( !node ) {
				return undefined;
			}
		}
		return node[ path[ i ] ];
	};




	var arrayIsArray = Array.isArray || function( obj ) {
		return Object.prototype.toString.call( obj ) === "[object Array]";
	};




	var pathNormalize = function( locale, path ) {
		if ( arrayIsArray( path ) ) {
			path = path.join( "/" );
		}
		if ( typeof path !== "string" ) {
			throw new Error( "invalid path \"" + path + "\"" );
		}
		// 1: Ignore leading slash `/`
		// 2: Ignore leading `cldr/`
		path = path
			.replace( /^\// , "" ) /* 1 */
			.replace( /^cldr\// , "" ) /* 2 */
			.split( "/" );

		// Supplemental
		if ( path[ 0 ] === "supplemental" ) {
			return path;
		}

		// Main, Casing, Collation, Rbnf: insert locale on path[ 1 ].
		path.splice( 1, 0, locale );

		return path;
	};




	var itemGetResolved = function( Cldr, locale, path ) {
		// Resolve path
		path = pathNormalize( locale, path );

		return resourceGet( Cldr._resolved, path );
	};




	// Returns merged JSON.
	//
	// Eg.
	// merge( { a: { b: 1, c: 2 } }, { a: { b: 3, d: 4 } } )
	// -> { a: { b: 3, d: 4 } }
	//
	// @arguments JSON's
	// 
	var jsonMerge = function() {
		var i, json,
			jsons = [];
		for ( i = 0; i < arguments.length; i++ ) {
			json = JSON.stringify( arguments[ i ] ).replace( /^{/, "" ).replace( /}$/, "" );
			if ( json ) {
				jsons.push( json );
			}
		}
		return JSON.parse( "{" + jsons.join( "," ) + "}" );
	};




	var Cldr = function() {
		init.apply( this, arguments );
	};

	Cldr._resolved = {};

	// Load resolved cldr data
	// @json [JSON]
	Cldr.load = function( json ) {
		if ( typeof json !== "object" ) {
			throw new Error( "invalid json" );
		}
		Cldr._resolved = jsonMerge( Cldr._resolved, json );
	};

	Cldr.prototype = {
		get: function( path ) {
			return itemGetResolved( Cldr, this.locale, path );
		}
	};

	return Cldr;



}));
