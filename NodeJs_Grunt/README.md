Node JS
=======

Node JS site, using angular, jade views, mocha
All automated with grunt.

This was mostly written by Will Munn and Raol Millais


Setup
------
To work with this project, you should install nodejs

It is recomended that you have the following npm modules installed globally:
	`mocha` - test framework + runner
	`bower` - client side package manager
	`grunt` - used to run various tasks
	`jshint` - to check your syntax errors
	`karma` - to run client side tests

to get started, run:
```
npm install
bower install
```
If you wish, you can run grunt setupdev which will add a precommit hook preventing you from commiting any red tests or invalid syntax

To run the tests, run:
```
	npm test
```
To start the website run:
```
	node lib/app.js
```
To install the app without dev dependencies, run:
```
	npm install --production
```

Todo
-----
Setup scripts.