var dbAPI = (function() {
	var access_token = 'ca8cc066843b29c86e4fb08054d4ef91';
	var access_token = 'b1e3f6f4db98e5799ca7433f33c1f5'; //1 - Hans März
	var apiURI = "https://thebankapi.com:8443/api/0.1.0";
	var getRequest = function(url) {
		var deferred = $.Deferred();
		$.ajax({
			url: url,
			type: 'GET',
			dataType: 'json',
			beforeSend: function(xhr) {
				xhr.setRequestHeader('Authorization', 'Bearer '+access_token);
			},
			success: function(data) {
				deferred.resolve(data);
			},
			error: function(response) {
				deferred.reject(response);
			}
		});
		return deferred.promise();
	}
	dbAPI = {
		contacts: {
			getAll:function(callback) {
				getRequest(apiURI+ "/contacts")
				.done(function(data) 	 {callback(true, data, null);})
				.fail(function(response) {callback(false, null, response);})
			},
			get: function(id, callback) {
				getRequest("https://thebankapi.com:8443/api/0.1.0/contacts/"+id)
				.done(function(data) 	 {callback(true, data, null);})
				.fail(function(response) {callback(false, null, response);})
			},
			post: function(contactdata){
				return 5; //the id
			},
			put: function(id, contactdata){
				return; //yolo
			}
		}
	};
	return dbAPI; 
})();