describe('Blacklisted products controller', function() {
	it('should call the api for blacklisted products', function(done) {
		var fakeHttp = mocks.fakeHttp(function(url){
			chai.assert.equal(url,'api/blacklistedproducts', url);
			done();
		});
		BlacklistedProducts({}, fakeHttp);
	});
	
	it('should map the blacklisted products response to the scope', function(done) {
		var scope = {};
		var fakeResponse = {name:'bob'};
		var fakeHttp = mocks.fakeHttp(function(){}, fakeResponse);
		
		BlacklistedProducts(scope, fakeHttp);
		chai.assert.equal(scope.blacklistedProductsResponse, fakeResponse);
		done();
	});
});