define([
	"./item/get_resolved",
	"./likely_subtags",
	"./path/normalize",
	"./remove_likely_subtags",
	"./resource/get",
	"./util/always_array",
	"./util/json/merge"
], function( itemGetResolved, likelySubtags, pathNormalize, removeLikelySubtags, resourceGet, alwaysArray, jsonMerge ) {

	var Cldr = function( locale ) {
		this.init( locale );
	};

	Cldr._resolved = {};

	// Allow user to override locale separator "-" (default) | "_". According to http://www.unicode.org/reports/tr35/#Unicode_language_identifier, both "-" and "_" are valid locale separators (eg. "en_GB", "en-GB"). According to http://unicode.org/cldr/trac/ticket/6786 its usage must be consistent throughout the data set.
	Cldr.localeSep = "-";

	// Load resolved cldr data
	// @json [JSON]
	Cldr.load = function( json ) {
		if ( typeof json !== "object" ) {
			throw new Error( "invalid json" );
		}
		Cldr._resolved = jsonMerge( Cldr._resolved, json );
	};

	// Build optimization hack to avoid duplicating functions across modules.
	Cldr._alwaysArray = alwaysArray;
	Cldr._jsonMerge = jsonMerge;
	Cldr._pathNormalize = pathNormalize;
	Cldr._resourceGet = resourceGet;

	Cldr.prototype.init = function( locale ) {
		var language, languageId, maxLanguageId, script, territory, unicodeLanguageId, variant,
			sep = Cldr.localeSep;

		if ( typeof locale !== "string" ) {
			throw new Error( "invalid locale type: \"" + JSON.stringify( locale ) + "\"" );
		}

		// Normalize locale code.
		// Get (or deduce) the "triple subtags": language, territory (also aliased as region), and script subtags.
		// Get the variant subtags (calendar, collation, currency, etc).
		// refs:
		// - http://www.unicode.org/reports/tr35/#Field_Definitions
		// - http://www.unicode.org/reports/tr35/#Language_and_Locale_IDs
		// - http://www.unicode.org/reports/tr35/#Unicode_locale_identifier

		locale = locale.replace( /-/, "_" );

		// TODO normalize unicode locale extensions. Currently, skipped.
		// unicodeLocaleExtensions = locale.split( "_u_" )[ 1 ];
		locale = locale.split( "_u_" )[ 0 ];

		// TODO normalize transformed extensions. Currently, skipped.
		// transformedExtensions = locale.split( "_t_" )[ 1 ];
		locale = locale.split( "_t_" )[ 0 ];

		unicodeLanguageId = locale;

		// unicodeLanguageId = ...
		switch ( true ) {

			// language_script_territory..
			case /^[a-z]{2,3}_[A-Z][a-z]{3}_[A-Z0-9]{2}(\b|_)/.test( unicodeLanguageId ):
				language = unicodeLanguageId.split( "_" )[ 0 ];
				script = unicodeLanguageId.split( "_" )[ 1 ];
				territory = unicodeLanguageId.split( "_" )[ 2 ];
				variant = unicodeLanguageId.split( "_" )[ 3 ];
				break;

			// language_script..
			case /^[a-z]{2,3}_[A-Z][a-z]{3}(\b|_)/.test( unicodeLanguageId ):
				language = unicodeLanguageId.split( "_" )[ 0 ];
				script = unicodeLanguageId.split( "_" )[ 1 ];
				territory = "ZZ";
				variant = unicodeLanguageId.split( "_" )[ 2 ];
				break;

			// language_territory..
			case /^[a-z]{2,3}_[A-Z0-9]{2}(\b|_)/.test( unicodeLanguageId ):
				language = unicodeLanguageId.split( "_" )[ 0 ];
				script = "Zzzz";
				territory = unicodeLanguageId.split( "_" )[ 1 ];
				variant = unicodeLanguageId.split( "_" )[ 2 ];
				break;

			// language.., or root
			case /^([a-z]{2,3}|root)(\b|_)/.test( unicodeLanguageId ):
				language = unicodeLanguageId.split( "_" )[ 0 ];
				script = "Zzzz";
				territory = "ZZ";
				variant = unicodeLanguageId.split( "_" )[ 1 ];
				break;

			default:
				language = "und";
				break;
		}

		// When a locale id does not specify a language, or territory (region), or script, they are obtained by Likely Subtags.
		maxLanguageId = likelySubtags( Cldr, this, [ language, script, territory ], { force: true } ) || unicodeLanguageId.split( "_" );
		language = maxLanguageId[ 0 ];
		script = maxLanguageId[ 1 ];
		territory  = maxLanguageId[ 2 ];

		languageId = removeLikelySubtags( Cldr, this, maxLanguageId ).join( sep );

		// Set attributes
		this.attributes = {

			// Unicode Language Id
			languageId: languageId,
			maxLanguageId: maxLanguageId.join( sep ),

			// Unicode Language Id Subtabs
			language: language,
			script: script,
			territory: territory,
			region: territory, /* alias */
			variant: variant
		};

		this.locale = variant ? [ languageId, variant ].join( sep ) : languageId;
	};

	Cldr.prototype.get = function( path ) {
		return itemGetResolved( Cldr, path, this.attributes );
	};

	Cldr.prototype.main = function( path ) {
		path = alwaysArray( path );
		return this.get( [ "main/{languageId}" ].concat( path ) );
	};

	return Cldr;

});
