'use strict';

/*!
 * CLDR JavaScript Library v0.5.0 2018-09-12T19:19Z MIT license © Rafael Xavier
 * http://git.io/h4lmVg
 */

require('core-js/modules/es6.regexp.split');
require('core-js/modules/es6.regexp.match');
require('core-js/modules/es6.regexp.replace');
require('core-js/modules/web.dom.iterable');
require('core-js/modules/es6.array.iterator');
require('core-js/modules/es6.object.keys');
require('core-js/modules/es6.regexp.to-string');
require('core-js/modules/es6.function.name');

function arraySome (array, callback) {
  var i, length;

  if (array.some) {
    return array.some(callback);
  }

  for (i = 0, length = array.length; i < length; i++) {
    if (callback(array[i], i, array)) {
      return true;
    }
  }

  return false;
}

/**
 * Return the maximized language id as defined in
 * http://www.unicode.org/reports/tr35/#Likely_Subtags
 * 1. Canonicalize.
 * 1.1 Make sure the input locale is in canonical form: uses the right
 * separator, and has the right casing.
 * TODO Right casing? What df? It seems languages are lowercase, scripts are
 * Capitalized, territory is uppercase. I am leaving this as an exercise to
 * the user.
 *
 * 1.2 Replace any deprecated subtags with their canonical values using the
 * <alias> data in supplemental metadata. Use the first value in the
 * replacement list, if it exists. Language tag replacements may have multiple
 * parts, such as "sh" ➞ "sr_Latn" or mo" ➞ "ro_MD". In such a case, the
 * original script and/or region are retained if there is one. Thus
 * "sh_Arab_AQ" ➞ "sr_Arab_AQ", not "sr_Latn_AQ".
 * TODO What <alias> data?
 *
 * 1.3 If the tag is grandfathered (see <variable id="$grandfathered"
 * type="choice"> in the supplemental data), then return it.
 * TODO grandfathered?
 *
 * 1.4 Remove the script code 'Zzzz' and the region code 'ZZ' if they occur.
 * 1.5 Get the components of the cleaned-up source tag (languages, scripts,
 * and regions), plus any variants and extensions.
 * 2. Lookup. Lookup each of the following in order, and stop on the first
 * match:
 * 2.1 languages_scripts_regions
 * 2.2 languages_regions
 * 2.3 languages_scripts
 * 2.4 languages
 * 2.5 und_scripts
 * 3. Return
 * 3.1 If there is no match, either return an error value, or the match for
 * "und" (in APIs where a valid language tag is required).
 * 3.2 Otherwise there is a match = languagem_scriptm_regionm
 * 3.3 Let xr = xs if xs is not empty, and xm otherwise.
 * 3.4 Return the language tag composed of languager _ scriptr _ regionr +
 * variants + extensions.
 *
 * @subtags [Array] normalized language id subtags tuple (see init.js).
 */

function coreLikelySubtags (Cldr, cldr, subtags, options) {
  var match,
      matchFound,
      language = subtags[0],
      script = subtags[1],
      sep = Cldr.localeSep,
      territory = subtags[2],
      variants = subtags.slice(3, 4);
  options = options || {}; // Skip if (language, script, territory) is not empty [3.3]

  if (language !== "und" && script !== "Zzzz" && territory !== "ZZ") {
    return [language, script, territory].concat(variants);
  } // Skip if no supplemental likelySubtags data is present


  if (typeof cldr.get("supplemental/likelySubtags") === "undefined") {
    return;
  } // [2]


  matchFound = arraySome([[language, script, territory], [language, territory], [language, script], [language], ["und", script]], function (test) {
    return match = !/\b(Zzzz|ZZ)\b/.test(test.join(sep))
    /* [1.4] */
    && cldr.get(["supplemental/likelySubtags", test.join(sep)]);
  }); // [3]

  if (matchFound) {
    // [3.2 .. 3.4]
    match = match.split(sep);
    return [language !== "und" ? language : match[0], script !== "Zzzz" ? script : match[1], territory !== "ZZ" ? territory : match[2]].concat(variants);
  } else if (options.force) {
    // [3.1.2]
    return cldr.get("supplemental/likelySubtags/und").split(sep);
  } else {
    // [3.1.1]
    return;
  }
}

/**
 * Given a locale, remove any fields that Add Likely Subtags would add.
 * http://www.unicode.org/reports/tr35/#Likely_Subtags
 * 1. First get max = AddLikelySubtags(inputLocale). If an error is signaled,
 * return it.
 * 2. Remove the variants from max.
 * 3. Then for trial in {language, language _ region, language _ script}. If
 * AddLikelySubtags(trial) = max, then return trial + variants.
 * 4. If you do not get a match, return max + variants.
 *
 * @maxLanguageId [Array] maxLanguageId tuple (see init.js).
 */

function coreRemoveLikelySubtags (Cldr, cldr, maxLanguageId) {
  var match,
      matchFound,
      language = maxLanguageId[0],
      script = maxLanguageId[1],
      territory = maxLanguageId[2],
      variants = maxLanguageId[3]; // [3]

  matchFound = arraySome([[[language, "Zzzz", "ZZ"], [language]], [[language, "Zzzz", territory], [language, territory]], [[language, script, "ZZ"], [language, script]]], function (test) {
    var result = coreLikelySubtags(Cldr, cldr, test[0]);
    match = test[1];
    return result && result[0] === maxLanguageId[0] && result[1] === maxLanguageId[1] && result[2] === maxLanguageId[2];
  });

  if (matchFound) {
    if (variants) {
      match.push(variants);
    }

    return match;
  } // [4]


  return maxLanguageId;
}

/**
 * subtags( locale )
 *
 * @locale [String]
 */
function coreSubtags (locale) {
  var aux,
      unicodeLanguageId,
      subtags = [];
  locale = locale.replace(/_/, "-"); // Unicode locale extensions.

  aux = locale.split("-u-");

  if (aux[1]) {
    aux[1] = aux[1].split("-t-");
    locale = aux[0] + (aux[1][1] ? "-t-" + aux[1][1] : "");
    subtags[4
    /* unicodeLocaleExtensions */
    ] = aux[1][0];
  } // TODO normalize transformed extensions. Currently, skipped.
  // subtags[ x ] = locale.split( "-t-" )[ 1 ];


  unicodeLanguageId = locale.split("-t-")[0]; // unicode_language_id = "root"
  //   | unicode_language_subtag
  //     (sep unicode_script_subtag)?
  //     (sep unicode_region_subtag)?
  //     (sep unicode_variant_subtag)* ;
  //
  // Although unicode_language_subtag = alpha{2,8}, I'm using alpha{2,3}. Because, there's no language on CLDR lengthier than 3.

  aux = unicodeLanguageId.match(/^(([a-z]{2,3})(-([A-Z][a-z]{3}))?(-([A-Z]{2}|[0-9]{3}))?)((-([a-zA-Z0-9]{5,8}|[0-9][a-zA-Z0-9]{3}))*)$|^(root)$/);

  if (aux === null) {
    return ["und", "Zzzz", "ZZ"];
  }

  subtags[0
  /* language */
  ] = aux[10]
  /* root */
  || aux[2] || "und";
  subtags[1
  /* script */
  ] = aux[4] || "Zzzz";
  subtags[2
  /* territory */
  ] = aux[6] || "ZZ";

  if (aux[7] && aux[7].length) {
    subtags[3
    /* variant */
    ] = aux[7].slice(1)
    /* remove leading "-" */
    ;
  } // 0: language
  // 1: script
  // 2: territory (aka region)
  // 3: variant
  // 4: unicodeLocaleExtensions


  return subtags;
}

function arrayForEach (array, callback) {
  var i, length;

  if (array.forEach) {
    return array.forEach(callback);
  }

  for (i = 0, length = array.length; i < length; i++) {
    callback(array[i], i, array);
  }
}

/**
 * bundleLookup( minLanguageId )
 *
 * @Cldr [Cldr class]
 *
 * @cldr [Cldr instance]
 *
 * @minLanguageId [String] requested languageId after applied remove likely subtags.
 */

function bundleLookup (Cldr, cldr, minLanguageId) {
  var availableBundleMap = Cldr._availableBundleMap,
      availableBundleMapQueue = Cldr._availableBundleMapQueue;

  if (availableBundleMapQueue.length) {
    arrayForEach(availableBundleMapQueue, function (bundle) {
      var existing, maxBundle, minBundle, subtags;
      subtags = coreSubtags(bundle);
      maxBundle = coreLikelySubtags(Cldr, cldr, subtags);
      minBundle = coreRemoveLikelySubtags(Cldr, cldr, maxBundle);
      minBundle = minBundle.join(Cldr.localeSep);
      existing = availableBundleMapQueue[minBundle];

      if (existing && existing.length < bundle.length) {
        return;
      }

      availableBundleMap[minBundle] = bundle;
    });
    Cldr._availableBundleMapQueue = [];
  }

  return availableBundleMap[minLanguageId] || null;
}

function objectKeys (object) {
  var i,
      result = [];

  if (Object.keys) {
    return Object.keys(object);
  }

  for (i in object) {
    result.push(i);
  }

  return result;
}

function createError (code, attributes) {
  var error, message;
  message = code + (attributes && JSON ? ": " + JSON.stringify(attributes) : "");
  error = new Error(message);
  error.code = code; // extend( error, attributes );

  arrayForEach(objectKeys(attributes), function (attribute) {
    error[attribute] = attributes[attribute];
  });
  return error;
}

function validate (code, check, attributes) {
  if (!check) {
    throw createError(code, attributes);
  }
}

function validatePresence (value, name) {
  validate("E_MISSING_PARAMETER", typeof value !== "undefined", {
    name: name
  });
}

function validateType (value, name, check, expected) {
  validate("E_INVALID_PAR_TYPE", check, {
    expected: expected,
    name: name,
    value: value
  });
}

var arrayIsArray = Array.isArray || function (obj) {
  return Object.prototype.toString.call(obj) === "[object Array]";
};

function validateTypePath (value, name) {
  validateType(value, name, typeof value === "string" || arrayIsArray(value), "String or Array");
}

/**
 * Function inspired by jQuery Core, but reduced to our use case.
 */
function isPlainObject (obj) {
  return obj !== null && "" + obj === "[object Object]";
}

function validateTypePlainObject (value, name) {
  validateType(value, name, typeof value === "undefined" || isPlainObject(value), "Plain Object");
}

function validateTypeString (value, name) {
  validateType(value, name, typeof value === "string", "a string");
}

