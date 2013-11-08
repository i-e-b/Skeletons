var mongodb = require('mongodb'),
	config = require('../lib/config');

exports.setupCollectionWithItems = function (collectionName, items, callback) {
    var mongoClient = mongodb.MongoClient.connect(config.mongoServer, function (err, db) {
        if (err) throw (err);
        var collection = db.collection(collectionName);
        collection.remove({}, function () {
            collection.insert(items, { safe: true }, function (err) {
                if (err) throw err;
                db.close();
                if(callback) callback();
            });
        });
    });
};

exports.deleteAllItemsFromCollection = function (collectionName, callback) {
    var mongoClient = mongodb.MongoClient.connect(config.mongoServer, function (err, db) {
        if (err) throw (err);
        var collection = db.collection(collectionName);
        collection.remove({}, function () {
			db.close();
			if(callback) callback();
        });
    });
};

exports.saveItems = function(collectionName, items, callback){
    var mongoClient = mongodb.MongoClient.connect(config.mongoServer, function (err, db) {
        if (err) throw (err);
        var collection = db.collection(collectionName);
		collection.insert(items, { safe: true }, function (err) {
			if (err) throw err;
			db.close();
			callback();
		});            
    });
};