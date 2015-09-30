var dbAPI = (function() {
	//var access_token = 'ca8cc066843b29c86e4fb08054d4ef91';
	//var access_token = 'b1e3f6f4db98e5799ca7433f33c1f5'; //1 - Hans März
	//dbAPI.setToken('b1e3f6f4db98e5799ca7433f33c1f5'); //1 - Hans März
	
	//var access_token = '942c2593237ae6d5daddeed781fa3658';
	var access_token = localStorage.ecat_access_token;
	
	//alert("THIS IS dbAPI file");
	//if(localStorage.ecat_access_token != null) {
	//	alert("The local storage is not null");
	//	creation_timestamp = localStorage.ecat.creation_timestamp;
	//	tempToken = localStorage.ecat.access_token;
	//	duration = localStorage.ecat.expires_in;
	//	
	//	if(creation_timestamp+duration*1000 < Date.now()) {
	//		//Access token expired
	//		authenticator.refresh_token();
	//		.done(function(data){
	//			callback(true, data, null);
	//		});
	//		access_token = localStorage.ecat_access_token;
	//	} else {
	//		//Access token should still be valid
	//		access_token = tempToken;
	//	}
	//} else {
	//	alert("The local storage is empty");
	//}
	//alert("Still alive X");
	
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
				deferred.reject(response.responseJSON);
			}
		});
		return deferred.promise();
	}
	var postRequest = function(url, data) {
		var deferred = $.Deferred();
		$.ajax({
			url: url,
			type: 'POST',
			dataType: 'json',
			data: data,
			beforeSend: function(xhr) {
				xhr.setRequestHeader('Authorization', 'Bearer '+access_token);
			},
			success: function(data) {
				deferred.resolve(data);
			},
			error: function(response) {
				deferred.reject(response.responseJSON);
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
		},
		cashAccounts: {
			makeTransaction:function(accountID, data, callback){
				getRequest("https://thebankapi.com:8443/api/0.1.0/cashAccounts/"+accountID+"/fundTransfers",data)
				.done(function(data) 	 {callback(true, data, null);})
				.fail(function(response) {callback(false, null, response);})
			}
		},
		setToken: function(token) {
			access_token = token;
		}
	};
	return dbAPI; 
})();