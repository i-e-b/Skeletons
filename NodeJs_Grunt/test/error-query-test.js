var assert = require('assert'),
	subject = require('../lib/services/error-query'),
	config = require('../lib/config'),
	_ = require('underscore'),
	mongoDbHelper = require('./mongo-db-helper');

describe('error query', function () {
	var amountPerQuery = 25,
	collection = 'ProductLinkingErrors';

	beforeEach(function (done) {
		if (config.mongoServer.indexOf('prod') !== -1) throw "woah there, using production config!";
		var items = [];
		for (var i = 0; i < amountPerQuery; i++) {
			items.push({ PcpxProductId: i, Date: new Date() });
		}
		mongoDbHelper.setupCollectionWithItems(collection, items, done);
	});

	it('should only get the page size amount of items', function (done) {
		mongoDbHelper.saveItems(collection, [{ PcpxProductId: 999, Date: new Date(999)}], function () {
			var pageSize = 6;
			subject({ offset: 0, pageSize: 6 }, function (err, resourse) {
				assert.equal(resourse.errors.length, 6);
				done();
			});
		});
	});

	it('should contain the total items', function (done) {
		mongoDbHelper.saveItems(collection, [{ PcpxProductId: 999, Date: new Date(999)}], function () {
			subject({ offset: 0, pageSize: amountPerQuery }, function (err, result) {
				assert.equal(result.totalErrors, amountPerQuery + 1);
				done();
			});
		});
	});

	it('should order the items by date', function (done) {
		var oldItem = { PcpxProductId: 77, Date: new Date(1999, 1, 1) };

		mongoDbHelper.saveItems(collection, [oldItem], function () {
			subject({ offset: 0, pageSize: amountPerQuery }, function (err, result) {
				assert.equal(result.errors.length, amountPerQuery);
				result.errors.forEach(function (item) {
					assert.notDeepEqual(item, oldItem);
				});
				done();
			});
		});
	});

	it('should offset the results', function (done) {
		var oldItem = { PcpxProductId: 77, Date: new Date(1999, 1, 1) };

		mongoDbHelper.saveItems(collection, [oldItem], function () {
			subject({ offset: amountPerQuery, pageSize: amountPerQuery }, function (err, result) {
				assert.equal(result.totalErrors, amountPerQuery + 1);
				assert.equal(result.errors.length, 1);
				assert.equal(result.errors[0].PcpxProductId, oldItem.PcpxProductId);
				assert.equal(result.errors[0].IsLive, oldItem.IsLive);
				assert.equal(result.errors[0].Date.getTime(), oldItem.Date.getTime());
				done();
			});
		});
	});

	it('should treat offset as zero if not a number', function (done) {
		subject({ offset: 'yo mum', pageSize: amountPerQuery }, function (err, result) {
			assert.equal(result.totalErrors, amountPerQuery);
			assert.equal(result.errors.length, amountPerQuery);
			done();
		});
	});

	it('should build the error description and error type from the missing files data if missing files', function (done) {
		var item = {
			_t: 'MissingFilesLinkingQueueItem',
			PcpxProductId: 456,
			MissingFiles: [
				{ _t: "MissingFileDetails", TrackId: 17903076, FormatId: 5 },
				{ _t: "MissingFileDetails", TrackId: 17903076, FormatId: 15 }
			],
			Date: new Date()
		};

		var expectedUrls = _.map(item.MissingFiles, function (missingFile) {
			return 'track:' + missingFile.TrackId + ' format:' + missingFile.FormatId;
		});

		var urlExistsInErrorDescription = function (url, errorDetails) {
			return errorDetails.indexOf(url) !== -1;
		};

		mongoDbHelper.deleteAllItemsFromCollection(collection, function () {
			mongoDbHelper.saveItems(collection, [item], function () {
				subject({ offset: 0, pageSize: amountPerQuery }, function (err, result) {
					expectedUrls.forEach(function (url) {
						assert.equal(urlExistsInErrorDescription(url, result.errors[0].ErrorDetails), true, 'Url is not present in error description');
					});
					result.errors.forEach(function(errorItem) {
						assert.equal(errorItem.Type, 'Missing files', 'Wrong item type');
					});
					done();
				});
			});
		});
	});
	
	it('should get the error type for linking failures', function (done) {
		var expectedType = 'Some type';
		var expectedDetail = 'whatever';
		var item = {
			_t: 'FailedProductLinkingQueueItem',
			PcpxProductId: 456,
			Explanation: { Reason: expectedType, Detail: expectedDetail}
		};
		mongoDbHelper.deleteAllItemsFromCollection(collection, function () {
			mongoDbHelper.saveItems(collection, [item], function () {
				subject({ offset: 0, pageSize: amountPerQuery }, function (err, result) {
					result.errors.forEach(function (error) {
						assert.equal(error.Type, expectedType, 'Wrong item type');
						assert.equal(error.ErrorDetails.length, 1);
						assert.equal(error.ErrorDetails[0], expectedDetail);
					});
					done();
				});
			});
		});
	});
});
