$(document).ready(function() {
	var editUserInformationForm = $("#editUserInformationForm");
	var editUserInformationBtn = $("#editUserInformationBtn");
	var cancelBtn = $("#cancelBtn");
	var editUserInformationSubmitBtn = $("#editUserInformationSubmitBtn");
	editUserInformationBtn.on("click", function(event) {
		event.preventDefault();
		editUserInformationBtn.hide(800);
		editUserInformationForm.slideDown(1000);
	});
	cancelBtn.on("click", function(event) {
		event.preventDefault();
		editUserInformationForm.slideUp(800);
		editUserInformationBtn.show(1000);
	});
	//Variables to hold input values from the form, inside of an user object.
	var user = {
		email: "",
		firstname: "",
		lastname: "",
		mobile_number: ""
	};
	//Form input value variables
	var emailVal,
		mobile_numberVal,
		firstnameVal,
		lastnameVal;
	function checkValues() {
		checkEmail();
		checkMobileNumber();
		checkFirstName();
		checkLastName();
	}
	checkValues();
	function checkEmail() {
		emailVal = $("#email").val();
		if(emailVal === "" || !/^[a-zA-Z0-9\_\-\.]+@[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,4}$/.test(emailVal)) {
			$("#email").removeClass("success");
			$("#email").addClass("error");
			$("#registerMsg1").html(`
				<div class="alert alert-danger alert-dismissible fade in" role="alert">
					<button type="button" class="close" data-dismiss="alert" aria-label="Close">
            			<span aria-hidden="true">&times;</span>
          			</button>
					<p>Virhe!</p>
					<p>"${emailVal}", ei vastaa sähköpostiosoitteen vaatimaa formaattia.</p>
				</div>
			`);
			$("#email").val("");
			user.email = "";
		} else {
			$("#email").addClass("success");
			$("#email").removeClass("error");
			$("#registerMsg1").html("");
			user.email = emailVal;
			if(user.email !== "" && user.mobile_number !== "" && user.firstname !== "" && user.lastname !== "") {
				editUserInformationSubmitBtn.prop("disabled", false);
			} else {
				editUserInformationSubmitBtn.prop("disabled", true);
			}
		}
	};
	function checkMobileNumber () {
		mobile_numberVal = $("#mobileNumber").val();
		if(mobile_numberVal === "" || mobile_numberVal.length < 1) {
			$("#mobileNumber").removeClass("success");
			$("#mobileNumber").addClass("error");
			$("#registerMsg2").html(`
				<div class="alert alert-danger alert-dismissible fade in" role="alert">
					<button type="button" class="close" data-dismiss="alert" aria-label="Close">
            			<span aria-hidden="true">&times;</span>
          			</button>
					<p>Virhe!</p>
					<p>Puhelin numero on vaadittu.</p>
				</div>
			`);
			$("#mobileNumber").val("");
			user.mobile_number = "";
		} else if(mobile_numberVal === "" || !/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im.test(mobile_numberVal)) {
			$("#mobileNumber").removeClass("success");
			$("#mobileNumber").addClass("error");
			$("#registerMsg2").html(`
				<div class="alert alert-danger alert-dismissible fade in" role="alert">
					<button type="button" class="close" data-dismiss="alert" aria-label="Close">
            			<span aria-hidden="true">&times;</span>
          			</button>
					<p>Virhe!</p>
					<p>Antamanne puhelinnumero, ei vastaa Suomen virallista puhelinnuero formaattia.</p>
				</div>
			`);
			$("#mobileNumber").val("");
			user.mobile_number = "";
		} else {
			$("#mobileNumber").removeClass("error");
			$("#mobileNumber").addClass("success");
			$("#registerMsg2").html("");
			user.mobile_number = mobile_numberVal;
			if(user.email !== "" && user.mobile_number !== "" && user.firstname !== "" && user.lastname !== "") {
				editUserInformationSubmitBtn.prop("disabled", false);
			} else {
				editUserInformationSubmitBtn.prop("disabled", true);
			}
		}
	};
	function checkFirstName () {
		firstnameVal = $("#firstname").val();
		if(firstnameVal === "" || !/^[a-zA-ZäöüÄÖÜß]{2,30}$/.test(firstnameVal)) {
			$("#firstname").removeClass("success");
			$("#firstname").addClass("error");
			$("#registerMsg3").html(`
				<div class="alert alert-danger alert-dismissible fade in" role="alert">
					<button type="button" class="close" data-dismiss="alert" aria-label="Close">
            			<span aria-hidden="true">&times;</span>
          			</button>
					<p>Virhe!</p>
					<p>Etunimen oltava 2 - 30 merkkiä pitkä ja se voi sisältää vain kirjaimia a-z ja A-Z.</p>
				</div>
			`);
			$("#firstname").val("");
			user.firstname = "";
		} else {
			$("#firstname").removeClass("error");
			$("#firstname").addClass("success");
			$("#registerMsg3").html("");
			user.firstname = firstnameVal;
			if(user.email !== "" && user.mobile_number !== "" && user.firstname !== "" && user.lastname !== "") {
				editUserInformationSubmitBtn.prop("disabled", false);
			} else {
				editUserInformationSubmitBtn.prop("disabled", true);
			}
		}
	};
	function checkLastName () {
		lastnameVal = $("#lastname").val();
		if(lastnameVal === "" || !/^[a-zA-ZäöüÄÖÜß]{2,30}$/.test(lastnameVal)) {
			$("#lastname").removeClass("success");
			$("#lastname").addClass("error");
			$("#registerMsg4").html(`
				<div class="alert alert-danger alert-dismissible fade in" role="alert">
					<button type="button" class="close" data-dismiss="alert" aria-label="Close">
            			<span aria-hidden="true">&times;</span>
          			</button>
					<p>Virhe!</p>
					<p>Sukunimen oltava 2 - 30 merkkiä pitkä ja se voi sisältää vain kirjaimia a-z ja A-Z.</p>
				</div>
			`);
			$("#lastname").val("");
			user.lastname = "";
		} else {
			$("#lastname").removeClass("error");
			$("#lastname").addClass("success");
			$("#registerMsg4").html("");
			user.lastname = lastnameVal;
			if(user.email !== "" && user.mobile_number !== "" && user.firstname !== "" && user.lastname !== "") {
				editUserInformationSubmitBtn.prop("disabled", false);
			} else {
				editUserInformationSubmitBtn.prop("disabled", true);
			}
		}
	};
	//Functions to validate input values once they change
	//Check from database if username or email is already registered.
	$("#email").on("change", function() {
		checkValues();
	});
	//Set passwords and compare the two
	$("#mobileNumber").on("change", function() {
		checkValues();
	});
	//Check firstname and lastname
	$("#firstname").on("change", function() {
		checkValues();
	});
	$("#lastname").on("change", function() {
		checkValues();
	});
});