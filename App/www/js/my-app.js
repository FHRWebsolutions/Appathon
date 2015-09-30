// Initialize your app
var myApp = new Framework7({
	scrollTopOnStatusbarClick: true,
	template7Pages: true
});

// Export selectors engine
var $$ = Dom7;

// Add view
var ViewContacts = myApp.addView('#ViewContacts', {
    dynamicNavbar: true
});

var ViewShare = myApp.addView('#ViewShare', {
    dynamicNavbar: true
});

$$('#ViewContacts').on('show', function () {
	loadContacts();
	alert("test");
});

loadContacts();

// In page events:
$$(document).on('pageBeforeAnimation', function (e) {
	var page = e.detail.page;
	if (page.name === 'gastro') {
		var contactId=$$(page.container).find('.whatever').data("contact-id");
		var contactData='{"iban": "DE0000000000000000000","bic":"XXXXXXXXXXXX","mail": "test@test.de"}';
		contactData = jQuery.parseJSON(contactData);
	}
});

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
	/*$("#asdf").click(function() {
        //startScan();
		alert("test");
    });*/
}
$("#token-refresh").click(function() {
        authenticator.refresh_token().done(function(){
			//maybe optional
		});
    });

function loadContacts(){
	dbAPI.contacts.getAll(function(sucess, data, error){
		
		// Loop Contacts
		$.each( data.items, function( id, contact ) {
			
			// Create Contact List Item
			var li=null;
			li=$('<li></li>');
			li.append('<a></a>');
			li.find("a")
			.attr("href","sites/transfer-draft.html")
			.attr("data-context",JSON.stringify(contact))
			.append('<span class="contact-img"><i class="icon ion-android-person"></i></span>')
			.append('<span class="contact-name">'+contact.name+'</span>');
			
			// Append Contact to list
			$("#ViewContacts ul").append(li);
		});
	});
}

function startScan() {
	alert("start scan");
	cordova.plugins.barcodeScanner.scan(
		function (result) {
			//alert(JSON.stringify(result.text)+" | "+result.format+" | "+result.cancelled+" | "+result.text);
			var obj=jQuery.parseJSON(result.text);
			alert(obj.iban);
		}, 
		function (error) {
			alert("Scanning failed: " + error);
		}
	);
}