// @path: normalized path
function resourceGet (data, path) {
  var i,
      node = data,
      length = path.length;

  for (i = 0; i < length - 1; i++) {
    node = node[path[i]];

    if (!node) {
      return undefined;
    }
  }

  return node[path[i]];
}

/**
 * setAvailableBundles( Cldr, json )
 *
 * @Cldr [Cldr class]
 *
 * @json resolved/unresolved cldr data.
 *
 * Set available bundles queue based on passed json CLDR data. Considers a bundle as any String at /main/{bundle}.
 */

function coreSetAvailableBundles (Cldr, json) {
  var bundle,
      availableBundleMapQueue = Cldr._availableBundleMapQueue,
      main = resourceGet(json, ["main"]);

  if (main) {
    for (bundle in main) {
      if (main.hasOwnProperty(bundle) && bundle !== "root" && availableBundleMapQueue.indexOf(bundle) === -1) {
        availableBundleMapQueue.push(bundle);
      }
    }
  }
}

function alwaysArray (somethingOrArray) {
  return arrayIsArray(somethingOrArray) ? somethingOrArray : [somethingOrArray];
}

//
// Eg.
// merge( { a: { b: 1, c: 2 } }, { a: { b: 3, d: 4 } } )
// -> { a: { b: 3, c: 2, d: 4 } }
//
// @arguments JSON's
//

var merge = function merge() {
  var destination = {},
      sources = [].slice.call(arguments, 0);
  arrayForEach(sources, function (source) {
    var prop;

    for (prop in source) {
      if (prop in destination && typeof destination[prop] === "object" && !arrayIsArray(destination[prop])) {
        // Merge Objects
        destination[prop] = merge(destination[prop], source[prop]);
      } else {
        // Set new values
        destination[prop] = source[prop];
      }
    }
  });
  return destination;
};

/**
 * load( Cldr, source, jsons )
 *
 * @Cldr [Cldr class]
 *
 * @source [Object]
 *
 * @jsons [arguments]
 */

function coreLoad (Cldr, source, jsons) {
  var i, j, json;
  validatePresence(jsons[0], "json"); // Support arbitrary parameters, e.g., `Cldr.load({...}, {...})`.

  for (i = 0; i < jsons.length; i++) {
    // Support array parameters, e.g., `Cldr.load([{...}, {...}])`.
    json = alwaysArray(jsons[i]);

    for (j = 0; j < json.length; j++) {
      validateTypePlainObject(json[j], "json");
      source = merge(source, json[j]);
      coreSetAvailableBundles(Cldr, json[j]);
    }
  }

  return source;
}

