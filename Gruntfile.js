module.exports = function(grunt) {

	"use strict";

	var mountFolder = function ( connect, path ) {
		return connect.static( require( "path" ).resolve( path ) );
	};

	grunt.initConfig({
		pkg: grunt.file.readJSON( "package.json" ),
		connect: {
			options: {
				port: 9001,
				hostname: "localhost"
			},
			test: {
				options: {
					middleware: function ( connect ) {
						return [
							mountFolder( connect, "." ),
							mountFolder( connect, "test" )
						];
					}
				}
			}
		},
		jshint: {
			source: {
				src: [ "src/**/*.js" ],
				options: {
					jshintrc: "src/.jshintrc"
				}
			},
			grunt: {
				src: [ "Gruntfile.js" ],
				options: {
					jshintrc: ".jshintrc"
				}
			},
			test: {
				src: [ "test/**/*.js" ],
				options: {
					jshintrc: "test/.jshintrc"
				}
			}
		},
		mocha: {
			all: {
				options: {
					urls: [ "http://localhost:<%= connect.options.port %>/index.html" ]
				}
			}
		}
	});

	require( "matchdep" ).filterDev( "grunt-*" ).forEach( grunt.loadNpmTasks );

	grunt.registerTask( "test", [
		"connect:test",
		"mocha"
	]);

	grunt.registerTask( "default", [ "jshint", "test" ] );

};

