var fakeContactData='{"name": "Fritz Ahorn","email": "fritz@ahorn.com","nameOfAccountOwner": "Fritz Ahorn","iban": "DE88700700240823300900","bic": "DEUTDEDBMUC"}';

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
});
$$('#ViewShare').on('show', function () {
	
});

loadContacts();

// In page events:
$$(document).on('pageBeforeAnimation', function (e) {
	var page = e.detail.page;
	if (page.name === 'transferdraft') {
		$$(page.container).find("#amount-reset").click(function() {
			$$(page.container).find("#amount").val("0.00");
			$$(page.container).find("#purpose").val("Default Transfer");
			$$(page.container).find("#amount-confirmation").text("0.00 €");
			$$(page.container).find("#purpose-confirmation").text("Default Transfer");
		});
		$$(page.container).find("#transfer-submit").click(function() {
			$$(page.container).find(".editable").hide();
			$$(page.container).find(".confirmation").show();
		});
		$$(page.container).find("#transfer-edit").click(function() {
			$$(page.container).find(".confirmation").hide();
			$$(page.container).find(".editable").show();
		});
		$$(page.container).find("#amount").change(function() {
			$$(page.container).find("#amount-confirmation").text($$(page.container).find("#amount").val()+" €");
		});
		$$(page.container).find("#purpose").change(function() {
			$$(page.container).find("#purpose-confirmation").text($$(page.container).find("#purpose").val());
		});
		$$(page.container).find(".amount-select").click(function() {
			$$(page.container).find("#amount").val((parseFloat($$(page.container).find("#amount").val())+parseInt($(this).find("button").attr("data-value"))).toFixed(2));
			$$(page.container).find("#amount-confirmation").text($$(page.container).find("#amount").val()+" €");
		});
		$("#purpose").click(function () {
			$(this).select();
		});
	}
	if (page.name === 'addcontact') {
		$$(page.container).find("#add-contact-reset").click(function() {
			$$(page.container).find("#contact-name").val("");
			$$(page.container).find("#contact-iban").val("");
			$$(page.container).find("#contact-bic").val("");
			$$(page.container).find("#contact-email").val("");
		});
		var savecontact=true;
		$$(page.container).find("#add-contact-save").click(function() {
			if(savecontact){
				//savecontact=false;
				var contact = new Object();
				contact.name = $$(page.container).find("#contact-name").val();
				contact.email = $$(page.container).find("#contact-email").val();
				contact.nameOfAccountOwner = $$(page.container).find("#contact-name").val();
				contact.iban = $$(page.container).find("#contact-iban").val();
				contact.bic = $$(page.container).find("#contact-bic").val();
				saveContact(JSON.stringify(contact));
			}
		});
	}
});

document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {

}

$("#scan-qr").click(function() {
        startScan();
		//alert("scanning");
		//openNewContact(fakeContactData);
});

function loadContacts(){
	dbAPI.contacts.getAll(function(sucess, data, error){
		
		//Clear Contact list
		$("#ViewContacts ul").html("");
		
		// Loop Contacts
		$.each( data.items, function( id, contact ) {
			
			// Create Contact List Item
			var li=null;
			li=$('<li></li>');
			//li.addClass('swipeout');
			li.append('<a></a>');
			li.find("a").addClass('swipeout-content')
			.attr("href","sites/transfer-draft.html")
			.attr("data-context",JSON.stringify(contact))
			.append('<span class="contact-img"><i class="icon ion-android-person"></i></span>')
			.append('<span class="contact-name">'+contact.name+'</span>');
			li.append('<div class="swipeout-actions-left"><a href="#" class="delete" data-id="'+contact.id+'">Delete</a></div>');
			
			// Append Contact to list
			$("#ViewContacts ul").append(li);
		});
	});
}

function startScan() {
	cordova.plugins.barcodeScanner.scan(
		function (result) {
			//alert(JSON.stringify(result.text)+" | "+result.format+" | "+result.cancelled+" | "+result.text);
			//var obj=jQuery.parseJSON(result.text);
			openNewContact(result.text);
		}, 
		function (error) {
			alert("Scanning failed: " + error);
		}
	);
}

function openNewContact(data){
	var obj=jQuery.parseJSON(data);
	myApp.getCurrentView().router.load({
		url: "sites/add-contact.html",
		context: {
			name: obj.name,
			iban: obj.iban,
			bic: obj.bic,
			email: obj.email,
		}
	});
}

function saveContact(data){
	alert(data);
	var obj=jQuery.parseJSON(data);
	dbAPI.contacts.post(obj, function(success,data,err){
		if(success){
			alert(obj.name+" saved");
			$("#add-contact-reset").click();
			ViewContacts.router.back();
			loadContacts();
		} else {
			alert("Failure"+err);
		}
	});
}