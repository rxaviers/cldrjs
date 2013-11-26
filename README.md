# cldr.js - Simple CLDR API

[CLDR (unicode.org)](http://cldr.unicode.org/) provides locale content for I18n software. The data is provided in two formats: LDML (XML format), and JSON. Our goal is to provide a simple layer to facilitate I18n softwares to access and use the [official CLDR JSON data](http://cldr.unicode.org/index/cldr-spec/json).

| File | Minified size | Resolved CLDR data | Unresolved CLDR data |
|---|---|---|---|
| cldr.runtime.js | 3.9KB | ✔ | ✘ |
| cldr.js | 4.5KB | ✔ | ✔ ([locale inheritance](http://www.unicode.org/reports/tr35/#Locale_Inheritance) support) |

## Getting Started

```html
<script src="cldr.runtime.js"></script>
```

```javascript
// Load the appropriate portion of CLDR JSON data.
Cldr.load( data );

// Instantiate it by passing a locale.
var ptBr = new Cldr( "pt_BR" );

// Get CLDR item data given its path.
ptBr.main( "numbers/symbols-numberSystem-latn/decimal" );
// ➡ ","
```

Quickly jump to:
- [What about cldr.js?](#what-about-cldrjs)
- [How to get CLDR JSON data?](#how-to-get-cldr-json-data)
- [Usage and installation](#usage-and-installation)
- [API](#api)
- [Development / Contributing](#development--contributing)

## What about cldr.js?

### Where to use it?

It's designed to work both in the [browser](#browser-support), or in [node.js](#commonjs--nodejs). It supports [AMD](#amd), and [CommonJs](#commonjs--nodejs);

### Load only the CLDR portion you need

```javascript
// Load the appropriate portion of CLDR JSON data
Cldr.load( likelySubtagsData );
Cldr.load( enData );
Cldr.load( ptBrData );
```

### Instantiate a locale and get it normalized

```javascript
var en = new Cldr( "en" );
en.attributes;
// {
//   "languageId": "en",
//   "maxLanguageId": "en_Latn_US",
//   "language": "en",
//   "script": "Latn",
//   "territory": "US",
//   "region": "US"
// }

var enUs = new Cldr( "en_US" );
enUs.attributes;
// {
//   "languageId": "en",
//   "maxLanguageId": "en_Latn_US",
//   "language": "en",
//   "script": "Latn",
//   "territory": "US",
//   "region": "US"
// }

var zh = new Cldr( "zh" );
zh.attributes;
// {
//   "languageId": "zh",
//   "maxLanguageId": "zh_Hans_CN",
//   "language": "zh",
//   "script": "Hans",
//   "territory": "CN",
//   "region": "CN"
// }

var zhTw = new Cldr( "zh_TW" );
zhTw.attributes;
// {
//   "languageId": "zh_TW",
//   "maxLanguageId": "zh_Hant_TW",
//   "language": "zh",
//   "script": "Hant",
//   "territory": "TW",
//   "region": "TW"
// }

var ar = new Cldr( "ar" );
ar.attributes;
// {
//   "languageId": "ar",
//   "maxLanguageId": "ar_Arab_EG",
//   "language": "ar",
//   "script": "Arab",
//   "territory": "EG",
//   "region": "EG"
// }

var ptBr = new Cldr( "pt_BR" );
ptBr.attributes;
// {
//   "languageId": "pt",
//   "maxLanguageId": "pt_Latn_BR",
//   "language": "pt",
//   "script": "Latn",
//   "territory": "BR",
//   "region": "BR"
// }
```

- `language`, `script`, `territory` (also aliased as `region`), and `maxLanguageId` are computed by [adding likely subtags](./src/likely-subtags.js) according to the [specification](http://www.unicode.org/reports/tr35/#Likely_Subtags).
- `languageId` is always in the succint form, obtained by [removing the likely subtags from `maxLanguageId`](./src/remove-likely-subtags.js) according to the [specification](http://www.unicode.org/reports/tr35/#Likely_Subtags).

### Get item given its path

Have any attributes replaced with its corresponding value by embracing it with `{}`. In the example below, `{languageId}` is replaced by "en" and "pt_BR" respectively.

```javascript
en.get( "/cldr/main/{languageId}/numbers/symbols-numberSystem-latn/decimal" );
// ➡ "."

ptBr.get( "/cldr/main/{languageId}/numbers/symbols-numberSystem-latn/decimal" );
// ➡ ","
```

Use aliases and make it even simpler.

```javascript
en.main( "numbers/symbols-numberSystem-latn/decimal" );
// ➡ "."

ptBr.main( "numbers/symbols-numberSystem-latn/decimal" );
// ➡ ","

```

Get `undefined` for non-existent data.

```javascript
en.get( "/crazy/invalid/path" );
// ➡ undefined

// Avoid this
enData && enData.crazy && enData.crazy.invalid && enData.crazy.invalid.path;
```

### Optionally, resolve CLDR inheritances

If you are using unresolved JSON data, you can resolve them dynamically during runtime by loading the full cldr.js. Currently, we support bundle inheritance.

```javascript
Cldr.load( unresolvedEnData );
Cldr.load( unresolvedEnGbData );
Cldr.load( unresolvedEnInData );
Cldr.load( parentLocalesData ); // supplemental
Cldr.load( likelySubtagsData ); // supplemental

var enIn = new Cldr( "en_IN" );

enIn.main( "dates/calendars/gregorian/dateTimeFormats/availableFormats/yMd" );
// ➡ "dd/MM/y"
// 1st time retrieved by resolving: en_IN ➡ en_GB (parent locale lookup).
// Further times retrieved straight from the resolved cache.

enIn.main( "numbers/symbols-numberSystem-latn/decimal" );
// ➡ "."
// 1st time retrieved by resolving: en_IN ➡ en_GB (parent locale lookup) ➡ en (truncate lookup)
// Further times retrieved straight from the resolved cache.
```

### Helpers

We offer some convenient helpers.

```javascript
var usFirstDay = en.supplemental.weekData.firstDay();
// ➡ sun

var brFirstDay = ptBr.supplemental.weekData.firstDay();
// ➡ mon

// So, you don't need to:
var usFirstDay = 
    en.get( "supplemental/weekData/firstDay/{territory}" ) ||
    en.get( "supplemental/weekData/firstDay/001" );
// ➡ sun

var brFirstDay = 
    ptBr.get( "supplemental/weekData/firstDay/{territory}" ) ||
    ptBr.get( "supplemental/weekData/firstDay/001" );
// ➡ mon

```

## How to get CLDR JSON data?

CLDR makes available a file for download ([`json.zip`](http://www.unicode.org/Public/cldr/latest/)) with the data of the top 20 (by the time of this writting) languages they consider to be the "most used" languages. It contains the complete amount of data per language. Also, all this information have been fully resolved.

You can generate the JSON representation of the languages not available in the ZIP file by using the official conversion tool ([`tools.zip`](http://www.unicode.org/Public/cldr/latest/)). This ZIP contains a README with instructions on how to build the data. `tools/scripts/CLDRWrapper` may also be useful.

You can opt to generate unresolved data to save space (or bandwidth) (`-r false` option of the conversion tool), and have it resolved during execution time (not available on `cldr.runtime.js`).

## Usage and installation

The cldr js has no external dependencies. You can include it in the script tag of your page, as shown in Getting Started above, and you're ready to go.

We are UMD wrapped, so you can also use this lib on node.js via CommonJS or on browsers via AMD.

### Browser support

We officially support:
- Firefox (latest - 2)+
- Chrome (latest - 2)+
- Safari 5.1+
- IE 8+
- Opera (latest - 2)+

Sniff tests show cldr.js also works on the following browsers:
- Firefox 4+
- Safari 5+
- Chrome 14+
- IE 6+
- Opera 11.1+

If you find any bugs, please just let us know. We'll be glad to fix them for the officially supported browsers, or at least update the documentation for the unsupported ones.

### AMD

```bash
bower install rxaviers/cldr#<tagged version>
```

```javascript
require.config({
	path: {
		"cldr": "bower_components/cldr/dist/cldr.runtime"
	}
});

require(["cldr"], function(Cldr) {
	...
});
```

### CommonJS / Node.js

```bash
npm install rxaviers/cldr#<tagged version>
```

```javascript
var Cldr = require( "cldr" );
```

## API

### Cldr.load( json )

- **json** Object with resolved or unresolved [1] CLDR JSON data.

Load resolved JSON data.

```javascript
Cldr.load({
	"main": {
		"pt_BR": {
			"numbers": {
				"symbols-numberSystem-latn": {
					"decimal": ","
				}
			}
		}
	}
});
```

1: On *cldr.runtime.js*, unresolved processing is **not available**, so it loads resolved data only.

### cldr.get( path )

- **path** String eg. `"/cldr/main/{languageId}/numbers/symbols-numberSystem-latn/decimal"`, or Array eg. `[ "cldr", "main", "{languageId}", "numbers", "symbols-numberSystem-latn", "decimal" ]` or `[ "cldr/main", "{languageId}", "numbers/symbols-numberSystem-latn/"decimal" ]`. Note the leading "/cldr" can be ommited. Note the attributes (ie. subtags, or tags) `{<attribute>}` are appropriately replaced.

Get item data given its path.

```javascript
ptBr.get( "/cldr/main/{languageId}/numbers/symbols-numberSystem-latn/decimal" );
// ➡ ","
```

*cldr.runtime.js*

On the runtime version, it gets the item data directly or return `undefined`.

*cldr.js*

On the full version, it gets the item data directly or lookup by following [locale inheritance](http://www.unicode.org/reports/tr35/#Locale_Inheritance), set a local resolved cache if it's found (for subsequent faster access), or return `undefined`.

### cldr.main( path )

- **path** String or Array. Same specification of `cldr.get()`.

Helper function. Get item of path prepended with `"/cldr/main/{languageId}"`.

```javascript
ptBr.main( "numbers/symbols-numberSystem-latn/decimal" );
// ➡ ","
```

### cldr.supplemental( path )

- **path** String or Array. Same specification of `cldr.get()`.

Helper function. Get item of path prepended with `"/cldr/supplemental"`.

```javascript
en.supplemental( "gender/personList/{language}" );
// ➡ "neutral"
```

### cldr.supplemental.timeData.allowed()

Helper function. Return the supplemental timeData allowed of locale's territory.

```javascript
en.supplemental.timeData.allowed();
// ➡ "H h"
```

### cldr.supplemental.timeData.preferred()

Helper function. Return the supplemental timeData preferred of locale's territory.

```javascript
en.supplemental.timeData.preferred();
// ➡ "h"
```

### cldr.supplemental.weekData.firstDay()

Helper function. Return the supplemental weekData firstDay of locale's territory.

```javascript
en.supplemental.weekData.firstDay();
// ➡ "sun"
```

### cldr.supplemental.weekData.minDays()

Helper function. Return the supplemental weekData minDays of locale's territory as a Number.

```javascript
en.supplemental.weekData.minDays();
// ➡ 1
```

## Development / Contributing

Install grunt and tests external dependencies. First, install the [grunt-cli](http://gruntjs.com/getting-started#installing-the-cli) and [bower](http://bower.io/) packages if you haven't before. These should be done as global installs. Then:

```bash
npm install
```
Run tests
```bash
grunt test
```
Build distribution file.
```bash
grunt
```
