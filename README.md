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
// See "How to get CLDR JSON data?" below for more information on how to get that data.
Cldr.load( data );

// Instantiate it by passing a locale.
var ptBr = new Cldr( "pt_BR" );

// Get CLDR item data given its path.
ptBr.main( "numbers/symbols-numberSystem-latn/decimal" );
// ➡ ","
// Equivalent to:
// .get( "main/{languageId}/numbers/symbols-numberSystem-latn/decimal" );
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

See [How to get CLDR JSON data?](#how-to-get-cldr-json-data) below for more information on how to get that data.

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
```

- `language`, `script`, `territory` (also aliased as `region`), and `maxLanguageId` are computed by [adding likely subtags](./src/likely-subtags.js) according to the [specification](http://www.unicode.org/reports/tr35/#Likely_Subtags).
- `languageId` is always in the succint form, obtained by [removing the likely subtags from `maxLanguageId`](./src/remove-likely-subtags.js) according to the [specification](http://www.unicode.org/reports/tr35/#Likely_Subtags).

Comparison between different locales.

| locale | languageId | maxLanguageId | language | script | region |
| --- | --- | --- | --- | --- | --- |
| **en** |  `"en"` |  `"en_Latn_US"`  |  `"en"` |  `"Latn"` |  `"US"` |
| **en_US** |  `"en"` |  `"en_Latn_US"`  |  `"en"` |  `"Latn"` |  `"US"` |
| **de** |  `"de"` |  `"de_Latn_DE"`  |  `"de"` |  `"Latn"` |  `"DE"` |
| **zh** |  `"zh"` |  `"zh_Hans_CN"`  |  `"zh"` |  `"Hans"` |  `"CN"` |
| **zh_TW** |  `"zh_TW"` |  `"zh_Hant_TW"`  |  `"zh"` |  `"Hant"` | `"TW"` |
| **ar** |  `"ar"` |  `"ar_Arab_EG"` |  `"ar"` |  `"Arab"` | `"EG"` |
| **pt** | `"pt"` | `"pt_Latn_BR"` | `"pt"` | `"Latn"` | `"BR"` |
| **pt_BR** | `"pt"` | `"pt_Latn_BR"` | `"pt"` | `"Latn"` | `"BR"` |
| **pt_PT** | `"pt_PT"` | `"pt_Latn_PT"` | `"pt"` | `"Latn"` | `"PT"` |
| **es** | `"es"` | `"es_Latn_ES"` | `"es"` | `"Latn"` | `"ES"` |
| **es_AR** | `"es_AR"` | `"es_Latn_AR"` | `"es"` | `"Latn"` | `"AR"` |

### Get item given its path

```javascript
en.main( "numbers/symbols-numberSystem-latn/decimal" );
// ➡ "."
// Equivalent to:
// .get( "main/{languageId}/numbers/symbols-numberSystem-latn/decimal" );

ptBr.main( "numbers/symbols-numberSystem-latn/decimal" );
// ➡ ","
// Equivalent to:
// .get( "main/{languageId}/numbers/symbols-numberSystem-latn/decimal" );
```

Have any [locale attributes](#cldrattributes) replaced with their corresponding values by embracing it with `{}`. In the example below, `{language}` is replaced with `"en"`, and `{territory}` with `"US"`.

```javascript
var enGender = en.get( "supplemental/gender/personList/{language}" );
// ➡ "neutral"
// Notice the more complete way to get this data is:
// cldr.get( "supplemental/gender/personList/{language}" ) ||
// cldr.get( "supplemental/gender/personList/001" );

var USCurrencies = en.get( "supplemental/currencyData/region/{territory}" );
// ➡
// [ { USD: { _from: "1792-01-01" } },
//   { USN: { _tender: "false" } },
//   { USS: { _tender: "false" } } ]

var enMeasurementSystem = en.get( "supplemental/measurementData/measurementSystem/{territory}" );
// ➡ "US"
// Notice the more complete way to get this data is:
// cldr.get( "supplemental/measurementData/measurementSystem/{territory}" ) ||
// cldr.get( "supplemental/measurementData/measurementSystem/001" );
```

Get `undefined` for non-existent data.

```javascript
en.get( "/crazy/invalid/path" );
// ➡ undefined

// Avoid this
enData && enData.crazy && enData.crazy.invalid && enData.crazy.invalid.path;
```

### Resolve CLDR inheritances

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
// Equivalent to:
// en.get( "supplemental/weekData/firstDay/{territory}" ) ||
// en.get( "supplemental/weekData/firstDay/001" );

var brFirstDay = ptBr.supplemental.weekData.firstDay();
// ➡ mon
// Equivalent to:
// ptBr.get( "supplemental/weekData/firstDay/{territory}" ) ||
// ptBr.get( "supplemental/weekData/firstDay/001" );
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
bower install cldr.js
```

```javascript
require.config({
	path: {
		"cldr": "bower_components/cldr.js/dist/cldr.runtime"
	}
});

require(["cldr"], function(Cldr) {
	...
});
```

### CommonJS / Node.js

```bash
npm install cldr.js
```

```javascript
var Cldr = require( "cldr.js" );
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

### cldr = new Cldr( locale )

- **locale** String eg. `"en"`, `"pt_BR"`. More information in the [specification](http://www.unicode.org/reports/tr35/#Locale).

Create a new instance of Cldr.

### cldr.attributes

Attributes is an Object created during instance initialization (construction), and are used internally by `.get()` to replace dynamic parts of an item path.

| Attribute | Field | 
| --- | --- |
| `language` | Language Subtag ([spec](http://www.unicode.org/reports/tr35/#Language_Locale_Field_Definitions)) | 
| `script` | Script Subtag ([spec](http://www.unicode.org/reports/tr35/#Language_Locale_Field_Definitions)) | 
| `region` or `territory` | Region Subtag ([spec](http://www.unicode.org/reports/tr35/#Language_Locale_Field_Definitions)) | 
| `languageId` | Language Id ([spec](http://www.unicode.org/reports/tr35/#Unicode_language_identifier)) | 
| `maxLanguageId` | Maximized Language Id ([spec](http://www.unicode.org/reports/tr35/#Likely_Subtags)) | 

- `language`, `script`, `territory` (also aliased as `region`), and `maxLanguageId` are computed by [adding likely subtags](./src/likely-subtags.js) according to the [specification](http://www.unicode.org/reports/tr35/#Likely_Subtags).
- `languageId` is always in the succint form, obtained by [removing the likely subtags from `maxLanguageId`](./src/remove-likely-subtags.js) according to the [specification](http://www.unicode.org/reports/tr35/#Likely_Subtags).

### cldr.get( path )

- **path**
 - String, eg. `"/cldr/main/{languageId}/numbers/symbols-numberSystem-latn/decimal"`; or
 - Array, eg. `[ "cldr", "main", "{languageId}", "numbers", "symbols-numberSystem-latn", "decimal" ]`, or `[ "cldr/main", "{languageId}", "numbers/symbols-numberSystem-latn/"decimal" ]` (notice the subpath parts);
 - The leading "/cldr" can be ommited;
 - [Locale attributes](#cldrattributes), eg. `{languageId}`, are replaced with their appropriate values;

Get item data given its path.

```javascript
ptBr.get( "main/{languageId}/numbers/symbols-numberSystem-latn/decimal" );
// ➡ ","
```

*cldr.runtime.js*

On the runtime version, it gets the item data directly or return `undefined`.

*cldr.js*

On the full version, it gets the item data directly or lookup by following [locale inheritance](http://www.unicode.org/reports/tr35/#Locale_Inheritance), set a local resolved cache if it's found (for subsequent faster access), or return `undefined`.

### cldr.main( path )

- **path** String or Array. Same specification of `cldr.get()`.

It's an alias for `.get([ "main/{languageId}", ... ])`.

```javascript
ptBr.main( "numbers/symbols-numberSystem-latn/decimal" );
// ➡ ","
```

### cldr.supplemental( path )

- **path** String or Array. Same specification of `cldr.get()`.

It's an alias for `.get([ "supplemental", ... ])`

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
npm install && bower install
```
Run tests
```bash
grunt test
```
Build distribution file.
```bash
grunt
```

## License

MIT © [Rafael Xavier de Souza](http://rafael.xavier.blog.br)
