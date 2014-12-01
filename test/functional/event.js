define([
	"cldr",
	"../util",
	"json!cldr-data/supplemental/likelySubtags.json",
	"cldr/event"
], function( Cldr, util, likelySubtagsJson ) {

	Cldr.load( likelySubtagsJson );

	[ "off", "on", "once" ].forEach(function( method ) {
		describe( "Cldr." + method + "( event, listener )", function() {

			it( "should throw error on missing event parameter", function() {
				expect(function() {
					Cldr[ method ]();
				}).to.throw( Error, /E_MISSING_PARAMETER/ );
			});

			it( "should throw error on missing listener parameter", function() {
				expect(function() {
					Cldr[ method ]( "get" );
				}).to.throw( Error, /E_MISSING_PARAMETER/ );
			});

			it( "should throw error on invalid event parameter type", function() {
				util.assertEventParameter( expect, function( invalidValue ) {
					return function() {
						Cldr[ method ]( invalidValue, function() {} );
					};
				});
			});

			it( "should throw error on invalid listener parameter type", function() {
				util.assertFunctionParameter( expect, function( invalidValue ) {
					return function() {
						Cldr[ method ]( "get", invalidValue );
					};
				});
			});

		});

	});

	describe( "Cldr.on( \"get\", listener )", function() {

		it( "should add the listener to the global `get` event", function( done ) {
			function listener() {
				done();
			}
			var cldr = new Cldr( "root" );
			Cldr.on( "get", listener );
			cldr.get( "something" );
			Cldr.off( "get", listener );
		});

		it( "should pass path and value to the listener", function( done ) {
			function listener( path, value ) {
				if ( path === "supplemental/likelySubtags/en" && value === "en-Latn-US" ) {
					done();
				}
			}
			var cldr = new Cldr( "root" );
			Cldr.on( "get", listener );
			cldr.get( "supplemental/likelySubtags/en" );
			Cldr.off( "get", listener );
		});

	});

	describe( "Cldr.off( \"get\", listener )", function() {

		it( "should remove the specific listener from the global `get` event", function( done ) {
			var status = new Error( "Also removed wrong listener `listener2`" );
			function listener1() {
				done( new Error( "should not listen `listener1`" ) );
			}
			function listener2() {
				status = undefined; // Good.
			}
			var cldr = new Cldr( "root" );
			Cldr.on( "get", listener1 );
			Cldr.on( "get", listener2 );
			Cldr.off( "get", listener1 );
			cldr.get( "something" );
			Cldr.off( "get", listener2 );
			setTimeout(function() {
				done( status );
			});
		});

	});

	describe( "Cldr.once( \"get\", listener )", function() {

		it( "should add the listener to the global `get` event *once*", function( done ) {
			var status = new Error( "Did not listen" );
			function listener( path ) {
				if ( path === "first" ) {
					status = undefined; // Good.
				} else if ( path === "second" ) {
					status = new Error( "Listened twice" );
				}
			}
			var cldr = new Cldr( "root" );
			Cldr.once( "get", listener );
			cldr.get( "first" );
			cldr.get( "second" );
			setTimeout(function() {
				done( status );
			});
		});

		it( "should pass path and value to the listener", function( done ) {
			function listener( path, value ) {
				if ( path === "supplemental/likelySubtags/en" && value === "en-Latn-US" ) {
					done();
				}
			}
			var cldr = new Cldr( "root" );
			Cldr.once( "get", listener );
			cldr.get( "supplemental/likelySubtags/en" );
		});

	});

	describe( "cldr.on( \"get\", listener )", function() {

		it( "should add the listener to the instance `get` event", function( done ) {
			var status = new Error( "Did not listen" );
			function listener( path ) {
				if ( path === "something-from-cldr" ) {
					status = undefined; // Good.
				} else {
					status = new Error( "Eavesdropping another instances" );
				}
			}
			var cldr = new Cldr( "root" ),
				another = new Cldr( "root" );
			cldr.on( "get", listener );
			cldr.get( "something-from-cldr" );
			another.get( "something-from-another" );
			cldr.off( "get", listener );
			setTimeout(function() {
				done( status );
			});
		});

		it( "should pass path and value to the listener", function( done ) {
			function listener( path, value ) {
				if ( path === "supplemental/likelySubtags/en" && value === "en-Latn-US" ) {
					done();
				}
			}
			var cldr = new Cldr( "root" );
			cldr.on( "get", listener );
			cldr.get( "supplemental/likelySubtags/en" );
			cldr.off( "get", listener );
		});

	});

	describe( "cldr.off( \"get\", listener )", function() {

		it( "should remove the specific listener from the instance `get` event", function( done ) {
			var status = new Error( "Also removed wrong listener `listener2`" );
			function listener1() {
				done( new Error( "should not listen `listener1`" ) );
			}
			function listener2() {
				status = undefined; // Good.
			}
			var cldr = new Cldr( "root" );
			cldr.on( "get", listener1 );
			cldr.on( "get", listener2 );
			cldr.off( "get", listener1 );
			cldr.get( "something" );
			cldr.off( "get", listener2 );
			setTimeout(function() {
				done( status );
			});
		});

	});

	describe( "cldr.once( \"get\", listener )", function() {

		it( "should add the listener to the instance `get` event *once*", function( done ) {
			var status = new Error( "Did not listen" );
			function listener( path ) {
				if ( path === "first" ) {
					status = undefined; // Good.
				} else if ( path === "second" ) {
					status = new Error( "Listened twice" );
				}
			}
			var cldr = new Cldr( "root" );
			cldr.once( "get", listener );
			cldr.get( "first" );
			cldr.get( "second" );
			setTimeout(function() {
				done( status );
			});
		});

		it( "should pass path and value to the listener", function( done ) {
			function listener( path, value ) {
				if ( path === "supplemental/likelySubtags/en" && value === "en-Latn-US" ) {
					done();
				}
			}
			var cldr = new Cldr( "root" );
			cldr.once( "get", listener );
			cldr.get( "supplemental/likelySubtags/en" );
		});

	});

});
