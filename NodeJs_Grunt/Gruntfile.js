var fs = require('fs');

module.exports = function configureTasks(grunt) {
	var externalClientLibraryRoot = 'lib/client/vendor/';
	var clientLibraryRoot = 'lib/client/js/lib/';
	var coreLibraries = [
		externalClientLibraryRoot + 'jquery/jquery.min.js',
		externalClientLibraryRoot + 'floatThead/jquery.floatThead.min.js',
		externalClientLibraryRoot + 'angular/angular.min.js',
		externalClientLibraryRoot + 'lodash/dist/lodash.min.js',
		clientLibraryRoot + 'floating-header.js' ];
		
	var allFiles = [ '!lib/client/js/built/**/*.js', '*.js', 'lib/js/**/*.js', 'lib/client/js/**/*.js', 'test/**/*.js', 'bin/*.js', 'client-tests/**/*.js' ];
	var sourceFiles = [ 'lib/**/*.js' ];
	var testFiles = [ 'test/**/*.js'];

	grunt.initConfig({
		env:{
			dev: {
				environment: 'dev'
			},
			uat: {
				environment:'uat'
			},
			prod: {
				environment: 'prod'
			},
			systest: {
				environment:'systest'
			}
		},
		jsvalidate: {
			files: allFiles
		},
		jshint: {
			files: [ 'lib/services/*.js', 'lib/*.js', 'routes/*.js', 'test/**/*.js', 'lib/client/js/*.js', 'client-tests/*.js' ],
		},
		concat: {
			blacklisted: {
				src: coreLibraries.concat(['lib/client/js/blacklisted-products.js']),
				dest: 'lib/client/js/built/blacklisted-products.js'
			}//, other responders...
		},
		simplemocha: {
			all: {
				src: testFiles,
				options: {
					ignoreleaks: false,
					ui: 'bdd',
					reporter: 'spec'
				}
			},
			smoke: {
				src: ['smoke-tests/*.js'], 
				options:{ui:'bdd', reporter: 'spec'}
			}
		},
		karma: {
			unit: {
				configFile: 'karma.conf.js',
				singleRun: true
			}
		},
		watch: {
			files: allFiles,
			tasks: [ 'jshint', 'simplemocha:all', 'concat', 'karma' ]
		}
	});

	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

	grunt.registerTask('default', [
		'env:dev',
		'jsvalidate',
		'jshint',
		'simplemocha:all',
		'karma',
		'concat'
	]);

	grunt.registerTask('setupdev', function installGitHooks() {
		fs.writeFileSync('.git/hooks/pre-commit', 'grunt');
		fs.chmodSync('.git/hooks/pre-commit', '755');
	});
};

