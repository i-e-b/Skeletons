function BlacklistedProducts($scope, $http){
	function getBlacklistedProducts(){
		$http.get('api/blacklistedproducts').success(function(response) {
			$scope.blacklistedProductsResponse = response;
		});
	}
	getBlacklistedProducts();
}