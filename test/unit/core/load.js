define([
	"src/core/load"
], function( _load ) {

	describe( "Core load", function() {
		var fakeCldr = {
			_availableBundleMapQueue: []
		};

		function load() {
			return _load( fakeCldr, {}, arguments );
		}

		it( "should load a json entry", function() {
			var source = load({ foo: "bar" });
			expect( source ).to.eql({ foo: "bar" });
		});

		it( "should load arbitrary json parameters, e.g., Cldr.load({...}, {...}, ...)", function() {
			var source = load({ foo: "bar" }, { baz: "qux" });
			expect( source ).to.eql({ baz: "qux", foo: "bar" });
		});

		it( "should load arbitrary jsons via Array, e.g., Cldr.load([{...}, {...}, ...])", function() {
			var source = load([{ foo: "bar" }, { baz: "qux" }]);
			expect( source ).to.eql({ baz: "qux", foo: "bar" });
		});

	});

});
