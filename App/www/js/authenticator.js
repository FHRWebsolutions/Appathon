var authenticator = (function() {
	var authenticator = {
		refresh_token: function() {
			var deferred = $.Deferred();
			var redirect_uri = 'http://localhost:8082/oauthcallback.html';
			var authUrl = 'https://thebankapi.com:9443/oauth2/authorize?' + $.param({
				client_id: '2sbylgVILClIGLmtv4SxhcdaNnwa',
				redirect_uri: redirect_uri,
				
				response_type: 'token'
			});
			
			// open new window
			ref = window.open(authUrl,'_blank', 'location=no');
			ref.addEventListener('loadstop', function(event) {
            
				// check if we try to load our callback url
				if(event.url.indexOf(redirect_uri) === 0) {
                
					// close login-window
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
					
					deferred.resolve();
					
				};
			});
			return deferred.promise();
		}
	};
	return authenticator; 
})();