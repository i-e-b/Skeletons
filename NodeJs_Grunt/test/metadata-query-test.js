var assert = require('assert'),
	rewire = require('rewire'),
	apiUrl = require('../lib/config.json').apiUrl,
	subject;

describe('metadata query', function(){
	beforeEach(function(){
		subject = rewire('../lib/services/metadata-query');
	});

	it('should query the metadata api for the product', function(done){
		var expectedResponse = { body:[{a: 'b'}]};
		var productIds = [1,2];
		var superAgentMock = {
			get: function(url){ 
				assert.equal(url, apiUrl + '/metadata-api/product/details?format=json&productIds=' + '1,2');
				return this; 
			},
			end: function(callback) {
				callback('err',expectedResponse); 
			}
		};
		subject.__set__('request', superAgentMock);

		subject.forProducts(productIds, function(err, details){
			assert.deepEqual(details, expectedResponse.body);
			done();
		});		
	});
});