function pathNormalize (path, attributes) {
  if (arrayIsArray(path)) {
    path = path.join("/");
  }

  if (typeof path !== "string") {
    throw new Error('invalid path "' + path + '"');
  } // 1: Ignore leading slash `/`
  // 2: Ignore leading `cldr/`


  path = path.replace(/^\//, "")
  /* 1 */
  .replace(/^cldr\//, "");
  /* 2 */
  // Replace {attribute}'s

  path = path.replace(/{[a-zA-Z]+}/g, function (name) {
    name = name.replace(/^{([^}]*)}$/, "$1");
    return attributes[name];
  });
  return path.split("/");
}

function itemGetResolved (Cldr, path, attributes) {
  // Resolve path
  var normalizedPath = pathNormalize(path, attributes);
  return resourceGet(Cldr._resolved, normalizedPath);
}

/**
 * new Cldr()
 */

var Cldr = function Cldr(locale) {
  this.init(locale);
}; // Build optimization hack to avoid duplicating functions across modules.


Cldr._alwaysArray = alwaysArray;
Cldr._coreLoad = coreLoad;
Cldr._createError = createError;
Cldr._itemGetResolved = itemGetResolved;
Cldr._jsonMerge = merge;
Cldr._pathNormalize = pathNormalize;
Cldr._resourceGet = resourceGet;
Cldr._validatePresence = validatePresence;
Cldr._validateType = validateType;
Cldr._validateTypePath = validateTypePath;
Cldr._validateTypePlainObject = validateTypePlainObject;
Cldr._availableBundleMap = {};
Cldr._availableBundleMapQueue = [];
Cldr._resolved = {}; // Allow user to override locale separator "-" (default) | "_". According to http://www.unicode.org/reports/tr35/#Unicode_language_identifier, both "-" and "_" are valid locale separators (eg. "en_GB", "en-GB"). According to http://unicode.org/cldr/trac/ticket/6786 its usage must be consistent throughout the data set.

Cldr.localeSep = "-";
/**
 * Cldr.load( json [, json, ...] )
 *
 * @json [JSON] CLDR data or [Array] Array of @json's.
 *
 * Load resolved cldr data.
 */

Cldr.load = function () {
  Cldr._resolved = coreLoad(Cldr, Cldr._resolved, arguments);
};
/**
 * .init() automatically run on instantiation/construction.
 */


Cldr.prototype.init = function (locale) {
  var attributes,
      language,
      maxLanguageId,
      minLanguageId,
      script,
      subtags,
      territory,
      unicodeLocaleExtensions,
      variant,
      sep = Cldr.localeSep,
      unicodeLocaleExtensionsRaw = "";
  validatePresence(locale, "locale");
  validateTypeString(locale, "locale");
  subtags = coreSubtags(locale);

  if (subtags.length === 5) {
    unicodeLocaleExtensions = subtags.pop();
    unicodeLocaleExtensionsRaw = sep + "u" + sep + unicodeLocaleExtensions; // Remove trailing null when there is unicodeLocaleExtensions but no variants.

    if (!subtags[3]) {
      subtags.pop();
    }
  }

  variant = subtags[3]; // Normalize locale code.
  // Get (or deduce) the "triple subtags": language, territory (also aliased as region), and script subtags.
  // Get the variant subtags (calendar, collation, currency, etc).
  // refs:
  // - http://www.unicode.org/reports/tr35/#Field_Definitions
  // - http://www.unicode.org/reports/tr35/#Language_and_Locale_IDs
  // - http://www.unicode.org/reports/tr35/#Unicode_locale_identifier
  // When a locale id does not specify a language, or territory (region), or script, they are obtained by Likely Subtags.

  maxLanguageId = coreLikelySubtags(Cldr, this, subtags, {
    force: true
  }) || subtags;
  language = maxLanguageId[0];
  script = maxLanguageId[1];
  territory = maxLanguageId[2];
  minLanguageId = coreRemoveLikelySubtags(Cldr, this, maxLanguageId).join(sep); // Set attributes

  this.attributes = attributes = {
    bundle: bundleLookup(Cldr, this, minLanguageId),
    // Unicode Language Id
    minLanguageId: minLanguageId + unicodeLocaleExtensionsRaw,
    maxLanguageId: maxLanguageId.join(sep) + unicodeLocaleExtensionsRaw,
    // Unicode Language Id Subtabs
    language: language,
    script: script,
    territory: territory,
    region: territory
    /* alias */
    ,
    variant: variant
  }; // Unicode locale extensions.

  unicodeLocaleExtensions && ("-" + unicodeLocaleExtensions).replace(/-[a-z]{3,8}|(-[a-z]{2})-([a-z]{3,8})/g, function (attribute, key, type) {
    if (key) {
      // Extension is in the `keyword` form.
      attributes["u" + key] = type;
    } else {
      // Extension is in the `attribute` form.
      attributes["u" + attribute] = true;
    }
  });
  this.locale = locale;
};
/**
 * .get()
 */


Cldr.prototype.get = function (path) {
  validatePresence(path, "path");
  validateTypePath(path, "path");
  return itemGetResolved(Cldr, path, this.attributes);
};
/**
 * .main()
 */


Cldr.prototype.main = function (path) {
  validatePresence(path, "path");
  validateTypePath(path, "path");
  validate("E_MISSING_BUNDLE", this.attributes.bundle !== null, {
    locale: this.locale
  });
  path = alwaysArray(path);
  return this.get(["main/{bundle}"].concat(path));
};

module.exports = Cldr;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJvd3Nlci5qcyIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3V0aWwvYXJyYXkvc29tZS5qcyIsIi4uLy4uL3NyYy9jb3JlL2xpa2VseV9zdWJ0YWdzLmpzIiwiLi4vLi4vc3JjL2NvcmUvcmVtb3ZlX2xpa2VseV9zdWJ0YWdzLmpzIiwiLi4vLi4vc3JjL2NvcmUvc3VidGFncy5qcyIsIi4uLy4uL3NyYy91dGlsL2FycmF5L2Zvcl9lYWNoLmpzIiwiLi4vLi4vc3JjL2J1bmRsZS9sb29rdXAuanMiLCIuLi8uLi9zcmMvdXRpbC9vYmplY3Qva2V5cy5qcyIsIi4uLy4uL3NyYy9jb21tb24vY3JlYXRlX2Vycm9yLmpzIiwiLi4vLi4vc3JjL2NvbW1vbi92YWxpZGF0ZS5qcyIsIi4uLy4uL3NyYy9jb21tb24vdmFsaWRhdGUvcHJlc2VuY2UuanMiLCIuLi8uLi9zcmMvY29tbW9uL3ZhbGlkYXRlL3R5cGUuanMiLCIuLi8uLi9zcmMvdXRpbC9hcnJheS9pc19hcnJheS5qcyIsIi4uLy4uL3NyYy9jb21tb24vdmFsaWRhdGUvdHlwZS9wYXRoLmpzIiwiLi4vLi4vc3JjL3V0aWwvaXNfcGxhaW5fb2JqZWN0LmpzIiwiLi4vLi4vc3JjL2NvbW1vbi92YWxpZGF0ZS90eXBlL3BsYWluX29iamVjdC5qcyIsIi4uLy4uL3NyYy9jb21tb24vdmFsaWRhdGUvdHlwZS9zdHJpbmcuanMiLCIuLi8uLi9zcmMvcmVzb3VyY2UvZ2V0LmpzIiwiLi4vLi4vc3JjL2NvcmUvc2V0X2F2YWlsYWJsZV9idW5kbGVzLmpzIiwiLi4vLi4vc3JjL3V0aWwvYWx3YXlzX2FycmF5LmpzIiwiLi4vLi4vc3JjL3V0aWwvanNvbi9tZXJnZS5qcyIsIi4uLy4uL3NyYy9jb3JlL2xvYWQuanMiLCIuLi8uLi9zcmMvcGF0aC9ub3JtYWxpemUuanMiLCIuLi8uLi9zcmMvaXRlbS9nZXRfcmVzb2x2ZWQuanMiLCIuLi8uLi9zcmMvY29yZS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbihhcnJheSwgY2FsbGJhY2spIHtcbiAgdmFyIGksIGxlbmd0aDtcbiAgaWYgKGFycmF5LnNvbWUpIHtcbiAgICByZXR1cm4gYXJyYXkuc29tZShjYWxsYmFjayk7XG4gIH1cbiAgZm9yIChpID0gMCwgbGVuZ3RoID0gYXJyYXkubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoY2FsbGJhY2soYXJyYXlbaV0sIGksIGFycmF5KSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cbiIsImltcG9ydCBhcnJheVNvbWUgZnJvbSBcIi4uL3V0aWwvYXJyYXkvc29tZVwiO1xuXG4vKipcbiAqIFJldHVybiB0aGUgbWF4aW1pemVkIGxhbmd1YWdlIGlkIGFzIGRlZmluZWQgaW5cbiAqIGh0dHA6Ly93d3cudW5pY29kZS5vcmcvcmVwb3J0cy90cjM1LyNMaWtlbHlfU3VidGFnc1xuICogMS4gQ2Fub25pY2FsaXplLlxuICogMS4xIE1ha2Ugc3VyZSB0aGUgaW5wdXQgbG9jYWxlIGlzIGluIGNhbm9uaWNhbCBmb3JtOiB1c2VzIHRoZSByaWdodFxuICogc2VwYXJhdG9yLCBhbmQgaGFzIHRoZSByaWdodCBjYXNpbmcuXG4gKiBUT0RPIFJpZ2h0IGNhc2luZz8gV2hhdCBkZj8gSXQgc2VlbXMgbGFuZ3VhZ2VzIGFyZSBsb3dlcmNhc2UsIHNjcmlwdHMgYXJlXG4gKiBDYXBpdGFsaXplZCwgdGVycml0b3J5IGlzIHVwcGVyY2FzZS4gSSBhbSBsZWF2aW5nIHRoaXMgYXMgYW4gZXhlcmNpc2UgdG9cbiAqIHRoZSB1c2VyLlxuICpcbiAqIDEuMiBSZXBsYWNlIGFueSBkZXByZWNhdGVkIHN1YnRhZ3Mgd2l0aCB0aGVpciBjYW5vbmljYWwgdmFsdWVzIHVzaW5nIHRoZVxuICogPGFsaWFzPiBkYXRhIGluIHN1cHBsZW1lbnRhbCBtZXRhZGF0YS4gVXNlIHRoZSBmaXJzdCB2YWx1ZSBpbiB0aGVcbiAqIHJlcGxhY2VtZW50IGxpc3QsIGlmIGl0IGV4aXN0cy4gTGFuZ3VhZ2UgdGFnIHJlcGxhY2VtZW50cyBtYXkgaGF2ZSBtdWx0aXBsZVxuICogcGFydHMsIHN1Y2ggYXMgXCJzaFwiIOKeniBcInNyX0xhdG5cIiBvciBtb1wiIOKeniBcInJvX01EXCIuIEluIHN1Y2ggYSBjYXNlLCB0aGVcbiAqIG9yaWdpbmFsIHNjcmlwdCBhbmQvb3IgcmVnaW9uIGFyZSByZXRhaW5lZCBpZiB0aGVyZSBpcyBvbmUuIFRodXNcbiAqIFwic2hfQXJhYl9BUVwiIOKeniBcInNyX0FyYWJfQVFcIiwgbm90IFwic3JfTGF0bl9BUVwiLlxuICogVE9ETyBXaGF0IDxhbGlhcz4gZGF0YT9cbiAqXG4gKiAxLjMgSWYgdGhlIHRhZyBpcyBncmFuZGZhdGhlcmVkIChzZWUgPHZhcmlhYmxlIGlkPVwiJGdyYW5kZmF0aGVyZWRcIlxuICogdHlwZT1cImNob2ljZVwiPiBpbiB0aGUgc3VwcGxlbWVudGFsIGRhdGEpLCB0aGVuIHJldHVybiBpdC5cbiAqIFRPRE8gZ3JhbmRmYXRoZXJlZD9cbiAqXG4gKiAxLjQgUmVtb3ZlIHRoZSBzY3JpcHQgY29kZSAnWnp6eicgYW5kIHRoZSByZWdpb24gY29kZSAnWlonIGlmIHRoZXkgb2NjdXIuXG4gKiAxLjUgR2V0IHRoZSBjb21wb25lbnRzIG9mIHRoZSBjbGVhbmVkLXVwIHNvdXJjZSB0YWcgKGxhbmd1YWdlcywgc2NyaXB0cyxcbiAqIGFuZCByZWdpb25zKSwgcGx1cyBhbnkgdmFyaWFudHMgYW5kIGV4dGVuc2lvbnMuXG4gKiAyLiBMb29rdXAuIExvb2t1cCBlYWNoIG9mIHRoZSBmb2xsb3dpbmcgaW4gb3JkZXIsIGFuZCBzdG9wIG9uIHRoZSBmaXJzdFxuICogbWF0Y2g6XG4gKiAyLjEgbGFuZ3VhZ2VzX3NjcmlwdHNfcmVnaW9uc1xuICogMi4yIGxhbmd1YWdlc19yZWdpb25zXG4gKiAyLjMgbGFuZ3VhZ2VzX3NjcmlwdHNcbiAqIDIuNCBsYW5ndWFnZXNcbiAqIDIuNSB1bmRfc2NyaXB0c1xuICogMy4gUmV0dXJuXG4gKiAzLjEgSWYgdGhlcmUgaXMgbm8gbWF0Y2gsIGVpdGhlciByZXR1cm4gYW4gZXJyb3IgdmFsdWUsIG9yIHRoZSBtYXRjaCBmb3JcbiAqIFwidW5kXCIgKGluIEFQSXMgd2hlcmUgYSB2YWxpZCBsYW5ndWFnZSB0YWcgaXMgcmVxdWlyZWQpLlxuICogMy4yIE90aGVyd2lzZSB0aGVyZSBpcyBhIG1hdGNoID0gbGFuZ3VhZ2VtX3NjcmlwdG1fcmVnaW9ubVxuICogMy4zIExldCB4ciA9IHhzIGlmIHhzIGlzIG5vdCBlbXB0eSwgYW5kIHhtIG90aGVyd2lzZS5cbiAqIDMuNCBSZXR1cm4gdGhlIGxhbmd1YWdlIHRhZyBjb21wb3NlZCBvZiBsYW5ndWFnZXIgXyBzY3JpcHRyIF8gcmVnaW9uciArXG4gKiB2YXJpYW50cyArIGV4dGVuc2lvbnMuXG4gKlxuICogQHN1YnRhZ3MgW0FycmF5XSBub3JtYWxpemVkIGxhbmd1YWdlIGlkIHN1YnRhZ3MgdHVwbGUgKHNlZSBpbml0LmpzKS5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oQ2xkciwgY2xkciwgc3VidGFncywgb3B0aW9ucykge1xuICB2YXIgbWF0Y2gsXG4gICAgbWF0Y2hGb3VuZCxcbiAgICBsYW5ndWFnZSA9IHN1YnRhZ3NbMF0sXG4gICAgc2NyaXB0ID0gc3VidGFnc1sxXSxcbiAgICBzZXAgPSBDbGRyLmxvY2FsZVNlcCxcbiAgICB0ZXJyaXRvcnkgPSBzdWJ0YWdzWzJdLFxuICAgIHZhcmlhbnRzID0gc3VidGFncy5zbGljZSgzLCA0KTtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgLy8gU2tpcCBpZiAobGFuZ3VhZ2UsIHNjcmlwdCwgdGVycml0b3J5KSBpcyBub3QgZW1wdHkgWzMuM11cbiAgaWYgKGxhbmd1YWdlICE9PSBcInVuZFwiICYmIHNjcmlwdCAhPT0gXCJaenp6XCIgJiYgdGVycml0b3J5ICE9PSBcIlpaXCIpIHtcbiAgICByZXR1cm4gW2xhbmd1YWdlLCBzY3JpcHQsIHRlcnJpdG9yeV0uY29uY2F0KHZhcmlhbnRzKTtcbiAgfVxuXG4gIC8vIFNraXAgaWYgbm8gc3VwcGxlbWVudGFsIGxpa2VseVN1YnRhZ3MgZGF0YSBpcyBwcmVzZW50XG4gIGlmICh0eXBlb2YgY2xkci5nZXQoXCJzdXBwbGVtZW50YWwvbGlrZWx5U3VidGFnc1wiKSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIFsyXVxuICBtYXRjaEZvdW5kID0gYXJyYXlTb21lKFxuICAgIFtcbiAgICAgIFtsYW5ndWFnZSwgc2NyaXB0LCB0ZXJyaXRvcnldLFxuICAgICAgW2xhbmd1YWdlLCB0ZXJyaXRvcnldLFxuICAgICAgW2xhbmd1YWdlLCBzY3JpcHRdLFxuICAgICAgW2xhbmd1YWdlXSxcbiAgICAgIFtcInVuZFwiLCBzY3JpcHRdXG4gICAgXSxcbiAgICBmdW5jdGlvbih0ZXN0KSB7XG4gICAgICByZXR1cm4gKG1hdGNoID1cbiAgICAgICAgIS9cXGIoWnp6enxaWilcXGIvLnRlc3QodGVzdC5qb2luKHNlcCkpIC8qIFsxLjRdICovICYmXG4gICAgICAgIGNsZHIuZ2V0KFtcInN1cHBsZW1lbnRhbC9saWtlbHlTdWJ0YWdzXCIsIHRlc3Quam9pbihzZXApXSkpO1xuICAgIH1cbiAgKTtcblxuICAvLyBbM11cbiAgaWYgKG1hdGNoRm91bmQpIHtcbiAgICAvLyBbMy4yIC4uIDMuNF1cbiAgICBtYXRjaCA9IG1hdGNoLnNwbGl0KHNlcCk7XG4gICAgcmV0dXJuIFtcbiAgICAgIGxhbmd1YWdlICE9PSBcInVuZFwiID8gbGFuZ3VhZ2UgOiBtYXRjaFswXSxcbiAgICAgIHNjcmlwdCAhPT0gXCJaenp6XCIgPyBzY3JpcHQgOiBtYXRjaFsxXSxcbiAgICAgIHRlcnJpdG9yeSAhPT0gXCJaWlwiID8gdGVycml0b3J5IDogbWF0Y2hbMl1cbiAgICBdLmNvbmNhdCh2YXJpYW50cyk7XG4gIH0gZWxzZSBpZiAob3B0aW9ucy5mb3JjZSkge1xuICAgIC8vIFszLjEuMl1cbiAgICByZXR1cm4gY2xkci5nZXQoXCJzdXBwbGVtZW50YWwvbGlrZWx5U3VidGFncy91bmRcIikuc3BsaXQoc2VwKTtcbiAgfSBlbHNlIHtcbiAgICAvLyBbMy4xLjFdXG4gICAgcmV0dXJuO1xuICB9XG59XG4iLCJpbXBvcnQgY29yZUxpa2VseVN1YnRhZ3MgZnJvbSBcIi4vbGlrZWx5X3N1YnRhZ3NcIjtcbmltcG9ydCBhcnJheVNvbWUgZnJvbSBcIi4uL3V0aWwvYXJyYXkvc29tZVwiO1xuXG4vKipcbiAqIEdpdmVuIGEgbG9jYWxlLCByZW1vdmUgYW55IGZpZWxkcyB0aGF0IEFkZCBMaWtlbHkgU3VidGFncyB3b3VsZCBhZGQuXG4gKiBodHRwOi8vd3d3LnVuaWNvZGUub3JnL3JlcG9ydHMvdHIzNS8jTGlrZWx5X1N1YnRhZ3NcbiAqIDEuIEZpcnN0IGdldCBtYXggPSBBZGRMaWtlbHlTdWJ0YWdzKGlucHV0TG9jYWxlKS4gSWYgYW4gZXJyb3IgaXMgc2lnbmFsZWQsXG4gKiByZXR1cm4gaXQuXG4gKiAyLiBSZW1vdmUgdGhlIHZhcmlhbnRzIGZyb20gbWF4LlxuICogMy4gVGhlbiBmb3IgdHJpYWwgaW4ge2xhbmd1YWdlLCBsYW5ndWFnZSBfIHJlZ2lvbiwgbGFuZ3VhZ2UgXyBzY3JpcHR9LiBJZlxuICogQWRkTGlrZWx5U3VidGFncyh0cmlhbCkgPSBtYXgsIHRoZW4gcmV0dXJuIHRyaWFsICsgdmFyaWFudHMuXG4gKiA0LiBJZiB5b3UgZG8gbm90IGdldCBhIG1hdGNoLCByZXR1cm4gbWF4ICsgdmFyaWFudHMuXG4gKlxuICogQG1heExhbmd1YWdlSWQgW0FycmF5XSBtYXhMYW5ndWFnZUlkIHR1cGxlIChzZWUgaW5pdC5qcykuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKENsZHIsIGNsZHIsIG1heExhbmd1YWdlSWQpIHtcbiAgdmFyIG1hdGNoLFxuICAgIG1hdGNoRm91bmQsXG4gICAgbGFuZ3VhZ2UgPSBtYXhMYW5ndWFnZUlkWzBdLFxuICAgIHNjcmlwdCA9IG1heExhbmd1YWdlSWRbMV0sXG4gICAgdGVycml0b3J5ID0gbWF4TGFuZ3VhZ2VJZFsyXSxcbiAgICB2YXJpYW50cyA9IG1heExhbmd1YWdlSWRbM107XG5cbiAgLy8gWzNdXG4gIG1hdGNoRm91bmQgPSBhcnJheVNvbWUoXG4gICAgW1xuICAgICAgW1tsYW5ndWFnZSwgXCJaenp6XCIsIFwiWlpcIl0sIFtsYW5ndWFnZV1dLFxuICAgICAgW1tsYW5ndWFnZSwgXCJaenp6XCIsIHRlcnJpdG9yeV0sIFtsYW5ndWFnZSwgdGVycml0b3J5XV0sXG4gICAgICBbW2xhbmd1YWdlLCBzY3JpcHQsIFwiWlpcIl0sIFtsYW5ndWFnZSwgc2NyaXB0XV1cbiAgICBdLFxuICAgIGZ1bmN0aW9uKHRlc3QpIHtcbiAgICAgIHZhciByZXN1bHQgPSBjb3JlTGlrZWx5U3VidGFncyhDbGRyLCBjbGRyLCB0ZXN0WzBdKTtcbiAgICAgIG1hdGNoID0gdGVzdFsxXTtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIHJlc3VsdCAmJlxuICAgICAgICByZXN1bHRbMF0gPT09IG1heExhbmd1YWdlSWRbMF0gJiZcbiAgICAgICAgcmVzdWx0WzFdID09PSBtYXhMYW5ndWFnZUlkWzFdICYmXG4gICAgICAgIHJlc3VsdFsyXSA9PT0gbWF4TGFuZ3VhZ2VJZFsyXVxuICAgICAgKTtcbiAgICB9XG4gICk7XG5cbiAgaWYgKG1hdGNoRm91bmQpIHtcbiAgICBpZiAodmFyaWFudHMpIHtcbiAgICAgIG1hdGNoLnB1c2godmFyaWFudHMpO1xuICAgIH1cbiAgICByZXR1cm4gbWF0Y2g7XG4gIH1cblxuICAvLyBbNF1cbiAgcmV0dXJuIG1heExhbmd1YWdlSWQ7XG59XG4iLCIvKipcbiAqIHN1YnRhZ3MoIGxvY2FsZSApXG4gKlxuICogQGxvY2FsZSBbU3RyaW5nXVxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihsb2NhbGUpIHtcbiAgdmFyIGF1eCxcbiAgICB1bmljb2RlTGFuZ3VhZ2VJZCxcbiAgICBzdWJ0YWdzID0gW107XG5cbiAgbG9jYWxlID0gbG9jYWxlLnJlcGxhY2UoL18vLCBcIi1cIik7XG5cbiAgLy8gVW5pY29kZSBsb2NhbGUgZXh0ZW5zaW9ucy5cbiAgYXV4ID0gbG9jYWxlLnNwbGl0KFwiLXUtXCIpO1xuICBpZiAoYXV4WzFdKSB7XG4gICAgYXV4WzFdID0gYXV4WzFdLnNwbGl0KFwiLXQtXCIpO1xuICAgIGxvY2FsZSA9IGF1eFswXSArIChhdXhbMV1bMV0gPyBcIi10LVwiICsgYXV4WzFdWzFdIDogXCJcIik7XG4gICAgc3VidGFnc1s0IC8qIHVuaWNvZGVMb2NhbGVFeHRlbnNpb25zICovXSA9IGF1eFsxXVswXTtcbiAgfVxuXG4gIC8vIFRPRE8gbm9ybWFsaXplIHRyYW5zZm9ybWVkIGV4dGVuc2lvbnMuIEN1cnJlbnRseSwgc2tpcHBlZC5cbiAgLy8gc3VidGFnc1sgeCBdID0gbG9jYWxlLnNwbGl0KCBcIi10LVwiIClbIDEgXTtcbiAgdW5pY29kZUxhbmd1YWdlSWQgPSBsb2NhbGUuc3BsaXQoXCItdC1cIilbMF07XG5cbiAgLy8gdW5pY29kZV9sYW5ndWFnZV9pZCA9IFwicm9vdFwiXG4gIC8vICAgfCB1bmljb2RlX2xhbmd1YWdlX3N1YnRhZ1xuICAvLyAgICAgKHNlcCB1bmljb2RlX3NjcmlwdF9zdWJ0YWcpP1xuICAvLyAgICAgKHNlcCB1bmljb2RlX3JlZ2lvbl9zdWJ0YWcpP1xuICAvLyAgICAgKHNlcCB1bmljb2RlX3ZhcmlhbnRfc3VidGFnKSogO1xuICAvL1xuICAvLyBBbHRob3VnaCB1bmljb2RlX2xhbmd1YWdlX3N1YnRhZyA9IGFscGhhezIsOH0sIEknbSB1c2luZyBhbHBoYXsyLDN9LiBCZWNhdXNlLCB0aGVyZSdzIG5vIGxhbmd1YWdlIG9uIENMRFIgbGVuZ3RoaWVyIHRoYW4gMy5cbiAgYXV4ID0gdW5pY29kZUxhbmd1YWdlSWQubWF0Y2goXG4gICAgL14oKFthLXpdezIsM30pKC0oW0EtWl1bYS16XXszfSkpPygtKFtBLVpdezJ9fFswLTldezN9KSk/KSgoLShbYS16QS1aMC05XXs1LDh9fFswLTldW2EtekEtWjAtOV17M30pKSopJHxeKHJvb3QpJC9cbiAgKTtcbiAgaWYgKGF1eCA9PT0gbnVsbCkge1xuICAgIHJldHVybiBbXCJ1bmRcIiwgXCJaenp6XCIsIFwiWlpcIl07XG4gIH1cbiAgc3VidGFnc1swIC8qIGxhbmd1YWdlICovXSA9IGF1eFsxMF0gLyogcm9vdCAqLyB8fCBhdXhbMl0gfHwgXCJ1bmRcIjtcbiAgc3VidGFnc1sxIC8qIHNjcmlwdCAqL10gPSBhdXhbNF0gfHwgXCJaenp6XCI7XG4gIHN1YnRhZ3NbMiAvKiB0ZXJyaXRvcnkgKi9dID0gYXV4WzZdIHx8IFwiWlpcIjtcbiAgaWYgKGF1eFs3XSAmJiBhdXhbN10ubGVuZ3RoKSB7XG4gICAgc3VidGFnc1szIC8qIHZhcmlhbnQgKi9dID0gYXV4WzddLnNsaWNlKDEpIC8qIHJlbW92ZSBsZWFkaW5nIFwiLVwiICovO1xuICB9XG5cbiAgLy8gMDogbGFuZ3VhZ2VcbiAgLy8gMTogc2NyaXB0XG4gIC8vIDI6IHRlcnJpdG9yeSAoYWthIHJlZ2lvbilcbiAgLy8gMzogdmFyaWFudFxuICAvLyA0OiB1bmljb2RlTG9jYWxlRXh0ZW5zaW9uc1xuICByZXR1cm4gc3VidGFncztcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKGFycmF5LCBjYWxsYmFjaykge1xuICB2YXIgaSwgbGVuZ3RoO1xuICBpZiAoYXJyYXkuZm9yRWFjaCkge1xuICAgIHJldHVybiBhcnJheS5mb3JFYWNoKGNhbGxiYWNrKTtcbiAgfVxuICBmb3IgKGkgPSAwLCBsZW5ndGggPSBhcnJheS5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgIGNhbGxiYWNrKGFycmF5W2ldLCBpLCBhcnJheSk7XG4gIH1cbn1cbiIsImltcG9ydCBjb3JlTGlrZWx5U3VidGFncyBmcm9tIFwiLi4vY29yZS9saWtlbHlfc3VidGFnc1wiO1xuaW1wb3J0IGNvcmVSZW1vdmVMaWtlbHlTdWJ0YWdzIGZyb20gXCIuLi9jb3JlL3JlbW92ZV9saWtlbHlfc3VidGFnc1wiO1xuaW1wb3J0IGNvcmVTdWJ0YWdzIGZyb20gXCIuLi9jb3JlL3N1YnRhZ3NcIjtcbmltcG9ydCBhcnJheUZvckVhY2ggZnJvbSBcIi4uL3V0aWwvYXJyYXkvZm9yX2VhY2hcIjtcblxuLyoqXG4gKiBidW5kbGVMb29rdXAoIG1pbkxhbmd1YWdlSWQgKVxuICpcbiAqIEBDbGRyIFtDbGRyIGNsYXNzXVxuICpcbiAqIEBjbGRyIFtDbGRyIGluc3RhbmNlXVxuICpcbiAqIEBtaW5MYW5ndWFnZUlkIFtTdHJpbmddIHJlcXVlc3RlZCBsYW5ndWFnZUlkIGFmdGVyIGFwcGxpZWQgcmVtb3ZlIGxpa2VseSBzdWJ0YWdzLlxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihDbGRyLCBjbGRyLCBtaW5MYW5ndWFnZUlkKSB7XG4gIHZhciBhdmFpbGFibGVCdW5kbGVNYXAgPSBDbGRyLl9hdmFpbGFibGVCdW5kbGVNYXAsXG4gICAgYXZhaWxhYmxlQnVuZGxlTWFwUXVldWUgPSBDbGRyLl9hdmFpbGFibGVCdW5kbGVNYXBRdWV1ZTtcblxuICBpZiAoYXZhaWxhYmxlQnVuZGxlTWFwUXVldWUubGVuZ3RoKSB7XG4gICAgYXJyYXlGb3JFYWNoKGF2YWlsYWJsZUJ1bmRsZU1hcFF1ZXVlLCBmdW5jdGlvbihidW5kbGUpIHtcbiAgICAgIHZhciBleGlzdGluZywgbWF4QnVuZGxlLCBtaW5CdW5kbGUsIHN1YnRhZ3M7XG4gICAgICBzdWJ0YWdzID0gY29yZVN1YnRhZ3MoYnVuZGxlKTtcbiAgICAgIG1heEJ1bmRsZSA9IGNvcmVMaWtlbHlTdWJ0YWdzKENsZHIsIGNsZHIsIHN1YnRhZ3MpO1xuICAgICAgbWluQnVuZGxlID0gY29yZVJlbW92ZUxpa2VseVN1YnRhZ3MoQ2xkciwgY2xkciwgbWF4QnVuZGxlKTtcbiAgICAgIG1pbkJ1bmRsZSA9IG1pbkJ1bmRsZS5qb2luKENsZHIubG9jYWxlU2VwKTtcbiAgICAgIGV4aXN0aW5nID0gYXZhaWxhYmxlQnVuZGxlTWFwUXVldWVbbWluQnVuZGxlXTtcbiAgICAgIGlmIChleGlzdGluZyAmJiBleGlzdGluZy5sZW5ndGggPCBidW5kbGUubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGF2YWlsYWJsZUJ1bmRsZU1hcFttaW5CdW5kbGVdID0gYnVuZGxlO1xuICAgIH0pO1xuICAgIENsZHIuX2F2YWlsYWJsZUJ1bmRsZU1hcFF1ZXVlID0gW107XG4gIH1cblxuICByZXR1cm4gYXZhaWxhYmxlQnVuZGxlTWFwW21pbkxhbmd1YWdlSWRdIHx8IG51bGw7XG59XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbihvYmplY3QpIHtcbiAgdmFyIGksXG4gICAgcmVzdWx0ID0gW107XG5cbiAgaWYgKE9iamVjdC5rZXlzKSB7XG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKG9iamVjdCk7XG4gIH1cblxuICBmb3IgKGkgaW4gb2JqZWN0KSB7XG4gICAgcmVzdWx0LnB1c2goaSk7XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufVxuIiwiaW1wb3J0IGFycmF5Rm9yRWFjaCBmcm9tIFwiLi4vdXRpbC9hcnJheS9mb3JfZWFjaFwiO1xuaW1wb3J0IG9iamVjdEtleXMgZnJvbSBcIi4uL3V0aWwvb2JqZWN0L2tleXNcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oY29kZSwgYXR0cmlidXRlcykge1xuICB2YXIgZXJyb3IsIG1lc3NhZ2U7XG5cbiAgbWVzc2FnZSA9XG4gICAgY29kZSArIChhdHRyaWJ1dGVzICYmIEpTT04gPyBcIjogXCIgKyBKU09OLnN0cmluZ2lmeShhdHRyaWJ1dGVzKSA6IFwiXCIpO1xuICBlcnJvciA9IG5ldyBFcnJvcihtZXNzYWdlKTtcbiAgZXJyb3IuY29kZSA9IGNvZGU7XG5cbiAgLy8gZXh0ZW5kKCBlcnJvciwgYXR0cmlidXRlcyApO1xuICBhcnJheUZvckVhY2gob2JqZWN0S2V5cyhhdHRyaWJ1dGVzKSwgZnVuY3Rpb24oYXR0cmlidXRlKSB7XG4gICAgZXJyb3JbYXR0cmlidXRlXSA9IGF0dHJpYnV0ZXNbYXR0cmlidXRlXTtcbiAgfSk7XG5cbiAgcmV0dXJuIGVycm9yO1xufVxuIiwiaW1wb3J0IGNyZWF0ZUVycm9yIGZyb20gXCIuL2NyZWF0ZV9lcnJvclwiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihjb2RlLCBjaGVjaywgYXR0cmlidXRlcykge1xuICBpZiAoIWNoZWNrKSB7XG4gICAgdGhyb3cgY3JlYXRlRXJyb3IoY29kZSwgYXR0cmlidXRlcyk7XG4gIH1cbn1cbiIsImltcG9ydCB2YWxpZGF0ZSBmcm9tIFwiLi4vdmFsaWRhdGVcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24odmFsdWUsIG5hbWUpIHtcbiAgdmFsaWRhdGUoXCJFX01JU1NJTkdfUEFSQU1FVEVSXCIsIHR5cGVvZiB2YWx1ZSAhPT0gXCJ1bmRlZmluZWRcIiwge1xuICAgIG5hbWU6IG5hbWVcbiAgfSk7XG59XG4iLCJpbXBvcnQgdmFsaWRhdGUgZnJvbSBcIi4uL3ZhbGlkYXRlXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHZhbHVlLCBuYW1lLCBjaGVjaywgZXhwZWN0ZWQpIHtcbiAgdmFsaWRhdGUoXCJFX0lOVkFMSURfUEFSX1RZUEVcIiwgY2hlY2ssIHtcbiAgICBleHBlY3RlZDogZXhwZWN0ZWQsXG4gICAgbmFtZTogbmFtZSxcbiAgICB2YWx1ZTogdmFsdWVcbiAgfSk7XG59XG4iLCJleHBvcnQgZGVmYXVsdCBBcnJheS5pc0FycmF5IHx8XG4gIGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqKSA9PT0gXCJbb2JqZWN0IEFycmF5XVwiO1xuICB9O1xuIiwiaW1wb3J0IHZhbGlkYXRlVHlwZSBmcm9tIFwiLi4vdHlwZVwiO1xuaW1wb3J0IGFycmF5SXNBcnJheSBmcm9tIFwiLi4vLi4vLi4vdXRpbC9hcnJheS9pc19hcnJheVwiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbih2YWx1ZSwgbmFtZSkge1xuICB2YWxpZGF0ZVR5cGUoXG4gICAgdmFsdWUsXG4gICAgbmFtZSxcbiAgICB0eXBlb2YgdmFsdWUgPT09IFwic3RyaW5nXCIgfHwgYXJyYXlJc0FycmF5KHZhbHVlKSxcbiAgICBcIlN0cmluZyBvciBBcnJheVwiXG4gICk7XG59XG4iLCIvKipcbiAqIEZ1bmN0aW9uIGluc3BpcmVkIGJ5IGpRdWVyeSBDb3JlLCBidXQgcmVkdWNlZCB0byBvdXIgdXNlIGNhc2UuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKG9iaikge1xuICByZXR1cm4gb2JqICE9PSBudWxsICYmIFwiXCIgKyBvYmogPT09IFwiW29iamVjdCBPYmplY3RdXCI7XG59XG4iLCJpbXBvcnQgdmFsaWRhdGVUeXBlIGZyb20gXCIuLi90eXBlXCI7XG5pbXBvcnQgaXNQbGFpbk9iamVjdCBmcm9tIFwiLi4vLi4vLi4vdXRpbC9pc19wbGFpbl9vYmplY3RcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24odmFsdWUsIG5hbWUpIHtcbiAgdmFsaWRhdGVUeXBlKFxuICAgIHZhbHVlLFxuICAgIG5hbWUsXG4gICAgdHlwZW9mIHZhbHVlID09PSBcInVuZGVmaW5lZFwiIHx8IGlzUGxhaW5PYmplY3QodmFsdWUpLFxuICAgIFwiUGxhaW4gT2JqZWN0XCJcbiAgKTtcbn1cbiIsImltcG9ydCB2YWxpZGF0ZVR5cGUgZnJvbSBcIi4uL3R5cGVcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24odmFsdWUsIG5hbWUpIHtcbiAgdmFsaWRhdGVUeXBlKHZhbHVlLCBuYW1lLCB0eXBlb2YgdmFsdWUgPT09IFwic3RyaW5nXCIsIFwiYSBzdHJpbmdcIik7XG59XG4iLCIvLyBAcGF0aDogbm9ybWFsaXplZCBwYXRoXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihkYXRhLCBwYXRoKSB7XG4gIHZhciBpLFxuICAgIG5vZGUgPSBkYXRhLFxuICAgIGxlbmd0aCA9IHBhdGgubGVuZ3RoO1xuXG4gIGZvciAoaSA9IDA7IGkgPCBsZW5ndGggLSAxOyBpKyspIHtcbiAgICBub2RlID0gbm9kZVtwYXRoW2ldXTtcbiAgICBpZiAoIW5vZGUpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICB9XG4gIHJldHVybiBub2RlW3BhdGhbaV1dO1xufVxuIiwiaW1wb3J0IHJlc291cmNlR2V0IGZyb20gXCIuLi9yZXNvdXJjZS9nZXRcIjtcblxuLyoqXG4gKiBzZXRBdmFpbGFibGVCdW5kbGVzKCBDbGRyLCBqc29uIClcbiAqXG4gKiBAQ2xkciBbQ2xkciBjbGFzc11cbiAqXG4gKiBAanNvbiByZXNvbHZlZC91bnJlc29sdmVkIGNsZHIgZGF0YS5cbiAqXG4gKiBTZXQgYXZhaWxhYmxlIGJ1bmRsZXMgcXVldWUgYmFzZWQgb24gcGFzc2VkIGpzb24gQ0xEUiBkYXRhLiBDb25zaWRlcnMgYSBidW5kbGUgYXMgYW55IFN0cmluZyBhdCAvbWFpbi97YnVuZGxlfS5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oQ2xkciwganNvbikge1xuICB2YXIgYnVuZGxlLFxuICAgIGF2YWlsYWJsZUJ1bmRsZU1hcFF1ZXVlID0gQ2xkci5fYXZhaWxhYmxlQnVuZGxlTWFwUXVldWUsXG4gICAgbWFpbiA9IHJlc291cmNlR2V0KGpzb24sIFtcIm1haW5cIl0pO1xuXG4gIGlmIChtYWluKSB7XG4gICAgZm9yIChidW5kbGUgaW4gbWFpbikge1xuICAgICAgaWYgKFxuICAgICAgICBtYWluLmhhc093blByb3BlcnR5KGJ1bmRsZSkgJiZcbiAgICAgICAgYnVuZGxlICE9PSBcInJvb3RcIiAmJlxuICAgICAgICBhdmFpbGFibGVCdW5kbGVNYXBRdWV1ZS5pbmRleE9mKGJ1bmRsZSkgPT09IC0xXG4gICAgICApIHtcbiAgICAgICAgYXZhaWxhYmxlQnVuZGxlTWFwUXVldWUucHVzaChidW5kbGUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuIiwiaW1wb3J0IGFycmF5SXNBcnJheSBmcm9tIFwiLi9hcnJheS9pc19hcnJheVwiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihzb21ldGhpbmdPckFycmF5KSB7XG4gIHJldHVybiBhcnJheUlzQXJyYXkoc29tZXRoaW5nT3JBcnJheSkgPyBzb21ldGhpbmdPckFycmF5IDogW3NvbWV0aGluZ09yQXJyYXldO1xufVxuIiwiaW1wb3J0IGFycmF5Rm9yRWFjaCBmcm9tIFwiLi4vYXJyYXkvZm9yX2VhY2hcIjtcbmltcG9ydCBhcnJheUlzQXJyYXkgZnJvbSBcIi4uL2FycmF5L2lzX2FycmF5XCI7XG5cbi8vIFJldHVybnMgbmV3IGRlZXBseSBtZXJnZWQgSlNPTi5cbi8vXG4vLyBFZy5cbi8vIG1lcmdlKCB7IGE6IHsgYjogMSwgYzogMiB9IH0sIHsgYTogeyBiOiAzLCBkOiA0IH0gfSApXG4vLyAtPiB7IGE6IHsgYjogMywgYzogMiwgZDogNCB9IH1cbi8vXG4vLyBAYXJndW1lbnRzIEpTT04nc1xuLy9cbnZhciBtZXJnZSA9IGZ1bmN0aW9uKCkge1xuICB2YXIgZGVzdGluYXRpb24gPSB7fSxcbiAgICBzb3VyY2VzID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDApO1xuICBhcnJheUZvckVhY2goc291cmNlcywgZnVuY3Rpb24oc291cmNlKSB7XG4gICAgdmFyIHByb3A7XG4gICAgZm9yIChwcm9wIGluIHNvdXJjZSkge1xuICAgICAgaWYgKFxuICAgICAgICBwcm9wIGluIGRlc3RpbmF0aW9uICYmXG4gICAgICAgIHR5cGVvZiBkZXN0aW5hdGlvbltwcm9wXSA9PT0gXCJvYmplY3RcIiAmJlxuICAgICAgICAhYXJyYXlJc0FycmF5KGRlc3RpbmF0aW9uW3Byb3BdKVxuICAgICAgKSB7XG4gICAgICAgIC8vIE1lcmdlIE9iamVjdHNcbiAgICAgICAgZGVzdGluYXRpb25bcHJvcF0gPSBtZXJnZShkZXN0aW5hdGlvbltwcm9wXSwgc291cmNlW3Byb3BdKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIFNldCBuZXcgdmFsdWVzXG4gICAgICAgIGRlc3RpbmF0aW9uW3Byb3BdID0gc291cmNlW3Byb3BdO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIHJldHVybiBkZXN0aW5hdGlvbjtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IG1lcmdlO1xuIiwiaW1wb3J0IGNvcmVTZXRBdmFpbGFibGVCdW5kbGVzIGZyb20gXCIuL3NldF9hdmFpbGFibGVfYnVuZGxlc1wiO1xuaW1wb3J0IHZhbGlkYXRlUHJlc2VuY2UgZnJvbSBcIi4uL2NvbW1vbi92YWxpZGF0ZS9wcmVzZW5jZVwiO1xuaW1wb3J0IHZhbGlkYXRlVHlwZVBsYWluT2JqZWN0IGZyb20gXCIuLi9jb21tb24vdmFsaWRhdGUvdHlwZS9wbGFpbl9vYmplY3RcIjtcbmltcG9ydCBhbHdheXNBcnJheSBmcm9tIFwiLi4vdXRpbC9hbHdheXNfYXJyYXlcIjtcbmltcG9ydCBqc29uTWVyZ2UgZnJvbSBcIi4uL3V0aWwvanNvbi9tZXJnZVwiO1xuXG4vKipcbiAqIGxvYWQoIENsZHIsIHNvdXJjZSwganNvbnMgKVxuICpcbiAqIEBDbGRyIFtDbGRyIGNsYXNzXVxuICpcbiAqIEBzb3VyY2UgW09iamVjdF1cbiAqXG4gKiBAanNvbnMgW2FyZ3VtZW50c11cbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oQ2xkciwgc291cmNlLCBqc29ucykge1xuICB2YXIgaSwgaiwganNvbjtcblxuICB2YWxpZGF0ZVByZXNlbmNlKGpzb25zWzBdLCBcImpzb25cIik7XG5cbiAgLy8gU3VwcG9ydCBhcmJpdHJhcnkgcGFyYW1ldGVycywgZS5nLiwgYENsZHIubG9hZCh7Li4ufSwgey4uLn0pYC5cbiAgZm9yIChpID0gMDsgaSA8IGpzb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgLy8gU3VwcG9ydCBhcnJheSBwYXJhbWV0ZXJzLCBlLmcuLCBgQ2xkci5sb2FkKFt7Li4ufSwgey4uLn1dKWAuXG4gICAganNvbiA9IGFsd2F5c0FycmF5KGpzb25zW2ldKTtcblxuICAgIGZvciAoaiA9IDA7IGogPCBqc29uLmxlbmd0aDsgaisrKSB7XG4gICAgICB2YWxpZGF0ZVR5cGVQbGFpbk9iamVjdChqc29uW2pdLCBcImpzb25cIik7XG4gICAgICBzb3VyY2UgPSBqc29uTWVyZ2Uoc291cmNlLCBqc29uW2pdKTtcbiAgICAgIGNvcmVTZXRBdmFpbGFibGVCdW5kbGVzKENsZHIsIGpzb25bal0pO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBzb3VyY2U7XG59XG4iLCJpbXBvcnQgYXJyYXlJc0FycmF5IGZyb20gXCIuLi91dGlsL2FycmF5L2lzX2FycmF5XCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHBhdGgsIGF0dHJpYnV0ZXMpIHtcbiAgaWYgKGFycmF5SXNBcnJheShwYXRoKSkge1xuICAgIHBhdGggPSBwYXRoLmpvaW4oXCIvXCIpO1xuICB9XG4gIGlmICh0eXBlb2YgcGF0aCAhPT0gXCJzdHJpbmdcIikge1xuICAgIHRocm93IG5ldyBFcnJvcignaW52YWxpZCBwYXRoIFwiJyArIHBhdGggKyAnXCInKTtcbiAgfVxuICAvLyAxOiBJZ25vcmUgbGVhZGluZyBzbGFzaCBgL2BcbiAgLy8gMjogSWdub3JlIGxlYWRpbmcgYGNsZHIvYFxuICBwYXRoID0gcGF0aC5yZXBsYWNlKC9eXFwvLywgXCJcIikgLyogMSAqLy5yZXBsYWNlKC9eY2xkclxcLy8sIFwiXCIpOyAvKiAyICovXG5cbiAgLy8gUmVwbGFjZSB7YXR0cmlidXRlfSdzXG4gIHBhdGggPSBwYXRoLnJlcGxhY2UoL3tbYS16QS1aXSt9L2csIGZ1bmN0aW9uKG5hbWUpIHtcbiAgICBuYW1lID0gbmFtZS5yZXBsYWNlKC9eeyhbXn1dKil9JC8sIFwiJDFcIik7XG4gICAgcmV0dXJuIGF0dHJpYnV0ZXNbbmFtZV07XG4gIH0pO1xuXG4gIHJldHVybiBwYXRoLnNwbGl0KFwiL1wiKTtcbn1cbiIsImltcG9ydCByZXNvdXJjZUdldCBmcm9tIFwiLi4vcmVzb3VyY2UvZ2V0XCI7XG5pbXBvcnQgcGF0aE5vcm1hbGl6ZSBmcm9tIFwiLi4vcGF0aC9ub3JtYWxpemVcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oQ2xkciwgcGF0aCwgYXR0cmlidXRlcykge1xuICAvLyBSZXNvbHZlIHBhdGhcbiAgdmFyIG5vcm1hbGl6ZWRQYXRoID0gcGF0aE5vcm1hbGl6ZShwYXRoLCBhdHRyaWJ1dGVzKTtcblxuICByZXR1cm4gcmVzb3VyY2VHZXQoQ2xkci5fcmVzb2x2ZWQsIG5vcm1hbGl6ZWRQYXRoKTtcbn1cbiIsImltcG9ydCBidW5kbGVMb29rdXAgZnJvbSBcIi4vYnVuZGxlL2xvb2t1cFwiO1xuaW1wb3J0IGNyZWF0ZUVycm9yIGZyb20gXCIuL2NvbW1vbi9jcmVhdGVfZXJyb3JcIjtcbmltcG9ydCB2YWxpZGF0ZSBmcm9tIFwiLi9jb21tb24vdmFsaWRhdGVcIjtcbmltcG9ydCB2YWxpZGF0ZVByZXNlbmNlIGZyb20gXCIuL2NvbW1vbi92YWxpZGF0ZS9wcmVzZW5jZVwiO1xuaW1wb3J0IHZhbGlkYXRlVHlwZSBmcm9tIFwiLi9jb21tb24vdmFsaWRhdGUvdHlwZVwiO1xuaW1wb3J0IHZhbGlkYXRlVHlwZVBhdGggZnJvbSBcIi4vY29tbW9uL3ZhbGlkYXRlL3R5cGUvcGF0aFwiO1xuaW1wb3J0IHZhbGlkYXRlVHlwZVBsYWluT2JqZWN0IGZyb20gXCIuL2NvbW1vbi92YWxpZGF0ZS90eXBlL3BsYWluX29iamVjdFwiO1xuaW1wb3J0IHZhbGlkYXRlVHlwZVN0cmluZyBmcm9tIFwiLi9jb21tb24vdmFsaWRhdGUvdHlwZS9zdHJpbmdcIjtcbmltcG9ydCBjb3JlTGlrZWx5U3VidGFncyBmcm9tIFwiLi9jb3JlL2xpa2VseV9zdWJ0YWdzXCI7XG5pbXBvcnQgY29yZUxvYWQgZnJvbSBcIi4vY29yZS9sb2FkXCI7XG5pbXBvcnQgY29yZVJlbW92ZUxpa2VseVN1YnRhZ3MgZnJvbSBcIi4vY29yZS9yZW1vdmVfbGlrZWx5X3N1YnRhZ3NcIjtcbmltcG9ydCBjb3JlU3VidGFncyBmcm9tIFwiLi9jb3JlL3N1YnRhZ3NcIjtcbmltcG9ydCBpdGVtR2V0UmVzb2x2ZWQgZnJvbSBcIi4vaXRlbS9nZXRfcmVzb2x2ZWRcIjtcbmltcG9ydCBwYXRoTm9ybWFsaXplIGZyb20gXCIuL3BhdGgvbm9ybWFsaXplXCI7XG5pbXBvcnQgcmVzb3VyY2VHZXQgZnJvbSBcIi4vcmVzb3VyY2UvZ2V0XCI7XG5pbXBvcnQgYWx3YXlzQXJyYXkgZnJvbSBcIi4vdXRpbC9hbHdheXNfYXJyYXlcIjtcbmltcG9ydCBqc29uTWVyZ2UgZnJvbSBcIi4vdXRpbC9qc29uL21lcmdlXCI7XG5cbi8qKlxuICogbmV3IENsZHIoKVxuICovXG52YXIgQ2xkciA9IGZ1bmN0aW9uKGxvY2FsZSkge1xuICB0aGlzLmluaXQobG9jYWxlKTtcbn07XG5cbi8vIEJ1aWxkIG9wdGltaXphdGlvbiBoYWNrIHRvIGF2b2lkIGR1cGxpY2F0aW5nIGZ1bmN0aW9ucyBhY3Jvc3MgbW9kdWxlcy5cbkNsZHIuX2Fsd2F5c0FycmF5ID0gYWx3YXlzQXJyYXk7XG5DbGRyLl9jb3JlTG9hZCA9IGNvcmVMb2FkO1xuQ2xkci5fY3JlYXRlRXJyb3IgPSBjcmVhdGVFcnJvcjtcbkNsZHIuX2l0ZW1HZXRSZXNvbHZlZCA9IGl0ZW1HZXRSZXNvbHZlZDtcbkNsZHIuX2pzb25NZXJnZSA9IGpzb25NZXJnZTtcbkNsZHIuX3BhdGhOb3JtYWxpemUgPSBwYXRoTm9ybWFsaXplO1xuQ2xkci5fcmVzb3VyY2VHZXQgPSByZXNvdXJjZUdldDtcbkNsZHIuX3ZhbGlkYXRlUHJlc2VuY2UgPSB2YWxpZGF0ZVByZXNlbmNlO1xuQ2xkci5fdmFsaWRhdGVUeXBlID0gdmFsaWRhdGVUeXBlO1xuQ2xkci5fdmFsaWRhdGVUeXBlUGF0aCA9IHZhbGlkYXRlVHlwZVBhdGg7XG5DbGRyLl92YWxpZGF0ZVR5cGVQbGFpbk9iamVjdCA9IHZhbGlkYXRlVHlwZVBsYWluT2JqZWN0O1xuXG5DbGRyLl9hdmFpbGFibGVCdW5kbGVNYXAgPSB7fTtcbkNsZHIuX2F2YWlsYWJsZUJ1bmRsZU1hcFF1ZXVlID0gW107XG5DbGRyLl9yZXNvbHZlZCA9IHt9O1xuXG4vLyBBbGxvdyB1c2VyIHRvIG92ZXJyaWRlIGxvY2FsZSBzZXBhcmF0b3IgXCItXCIgKGRlZmF1bHQpIHwgXCJfXCIuIEFjY29yZGluZyB0byBodHRwOi8vd3d3LnVuaWNvZGUub3JnL3JlcG9ydHMvdHIzNS8jVW5pY29kZV9sYW5ndWFnZV9pZGVudGlmaWVyLCBib3RoIFwiLVwiIGFuZCBcIl9cIiBhcmUgdmFsaWQgbG9jYWxlIHNlcGFyYXRvcnMgKGVnLiBcImVuX0dCXCIsIFwiZW4tR0JcIikuIEFjY29yZGluZyB0byBodHRwOi8vdW5pY29kZS5vcmcvY2xkci90cmFjL3RpY2tldC82Nzg2IGl0cyB1c2FnZSBtdXN0IGJlIGNvbnNpc3RlbnQgdGhyb3VnaG91dCB0aGUgZGF0YSBzZXQuXG5DbGRyLmxvY2FsZVNlcCA9IFwiLVwiO1xuXG4vKipcbiAqIENsZHIubG9hZCgganNvbiBbLCBqc29uLCAuLi5dIClcbiAqXG4gKiBAanNvbiBbSlNPTl0gQ0xEUiBkYXRhIG9yIFtBcnJheV0gQXJyYXkgb2YgQGpzb24ncy5cbiAqXG4gKiBMb2FkIHJlc29sdmVkIGNsZHIgZGF0YS5cbiAqL1xuQ2xkci5sb2FkID0gZnVuY3Rpb24oKSB7XG4gIENsZHIuX3Jlc29sdmVkID0gY29yZUxvYWQoQ2xkciwgQ2xkci5fcmVzb2x2ZWQsIGFyZ3VtZW50cyk7XG59O1xuXG4vKipcbiAqIC5pbml0KCkgYXV0b21hdGljYWxseSBydW4gb24gaW5zdGFudGlhdGlvbi9jb25zdHJ1Y3Rpb24uXG4gKi9cbkNsZHIucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbihsb2NhbGUpIHtcbiAgdmFyIGF0dHJpYnV0ZXMsXG4gICAgbGFuZ3VhZ2UsXG4gICAgbWF4TGFuZ3VhZ2VJZCxcbiAgICBtaW5MYW5ndWFnZUlkLFxuICAgIHNjcmlwdCxcbiAgICBzdWJ0YWdzLFxuICAgIHRlcnJpdG9yeSxcbiAgICB1bmljb2RlTG9jYWxlRXh0ZW5zaW9ucyxcbiAgICB2YXJpYW50LFxuICAgIHNlcCA9IENsZHIubG9jYWxlU2VwLFxuICAgIHVuaWNvZGVMb2NhbGVFeHRlbnNpb25zUmF3ID0gXCJcIjtcblxuICB2YWxpZGF0ZVByZXNlbmNlKGxvY2FsZSwgXCJsb2NhbGVcIik7XG4gIHZhbGlkYXRlVHlwZVN0cmluZyhsb2NhbGUsIFwibG9jYWxlXCIpO1xuXG4gIHN1YnRhZ3MgPSBjb3JlU3VidGFncyhsb2NhbGUpO1xuXG4gIGlmIChzdWJ0YWdzLmxlbmd0aCA9PT0gNSkge1xuICAgIHVuaWNvZGVMb2NhbGVFeHRlbnNpb25zID0gc3VidGFncy5wb3AoKTtcbiAgICB1bmljb2RlTG9jYWxlRXh0ZW5zaW9uc1JhdyA9IHNlcCArIFwidVwiICsgc2VwICsgdW5pY29kZUxvY2FsZUV4dGVuc2lvbnM7XG4gICAgLy8gUmVtb3ZlIHRyYWlsaW5nIG51bGwgd2hlbiB0aGVyZSBpcyB1bmljb2RlTG9jYWxlRXh0ZW5zaW9ucyBidXQgbm8gdmFyaWFudHMuXG4gICAgaWYgKCFzdWJ0YWdzWzNdKSB7XG4gICAgICBzdWJ0YWdzLnBvcCgpO1xuICAgIH1cbiAgfVxuICB2YXJpYW50ID0gc3VidGFnc1szXTtcblxuICAvLyBOb3JtYWxpemUgbG9jYWxlIGNvZGUuXG4gIC8vIEdldCAob3IgZGVkdWNlKSB0aGUgXCJ0cmlwbGUgc3VidGFnc1wiOiBsYW5ndWFnZSwgdGVycml0b3J5IChhbHNvIGFsaWFzZWQgYXMgcmVnaW9uKSwgYW5kIHNjcmlwdCBzdWJ0YWdzLlxuICAvLyBHZXQgdGhlIHZhcmlhbnQgc3VidGFncyAoY2FsZW5kYXIsIGNvbGxhdGlvbiwgY3VycmVuY3ksIGV0YykuXG4gIC8vIHJlZnM6XG4gIC8vIC0gaHR0cDovL3d3dy51bmljb2RlLm9yZy9yZXBvcnRzL3RyMzUvI0ZpZWxkX0RlZmluaXRpb25zXG4gIC8vIC0gaHR0cDovL3d3dy51bmljb2RlLm9yZy9yZXBvcnRzL3RyMzUvI0xhbmd1YWdlX2FuZF9Mb2NhbGVfSURzXG4gIC8vIC0gaHR0cDovL3d3dy51bmljb2RlLm9yZy9yZXBvcnRzL3RyMzUvI1VuaWNvZGVfbG9jYWxlX2lkZW50aWZpZXJcblxuICAvLyBXaGVuIGEgbG9jYWxlIGlkIGRvZXMgbm90IHNwZWNpZnkgYSBsYW5ndWFnZSwgb3IgdGVycml0b3J5IChyZWdpb24pLCBvciBzY3JpcHQsIHRoZXkgYXJlIG9idGFpbmVkIGJ5IExpa2VseSBTdWJ0YWdzLlxuICBtYXhMYW5ndWFnZUlkID1cbiAgICBjb3JlTGlrZWx5U3VidGFncyhDbGRyLCB0aGlzLCBzdWJ0YWdzLCB7IGZvcmNlOiB0cnVlIH0pIHx8IHN1YnRhZ3M7XG4gIGxhbmd1YWdlID0gbWF4TGFuZ3VhZ2VJZFswXTtcbiAgc2NyaXB0ID0gbWF4TGFuZ3VhZ2VJZFsxXTtcbiAgdGVycml0b3J5ID0gbWF4TGFuZ3VhZ2VJZFsyXTtcblxuICBtaW5MYW5ndWFnZUlkID0gY29yZVJlbW92ZUxpa2VseVN1YnRhZ3MoQ2xkciwgdGhpcywgbWF4TGFuZ3VhZ2VJZCkuam9pbihzZXApO1xuXG4gIC8vIFNldCBhdHRyaWJ1dGVzXG4gIHRoaXMuYXR0cmlidXRlcyA9IGF0dHJpYnV0ZXMgPSB7XG4gICAgYnVuZGxlOiBidW5kbGVMb29rdXAoQ2xkciwgdGhpcywgbWluTGFuZ3VhZ2VJZCksXG5cbiAgICAvLyBVbmljb2RlIExhbmd1YWdlIElkXG4gICAgbWluTGFuZ3VhZ2VJZDogbWluTGFuZ3VhZ2VJZCArIHVuaWNvZGVMb2NhbGVFeHRlbnNpb25zUmF3LFxuICAgIG1heExhbmd1YWdlSWQ6IG1heExhbmd1YWdlSWQuam9pbihzZXApICsgdW5pY29kZUxvY2FsZUV4dGVuc2lvbnNSYXcsXG5cbiAgICAvLyBVbmljb2RlIExhbmd1YWdlIElkIFN1YnRhYnNcbiAgICBsYW5ndWFnZTogbGFuZ3VhZ2UsXG4gICAgc2NyaXB0OiBzY3JpcHQsXG4gICAgdGVycml0b3J5OiB0ZXJyaXRvcnksXG4gICAgcmVnaW9uOiB0ZXJyaXRvcnkgLyogYWxpYXMgKi8sXG4gICAgdmFyaWFudDogdmFyaWFudFxuICB9O1xuXG4gIC8vIFVuaWNvZGUgbG9jYWxlIGV4dGVuc2lvbnMuXG4gIHVuaWNvZGVMb2NhbGVFeHRlbnNpb25zICYmXG4gICAgKFwiLVwiICsgdW5pY29kZUxvY2FsZUV4dGVuc2lvbnMpLnJlcGxhY2UoXG4gICAgICAvLVthLXpdezMsOH18KC1bYS16XXsyfSktKFthLXpdezMsOH0pL2csXG4gICAgICBmdW5jdGlvbihhdHRyaWJ1dGUsIGtleSwgdHlwZSkge1xuICAgICAgICBpZiAoa2V5KSB7XG4gICAgICAgICAgLy8gRXh0ZW5zaW9uIGlzIGluIHRoZSBga2V5d29yZGAgZm9ybS5cbiAgICAgICAgICBhdHRyaWJ1dGVzW1widVwiICsga2V5XSA9IHR5cGU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gRXh0ZW5zaW9uIGlzIGluIHRoZSBgYXR0cmlidXRlYCBmb3JtLlxuICAgICAgICAgIGF0dHJpYnV0ZXNbXCJ1XCIgKyBhdHRyaWJ1dGVdID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICk7XG5cbiAgdGhpcy5sb2NhbGUgPSBsb2NhbGU7XG59O1xuXG4vKipcbiAqIC5nZXQoKVxuICovXG5DbGRyLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbihwYXRoKSB7XG4gIHZhbGlkYXRlUHJlc2VuY2UocGF0aCwgXCJwYXRoXCIpO1xuICB2YWxpZGF0ZVR5cGVQYXRoKHBhdGgsIFwicGF0aFwiKTtcblxuICByZXR1cm4gaXRlbUdldFJlc29sdmVkKENsZHIsIHBhdGgsIHRoaXMuYXR0cmlidXRlcyk7XG59O1xuXG4vKipcbiAqIC5tYWluKClcbiAqL1xuQ2xkci5wcm90b3R5cGUubWFpbiA9IGZ1bmN0aW9uKHBhdGgpIHtcbiAgdmFsaWRhdGVQcmVzZW5jZShwYXRoLCBcInBhdGhcIik7XG4gIHZhbGlkYXRlVHlwZVBhdGgocGF0aCwgXCJwYXRoXCIpO1xuXG4gIHZhbGlkYXRlKFwiRV9NSVNTSU5HX0JVTkRMRVwiLCB0aGlzLmF0dHJpYnV0ZXMuYnVuZGxlICE9PSBudWxsLCB7XG4gICAgbG9jYWxlOiB0aGlzLmxvY2FsZVxuICB9KTtcblxuICBwYXRoID0gYWx3YXlzQXJyYXkocGF0aCk7XG4gIHJldHVybiB0aGlzLmdldChbXCJtYWluL3tidW5kbGV9XCJdLmNvbmNhdChwYXRoKSk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBDbGRyO1xuIl0sIm5hbWVzIjpbImFycmF5IiwiY2FsbGJhY2siLCJpIiwibGVuZ3RoIiwic29tZSIsIkNsZHIiLCJjbGRyIiwic3VidGFncyIsIm9wdGlvbnMiLCJtYXRjaCIsIm1hdGNoRm91bmQiLCJsYW5ndWFnZSIsInNjcmlwdCIsInNlcCIsImxvY2FsZVNlcCIsInRlcnJpdG9yeSIsInZhcmlhbnRzIiwic2xpY2UiLCJjb25jYXQiLCJnZXQiLCJhcnJheVNvbWUiLCJ0ZXN0Iiwiam9pbiIsInNwbGl0IiwiZm9yY2UiLCJtYXhMYW5ndWFnZUlkIiwicmVzdWx0IiwiY29yZUxpa2VseVN1YnRhZ3MiLCJwdXNoIiwibG9jYWxlIiwiYXV4IiwidW5pY29kZUxhbmd1YWdlSWQiLCJyZXBsYWNlIiwiZm9yRWFjaCIsIm1pbkxhbmd1YWdlSWQiLCJhdmFpbGFibGVCdW5kbGVNYXAiLCJfYXZhaWxhYmxlQnVuZGxlTWFwIiwiYXZhaWxhYmxlQnVuZGxlTWFwUXVldWUiLCJfYXZhaWxhYmxlQnVuZGxlTWFwUXVldWUiLCJhcnJheUZvckVhY2giLCJidW5kbGUiLCJleGlzdGluZyIsIm1heEJ1bmRsZSIsIm1pbkJ1bmRsZSIsImNvcmVTdWJ0YWdzIiwiY29yZVJlbW92ZUxpa2VseVN1YnRhZ3MiLCJvYmplY3QiLCJPYmplY3QiLCJrZXlzIiwiY29kZSIsImF0dHJpYnV0ZXMiLCJlcnJvciIsIm1lc3NhZ2UiLCJKU09OIiwic3RyaW5naWZ5IiwiRXJyb3IiLCJvYmplY3RLZXlzIiwiYXR0cmlidXRlIiwiY2hlY2siLCJjcmVhdGVFcnJvciIsInZhbHVlIiwibmFtZSIsInZhbGlkYXRlIiwiZXhwZWN0ZWQiLCJBcnJheSIsImlzQXJyYXkiLCJvYmoiLCJwcm90b3R5cGUiLCJ0b1N0cmluZyIsImNhbGwiLCJ2YWxpZGF0ZVR5cGUiLCJhcnJheUlzQXJyYXkiLCJpc1BsYWluT2JqZWN0IiwiZGF0YSIsInBhdGgiLCJub2RlIiwidW5kZWZpbmVkIiwianNvbiIsIm1haW4iLCJyZXNvdXJjZUdldCIsImhhc093blByb3BlcnR5IiwiaW5kZXhPZiIsInNvbWV0aGluZ09yQXJyYXkiLCJtZXJnZSIsImRlc3RpbmF0aW9uIiwic291cmNlcyIsImFyZ3VtZW50cyIsInNvdXJjZSIsInByb3AiLCJqc29ucyIsImoiLCJ2YWxpZGF0ZVByZXNlbmNlIiwiYWx3YXlzQXJyYXkiLCJ2YWxpZGF0ZVR5cGVQbGFpbk9iamVjdCIsImpzb25NZXJnZSIsImNvcmVTZXRBdmFpbGFibGVCdW5kbGVzIiwibm9ybWFsaXplZFBhdGgiLCJwYXRoTm9ybWFsaXplIiwiX3Jlc29sdmVkIiwiaW5pdCIsIl9hbHdheXNBcnJheSIsIl9jb3JlTG9hZCIsImNvcmVMb2FkIiwiX2NyZWF0ZUVycm9yIiwiX2l0ZW1HZXRSZXNvbHZlZCIsIml0ZW1HZXRSZXNvbHZlZCIsIl9qc29uTWVyZ2UiLCJfcGF0aE5vcm1hbGl6ZSIsIl9yZXNvdXJjZUdldCIsIl92YWxpZGF0ZVByZXNlbmNlIiwiX3ZhbGlkYXRlVHlwZSIsIl92YWxpZGF0ZVR5cGVQYXRoIiwidmFsaWRhdGVUeXBlUGF0aCIsIl92YWxpZGF0ZVR5cGVQbGFpbk9iamVjdCIsImxvYWQiLCJ1bmljb2RlTG9jYWxlRXh0ZW5zaW9ucyIsInZhcmlhbnQiLCJ1bmljb2RlTG9jYWxlRXh0ZW5zaW9uc1JhdyIsInZhbGlkYXRlVHlwZVN0cmluZyIsInBvcCIsImJ1bmRsZUxvb2t1cCIsInJlZ2lvbiIsImtleSIsInR5cGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBZSxvQkFBU0EsS0FBVCxFQUFnQkMsUUFBaEIsRUFBMEI7TUFDbkNDLENBQUosRUFBT0MsTUFBUDs7TUFDSUgsS0FBSyxDQUFDSSxJQUFWLEVBQWdCO1dBQ1BKLEtBQUssQ0FBQ0ksSUFBTixDQUFXSCxRQUFYLENBQVA7OztPQUVHQyxDQUFDLEdBQUcsQ0FBSixFQUFPQyxNQUFNLEdBQUdILEtBQUssQ0FBQ0csTUFBM0IsRUFBbUNELENBQUMsR0FBR0MsTUFBdkMsRUFBK0NELENBQUMsRUFBaEQsRUFB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
