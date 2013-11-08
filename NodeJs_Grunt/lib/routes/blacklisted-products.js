var mongoDb = require('mongodb'),
	config = require('../config'),
	_ = require('underscore');

var getBlackListedProducts = function(callback){
	mongoDb.MongoClient.connect(config.mongoServer, function (err, db) {
		if (err) callback(err, {});
		var collection = db.collection('BlacklistedProducts');
		collection.find({}).toArray(function(error, products){
			var blackListedProductResults = _.map(products, function (product) {
			return new BlackListedProductResult(product);
		});
			callback(error, blackListedProductResults);
		});
	});
};

var BlackListedProductResult = function(blacklistedProduct){
		this.upc = blacklistedProduct.Upc;
		this.labelGroup = { 
			id: blacklistedProduct.LabelGroup._id,
			name: blacklistedProduct.LabelGroup.Description
		};
};

module.exports = function blacklistedProducts(req, res) {
	getBlackListedProducts(function(err, docs){
		res.send({
			products: docs
		});
	});
}
