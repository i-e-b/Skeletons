var request = require('superagent'),
	config = require('../config.json'),
	format = require('util').format,
	_ = require('underscore');

exports.forProducts = function(productIds, callback){
	var url = config.apiUrl + '/metadata-api/product/details?format=json&productIds=' + productIds.join();
	request.get(url)
			.end(function(err, data){
				callback(err, data.body || {});
			});
};
