var assert = require('assert'),
	subject = require('../../lib/routes/blacklisted-products'),
	config = require('../../lib/config'),
	mongoDbHelper = require('../mongo-db-helper'),
	_ = require('underscore');

describe('black listed products', function(){
	var collection = 'BlacklistedProducts',
		items;
	
	beforeEach(function (done) {
		if (config.mongoServer.indexOf('prod') !== -1) throw "woah there, using production config!";
		items = [
			{ Upc: 'test1', LabelGroup: { _id: 20, Description: "Something" } },
			{ Upc: 'test2', LabelGroup: { _id: 30, Description: "SomethingElse" } },
			{ Upc: 'test3', LabelGroup: { _id: 40, Description: "SomethingElseAgain" } }
		];
		mongoDbHelper.setupCollectionWithItems(collection, items, done);
	});

	it('should contain a list of blacklisted products', function(done){
		var response = {
			send: function(body){
				var expected = _.map(items.sort(byUpc), function(item){
					return {
								upc: item.Upc, 
								labelGroup: {
									id: item.LabelGroup._id,
									name: item.LabelGroup.Description
								}
							};
				});
				var actual = body.products.sort(byUpc);
				assert.deepEqual(actual, expected);
				done();
			}
		};
		
		subject({}, response);
	});
	
	var byUpc = function(productA, productB){
		if (productA.upc < productB.upc)
			return -1;
		if (productB.upc < productA.upc)
			return 1;
		return 0;
	};
});