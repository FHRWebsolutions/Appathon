var dbAPI = (function() {
	var access_token = 'ca8cc066843b29c86e4fb08054d4ef91';
	var access_token = 'b1e3f6f4db98e5799ca7433f33c1f5'; //1 - Hans März
	var getRequest = function(url) {
		var deferred = $.Deferred();
		$.ajax({
			url: url,
			type: 'GET',
			dataType: 'json',
			success: function(data) {
				deferred.resolve(data);
			},
			error: function(response) {
				deferred.reject(response.responseJSON);
			},
			beforeSend: function(xhr) {
				xhr.setRequestHeader('Authorization', 'Bearer '+access_token);
			}
		});
		return deferred.promise();
	}
	dbAPI = {
		contacts: {
			getAll:function(callback) {
				//var promise = getRequest("https://thebankapi.com:8443/api/0.1.0/contacts");
				//promise
				getRequest("https://thebankapi.com:8443/api/0.1.0/contacts")
				.done(function(data) {
					callback(data);
				})
				.fail(function(response) {
					callback(response);
				})
				//).done(function(data) {
				//	console.log();
				//}).fail(function(response) {
				//	console.log();
				//});
					
			},
			get: function(id) {
				return "totally the "+id+"-contact!!1";
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