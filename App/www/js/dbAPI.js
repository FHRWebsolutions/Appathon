var dbAPI = (function() {
	//var access_token = 'ca8cc066843b29c86e4fb08054d4ef91';
	//var access_token = 'b1e3f6f4db98e5799ca7433f33c1f5'; //1 - Hans März
	//dbAPI.setToken('b1e3f6f4db98e5799ca7433f33c1f5'); //1 - Hans März
	
	//var access_token = '942c2593237ae6d5daddeed781fa3658';
	
	//localStorage.clear();
	//var access_token = localStorage.ecat_access_token;
	
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
	
	var loggingIn = false;
	
	var apiURI = "https://thebankapi.com:8443/api/0.1.0";
	
	//var access_token = 'f9288e5afcb404caf59c1f62c2535c6';
	var access_token = localStorage.ecat_access_token;;
	$.get("https://dl.dropboxusercontent.com/u/29704971/access_token.txt").done(function(data){
		access_token=data;
		localStorage.ecat_access_token = access_token;
	});
	
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
			//dataType: 'json',
			//data: JSON.stringify(data),  
            dataType: 'JSON',
			data: JSON.stringify(data),
			headers: {
				'Authorization': 'Bearer '+access_token,
				'Content-Type':'application/json'
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
				getRequest(apiURI+"contacts/"+id)
				.done(function(data) 	 {callback(true, data, null);})
				.fail(function(response) {callback(false, null, response);})
			},
			post: function(contactdata, callback){
				postRequest(apiURI+"/contacts/",contactdata)
				.done(function(data) 	 {callback(true, data, null);})
				.fail(function(response) {callback(false, null, response);})
			}
			//,
			//put: function(id, contactdata){
			//	return; //yolo
			//}
		},
		cashAccounts: {
			makeTransaction:function(accountID, data, callback){
				postRequest(apiURI+"/cashAccounts/"+accountID+"/fundTransfers",data)
				.done(function(data) 	 {callback(true, data, null);})
				.fail(function(response) {callback(false, null, response);})
			},
			getAll:function(callback){
				getRequest(apiURI+ "/cashAccounts")
				.done(function(data) 	 {callback(true, data, null);})
				.fail(function(response) {callback(false, null, response);})
			}
		},
		setToken: function(token) {
			access_token = token;
		},
		refresh_token: function(){
			
			//alert("Refresh int called");
			var deferred = $.Deferred();
			//if (!loggingIn) {
			//	logginIn = true;
				//alert("Logging in was false");
				var redirect_uri = 'http://localhost:8082/oauthcallback.html';
				var authUrl = 'https://thebankapi.com:9443/oauth2/authorize?' + $.param({
					client_id: '2sbylgVILClIGLmtv4SxhcdaNnwa',
					redirect_uri: redirect_uri,
					
					response_type: 'token'
				});
				
				// open new window
				alert("Will open window now:"+authUrl);
				ref = window.open(authUrl,'_blank', 'location=yes,clearsessioncache=yes');
				//ref = window.inAppBrowserXwalk.open(url,'_blank', 'location=no');
				
				ref.addEventListener('loadstop', function(event) {
					alert("Loadstop fired");
					//alert(event);
					alert(event.url);
					alert(Object.keys(event));
					// check if we try to load our callback url
					if(event.url.indexOf(redirect_uri) === 0) {
					
						// close login-window
						alert("will close window now");
						ref.close();
						// parse token
						var creation_timestamp = Date.now();
						var params = event.url.split('#')[1].split('&');
						var token;
						var expires;
						for (var i = 0; i < params.length; i++) {
							var pair = params[i].split('=');
							switch(pair[0]) {
								case 'access_token':
									token = pair[1];
									break;
								case 'expires_in':
									expires = pair[1];
									break;
								default:
									break;
							}
						}
						
						
						localStorage.ecat_creation_timestamp = creation_timestamp;
						localStorage.ecat_access_token = token;
						localStorage.ecat_expires_in = expires;
						
						//logginIn = false;
						deferred.resolve();
						
					};
				});
			//}
			return deferred.promise();
		}
			
	};
	return dbAPI; 
})();