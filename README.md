# cldr js - Simple CLDR API

[CLDR (unicode.org)](http://cldr.unicode.org/) provides locale content for I18n software. The data is provided in two formats: LDML (XML format), and JSON. Our goal is to provide a simple layer to facilitate I18n softwares to access and use the [official CLDR JSON data](http://cldr.unicode.org/index/cldr-spec/json).

| File | Minified size | Resolved CLDR data | Unresolved CLDR data |
|---|---|---|---|
| cldr.runtime.js | 1KB | ✔ | ✘ |
| cldr.js | 2KB | ✔ | ✔ ([locale inheritance](http://www.unicode.org/reports/tr35/#Locale_Inheritance) support) |

## Getting Started

```html
<script src="cldr.runtime.js"></script>
```

```javascript
// Load the appropriate portion of CLDR JSON data
Cldr.load( data );

// Instantiate it by passing a locale
var cldr = new Cldr( "pt_BR" );

// Get item data
cldr.get( "/cldr/main/numbers/symbols-numberSystem-latn/decimal" );
// -> ","
```

## Get CLDR JSON data

CLDR makes available a file for download ([`json.zip`](http://www.unicode.org/Public/cldr/latest/)) with the data of the top 20 (by the time of this writting) languages they consider to be the "most used" languages. It contains the complete amount of data per language. Also, all this information have been fully resolved, ie. they can be loaded with `Cldr.load( data )`.

You can generate the JSON representation of the languages not available in the ZIP file by using the official conversion tool ([`tools.zip`](http://www.unicode.org/Public/cldr/latest/)). This ZIP contains a README with instructions on how to build the data. `tools/scripts/CLDRWrapper` may also be useful.

You can opt to generate unresolved data to save space (or bandwidth) (`-r false` option of the conversion tool). In this case, load the data using `Cldr.loadUnresolved( data )`, and have it resolved during execution time.

## API

### Cldr.load( json )

- **json** Object with resolved CLDR JSON data.

Load resolved JSON data.

```javascript
Cldr.load({
	main: {
		"pt_BR": {
			numbers: {
				"symbols-numberSystem-latn": {|
					decimal: ","
				}
			}
		}
	}
});
```

### Cldr.loadUnresolved( json )

- **json** Object with unresolved CLDR JSON data.

load unresolved json data.

```javascript
cldr.load({
	main: {
		pt: {
			numbers: {
				"symbols-numbersystem-latn": {
					decimal: ","
				}
			}
		}
	}
});
```

### cldr.get( path )

- **path** String eg. `"/cldr/main/numbers/symbols-numberSystem-latn/decimal"`, or Array eg. `[ "cldr", "main", "numbers", "symbols-numberSystem-latn", "decimal" ]` or `[ "cldr/main", "numbers/symbols-numberSystem-latn/"decimal" ]`. Note the Array can have path elements. Also note leading "/cldr" can be ommited. 

Get item data given its path.

```javascript
cldr.get( "/cldr/main/numbers/symbols-numberSystem-latn/decimal" );
});
```

*cldr.runtime.js*

On the runtime version, it gets the item data directly or return `undefined`.

*cldr.js*

On the full version, it gets the item data directly or lookup by following [locale inheritance](http://www.unicode.org/reports/tr35/#Locale_Inheritance), set a local resolved cache if it's found (for subsequent faster access), or return `undefined`.

## Development

The cldr js has no external dependencies. You can include it in the script tag of your page, as shown in Getting Started above, and you're ready to go.

You can use bower to download it.

```bash
bower install rxaviers/cldr
```

### AMD/Commonjs

The cldr js has a UMD wrapper to allow use in node.js or via AMD (in node.js or browsers).

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

## Contributing

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
