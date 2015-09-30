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

var ViewScanQR = myApp.addView('#ViewScanQR', {
    dynamicNavbar: true
});

var ViewShare = myApp.addView('#ViewShare', {
    dynamicNavbar: true
});

$$('#ViewScanQR').on('show', function () {
	//qr load scanner
});

// In page events:
$$(document).on('pageBeforeAnimation', function (e) {
	var page = e.detail.page;
	if (page.name === 'gastro') {
		var contactId=$$(page.container).find('.whatever').data("contact-id");
		var gastroData='{"iban": "DE0000000000000000000","bic":"XXXXXXXXXXXX","mail": "test@test.de"}';
		gastroData = jQuery.parseJSON(gastroData);
	}
});

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
	//alert('device ready');
}