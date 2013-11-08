var mocks = {
	fakeHttp: function(callback, response){
		var calls = [];
		var httpResult = {
			success: function(responseHandler){
				responseHandler(response);
			}
		};
		var captureCallback = function(url, verb, data){
			if(data) 
				calls.push({url:url, verb:verb, data:data});
			else
				calls.push({url:url, verb:verb});
			callback(url, verb, calls, data);
			return httpResult;
		};
		return {
			get: function(url){
				return captureCallback(url, 'GET');
			},
			post: function(url, data){
				return captureCallback(url, 'POST', data);
			}
		};
	},

	fakeInterval: function(callback, timeout) {
		callback();
	},

	fakeModal: function(assertion, dialogResult){
		return {
			open: function(modalDialog){
				assertion(modalDialog);
				return {
					result: {
						then: function(callback){
							callback(dialogResult);
						}
					}
				};			
			}
		};
	}
};
