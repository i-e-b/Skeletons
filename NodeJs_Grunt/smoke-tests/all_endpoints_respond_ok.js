var	request = require('superagent'),
	assert = require('assert'),
	config = require('./config.' + process.env.environment),
	async = require('async');

describe('skeleton', function(){
	it('should respond with ok for api endpoints', function(done){
		var endpoints = [
			'/status'
			];

		async.each(endpoints, function(endpoint, callback){
				var url = config.baseUrl + endpoint;
				request.get(url).end(function(response){
					if(response.ok)
						callback();
					else
						callback(url + ': ' + response.status);
				});
			}, function(err){
				assert.ok(!err,err);
				done();
		});
	});
});
