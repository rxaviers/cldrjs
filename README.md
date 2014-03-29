# cldr.js - Simple CLDR API

[CLDR (unicode.org)](http://cldr.unicode.org/) provides locale content for I18n software. The data is provided in two formats: LDML (XML format), and JSON. Our goal is to provide a simple layer to facilitate I18n softwares to access and use the [official CLDR JSON data](http://cldr.unicode.org/index/cldr-spec/json).

| File | Minified size | Summary |
|---|--:|---|
| cldr.js | 3.2KB | Core library |
| cldr/unresolved.js | +1.1KB | Provides inheritance support for unresolved data |
| cldr/supplemental.js | +1.2KB | Provides supplemental helper methods |

## Getting Started

Quick jump:
- [About cldr.js?](#about-cldrjs)
- [How to get CLDR JSON data?](#how-to-get-cldr-json-data)
- [Usage and installation](#usage-and-installation)
- [API](#api)
- [Development / Contributing](#development--contributing)

## About cldr.js?

### Who uses cldr.js?

| Organization | Project |
|---|---|
| ![jQuery](doc/asset/jquery.png) | https://github.com/jquery/globalize |

### Where to use it?

It's designed to work both in the [browser](#usage-and-installation), or in [node.js](#commonjs--nodejs). It supports [AMD](#usage-and-installation), and [CommonJs](#usage-and-installation);

See [Usage and installation](#usage-and-installation).

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
//   "maxLanguageId": "en-Latn-US",
//   "language": "en",
//   "script": "Latn",
//   "territory": "US",
//   "region": "US"
// }
```

- `language`, `script`, `territory` (also aliased as `region`), and `maxLanguageId` are computed by [adding likely subtags](./src/likely-subtags.js) according to the [specification](http://www.unicode.org/reports/tr35/#Likely_Subtags).
- `languageId` is always in the succinct form, obtained by [removing the likely subtags from `maxLanguageId`](./src/remove-likely-subtags.js) according to the [specification](http://www.unicode.org/reports/tr35/#Likely_Subtags).

Comparison between different locales.

| locale | languageId | maxLanguageId | language | script | region |
| --- | --- | --- | --- | --- | --- |
| **en** |  `"en"` |  `"en-Latn-US"`  |  `"en"` |  `"Latn"` |  `"US"` |
| **en-US** |  `"en"` |  `"en-Latn-US"`  |  `"en"` |  `"Latn"` |  `"US"` |
| **de** |  `"de"` |  `"de-Latn-DE"`  |  `"de"` |  `"Latn"` |  `"DE"` |
| **zh** |  `"zh"` |  `"zh-Hans-CN"`  |  `"zh"` |  `"Hans"` |  `"CN"` |
| **zh-TW** |  `"zh-TW"` |  `"zh-Hant-TW"`  |  `"zh"` |  `"Hant"` | `"TW"` |
| **ar** |  `"ar"` |  `"ar-Arab-EG"` |  `"ar"` |  `"Arab"` | `"EG"` |
| **pt** | `"pt"` | `"pt-Latn-BR"` | `"pt"` | `"Latn"` | `"BR"` |
| **pt-BR** | `"pt"` | `"pt-Latn-BR"` | `"pt"` | `"Latn"` | `"BR"` |
| **pt-PT** | `"pt-PT"` | `"pt-Latn-PT"` | `"pt"` | `"Latn"` | `"PT"` |
| **es** | `"es"` | `"es-Latn-ES"` | `"es"` | `"Latn"` | `"ES"` |
| **es-AR** | `"es-AR"` | `"es-Latn-AR"` | `"es"` | `"Latn"` | `"AR"` |

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

If you are using unresolved JSON data, you can resolve them dynamically during runtime by loading the `cldr/unresolved.js` extension module. Currently, we support bundle inheritance.

```javascript
Cldr.load( unresolvedEnData );
Cldr.load( unresolvedEnGbData );
Cldr.load( unresolvedEnInData );
Cldr.load( parentLocalesData ); // supplemental
Cldr.load( likelySubtagsData ); // supplemental

var enIn = new Cldr( "en-IN" );

enIn.main( "dates/calendars/gregorian/dateTimeFormats/availableFormats/yMd" );
// ➡ "dd/MM/y"
// 1st time retrieved by resolving: en-IN ➡ en-GB (parent locale lookup).
// Further times retrieved straight from the resolved cache.

enIn.main( "numbers/symbols-numberSystem-latn/decimal" );
// ➡ "."
// 1st time retrieved by resolving: en-IN ➡ en-GB (parent locale lookup) ➡ en (truncate lookup)
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

## Usage and installation

cldr.js has no external dependencies. You can include it in the script tag of your page, as shown in Getting Started above, and you're ready to go.

```html
<script src="cldr.js"></script>
```

```javascript
// Load the appropriate portion of CLDR JSON data.
// See "How to get CLDR JSON data?" below for more information on how to get that data.
Cldr.load( cldrJsonData );

// Instantiate it by passing a locale.
var ptBr = new Cldr( "pt-BR" );

// Get CLDR item data given its path.
ptBr.main( "numbers/symbols-numberSystem-latn/decimal" );
// ➡ ","
// Equivalent to:
// .get( "main/{languageId}/numbers/symbols-numberSystem-latn/decimal" );
```

We are UMD wrapped. So, it supports AMD, CommonJS, or global variables (in case neither AMD nor CommonJS have been detected).

Example of usage on AMD:

```bash
bower install cldrjs
```

```javascript
require.config({
  paths: {
    "cldr": "bower_components/cldrjs/dist/cldr"
  }
});

require( [ "cldr", "cldr/supplemental", "cldr/unresolved" ], function( Cldr ) {
  ...
});
```

Example of usage with Node.js:

```bash
npm install cldrjs
```

```javascript
var Cldr = require( "cldrjs" );
```

### How to get CLDR JSON data?

The Unicode CLDR is available for download as JSON ([`json.zip`](http://www.unicode.org/Public/cldr/latest/json.zip)). This file contains the complete data of what the Unicode CLDR Project considers the top 20 languages (at the time of this writing).

You can generate the JSON representation of the languages not available in the ZIP file by using the official conversion tool ([`tools.zip`](http://www.unicode.org/Public/cldr/latest/)). This ZIP contains a README with instructions on how to build the data.

You can choose to generate unresolved data to save space or bandwidth (`-r false` option of the conversion tool), and instead have it resolve at runtime.

For the examples below, first fetch CLDR JSON data:

```bash
wget http://www.unicode.org/Public/cldr/latest/json.zip
unzip json.zip -d cldr
```

Example of embedding CLDR JSON data:  

```html
<script>
// Embedded (hard-coded) CLDR JSON data.
Cldr.load({
  supplemental: {
    likelySubtags: {
      ...
    }
  }
});
</script>
```

Example of loading it dynamically:

```html
<script src="jquery.js"></script>
<script>
$.get( "cldr/supplemental/likelySubtags.json", Cldr.load );
</script>
```

Example using AMD (also see our [functional tests](test/functional.js)):
```javascript
define([
  "cldr",
  "json!cldr/supplemental/likelySubtags.json"
], function( Cldr, likelySubtags ) {

  Cldr.load( likelySubtags );

});
```

Example using Node.js:

```javascript
var Cldr = require( "cldrjs" );
Cldr.load( require( "./cldr/supplemental/likelySubtags.json" ) );
```

#### Atention: library owners, do not embed data

It's NOT recommended that libraries embed data into its code logic for some reasons: avoid forcing a certain data version on users, avoid maintaining locale changes, avoid duplicating data among different i18n libraries.

We recommend loading CLDR data must be performed by end user code.

#### Which CLDR portion to load?

It depends on the used modules.

| File | Required CLDR JSON data |
|---|---|
| cldr.js | `cldr/supplemental/likelySubtags.json` |
| cldr/unresolved.js |  - |
| cldr/supplemental.js | `cldr/supplemental/{timeData, weekData}.json` |

You must also load any portion of the CLDR data you plan to use in your library or your end-application.

## API

### Cldr.load( json )

- **json** Object with resolved or unresolved [1] CLDR JSON data.

Load resolved or unresolved [1] JSON data.

```javascript
Cldr.load({
	"main": {
		"pt-BR": {
			"numbers": {
				"symbols-numberSystem-latn": {
					"decimal": ","
				}
			}
		}
	}
});
```

1: Unresolved processing is **only available** after loading `cldr/unresolved.js` extension module.

### cldr = new Cldr( locale )

- **locale** String eg. `"en"`, `"pt-BR"`. More information in the [specification](http://www.unicode.org/reports/tr35/#Locale).

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

Get the item data given its path, or return `undefined`.

If extended with `cldr/unresolved.js`, get the item data or lookup by following [locale inheritance](http://www.unicode.org/reports/tr35/#Locale_Inheritance), set a local resolved cache if it's found (for subsequent faster access), or return `undefined`.

```javascript
ptBr.get( "main/{languageId}/numbers/symbols-numberSystem-latn/decimal" );
// ➡ ","
```

### cldr.main( path )

- **path** String or Array. Same specification of `cldr.get()`.

It's an alias for `.get([ "main/{languageId}", ... ])`.

```javascript
ptBr.main( "numbers/symbols-numberSystem-latn/decimal" );
// ➡ ","
```

### cldr.supplemental( path )

- **path** String or Array. Same specification of `cldr.get()`.

It's an alias for `.get([ "supplemental", ... ])`. Provided by `cldr/supplemental.js`.

```javascript
en.supplemental( "gender/personList/{language}" );
// ➡ "neutral"
```

### cldr.supplemental.timeData.allowed()

Helper function. Return the supplemental timeData allowed of locale's territory. Provided by `cldr/supplemental.js`.

```javascript
en.supplemental.timeData.allowed();
// ➡ "H h"
```

### cldr.supplemental.timeData.preferred()

Helper function. Return the supplemental timeData preferred of locale's territory. Provided by `cldr/supplemental.js`.

```javascript
en.supplemental.timeData.preferred();
// ➡ "h"
```

### cldr.supplemental.weekData.firstDay()

Helper function. Return the supplemental weekData firstDay of locale's territory. Provided by `cldr/supplemental.js`.

```javascript
en.supplemental.weekData.firstDay();
// ➡ "sun"
```

### cldr.supplemental.weekData.minDays()

Helper function. Return the supplemental weekData minDays of locale's territory as a Number. Provided by `cldr/supplemental.js`.

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
