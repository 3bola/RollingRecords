$(document).ready(function() {
	//Variables to hold input values from the form, inside of an user object.
	var user = {
		username: "",
		email: "",
		password: "",
		confPassword: "",
		firstname: "",
		lastname: "",
		mobile_number: "",
		address: "",
		zipcode: "",
		city: "",
		conditions: false
	};
	//Form input value variables
	var usernameVal,
		emailVal,
		mobile_numberVal,
		passwordVal,
		confPasswordVal,
		firstnameVal,
		lastnameVal,
		cityVal,
		zipcodeVal,
		addressVal;
	//Function check for all values in user object. if alll are set then user can post to signup route.
	$("#signUpForm").on("submit", function(event) {
		event.preventDefault();
		checkValues();
	});
	function checkValues() {
		if(user.conditions && user.username !== "" && user.email !== "" && user.mobile_number !== "" && user.address !== "" && user.zipcode !== "" && user.city !== "" && user.password !== "" && user.confPassword !== "" && user.firstname !== "" && user.lastname !== "") {
			$.post("/kayttajahallinta/rekisteroidy", $("#signUpForm").serialize(), function(response) {
				if(response.success === "success") {
					$(".form-control").val("");
					$(".form-control").removeClass("success");
					$("#registerMsg").html(`
						<div class="alert alert-success alert-dismissible fade in" role="alert">
							<button type="button" class="close" data-dismiss="alert" aria-label="Close">
            					<span aria-hidden="true">&times;</span>
          					</button>
							<p>Kiitos, rekisteröinti onnistui.</p>
							<p>Sähköpostiinne on lähetetty, käyttäjätilin aktivointi linkki, joka on voimassa yhden tunnin rekisteröinti hetkestä.</p>
						</div>
					`);
					$("#signUpForm").html("");
					$('html, body').animate({ scrollTop: 0 }, 'medium');				
				} else {
					$("#registerMsg").html(`
						<div class="alert alert-danger alert-dismissible fade in" role="alert">
							<button type="button" class="close" data-dismiss="alert" aria-label="Close">
            					<span aria-hidden="true">&times;</span>
          					</button>
							<p>Hups, Jokin meni pieleen rekisteröinnissä.</p>
						</div>
					`);	
				}
			});
		} else {
			$("#registerMsg").html(`
				<div class="alert alert-danger alert-dismissible fade in" role="alert">
					<button type="button" class="close" data-dismiss="alert" aria-label="Close">
            			<span aria-hidden="true">&times;</span>
          			</button>
					<p>Varmista, että kaikki pakolliset kentät ovat täytetty.</p>
				</div>
			`);
		}
	}
	//Functions to validate input values once they change
	//Check from database if username or email is already registered.
	$("#username").on("change", function() {
		usernameVal = $("#username").val();
		if(usernameVal === "" || !/^[a-zA-Z0-9]{2,12}$/.test(usernameVal)) {
			$("#username").removeClass("success");
			$("#username").addClass("error");
			$("#usernameErr").html("Käyttäjätunnuksen on oltava 2-12 merkkiä pitkä ja se voi sisältää kirjaimia a-z, A-Z sekä numeroita 0-9.");
			$("#username").val("");
			user.username = "";
		} else {
			$.post("/kayttajahallinta/compareuname", $("#signUpForm").serialize(), function(response) {
				if(response === "success") {
					$("#usernameErr").html("");
					$("#username").removeClass("error");
					$("#username").addClass("success");
					user.username = usernameVal;
				} else {
					$("#username").removeClass("success");
					$("#username").addClass("error");
					$("#usernameErr").html("Käyttäjätunnus <strong>'"+usernameVal+"'</strong> on jo rekisteröity.");
					$("#username").val("");
					user.username = "";
				}
			});
		}
	});
	$("#email").on("change", function() {
		emailVal = $("#email").val();
		if(emailVal === "" || !/^[a-zA-Z0-9\_\-\.]+@[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,4}$/.test(emailVal)) {
			$("#email").removeClass("success");
			$("#email").addClass("error");
			$("#emailErr").html("'"+emailVal+"', ei vastaa sähköpostiosoitteen vaatimaa formaattia.");
			$("#email").val("");
			user.email = "";
		} else {
			$.post("/kayttajahallinta/compareemail", $("#signUpForm").serialize(), function(response) {
				if(response === "success") {
					$("#email").addClass("success");
					$("#email").removeClass("error");
					$("#emailErr").html("");
					user.email = emailVal;
				} else {
					$("#email").removeClass("success");
					$("#email").addClass("error");
					$("#emailErr").html("Sähköposti <strong>'"+emailVal+"'</strong> on jo rekisteröity.");
					$("#email").val("");
					user.email = "";
				}
			});
		}
	});
		//Set passwords and compare the two
	$("#mobileNumber").on("change", function() {
		mobile_numberVal = $("#mobileNumber").val();
		if(mobile_numberVal === "" || mobile_numberVal.length < 1) {
			$("#mobileNumber").removeClass("success");
			$("#mobileNumber").addClass("error");
			$("#mobileNumberErr").html("Puhelin numero on vaadittu.");
			$("#mobileNumber").val("");
			user.mobile_number = "";
		} else if(mobile_numberVal === "" || !/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im.test(mobile_numberVal)) {
			$("#mobileNumber").removeClass("success");
			$("#mobileNumber").addClass("error");
			$("#mobileNumberErr").html("Antamanne puhelinnumero, ei vastaa Suomen virallista puhelinnuero formaattia.");
			$("#mobileNumber").val("");
			user.mobile_number = "";
		} else {
			$("#mobileNumber").removeClass("error");
			$("#mobileNumber").addClass("success");
			$("#mobileNumberErr").html("");
			user.mobile_number = mobile_numberVal;
		}
	});
	//Set passwords and compare the two
	$("#password").on("change", function() {
		passwordVal = $("#password").val();
		if(passwordVal === "" || passwordVal.length < 8) {
			$("#password").removeClass("success");
			$("#password").addClass("error");
			$("#passwordErr").html("Salasanan on oltava vähintään 8 merkkiä pitkä.");
			$("#password").val("");
			user.password = "";
		} else if(!/^[a-zA-Z0-9\-\_\(\)\;\:]+$/.test(passwordVal)) {
			$("#password").removeClass("success");
			$("#password").addClass("error");
			$("#passwordErr").html("Salasanan voi sisältää kirjaimia a-z, A-Z, numeroita 0-9 sekä erikoismerkeistä : ; _ - ().");
			$("#password").val("");
			user.password = "";
		} else {
			$("#password").removeClass("error");
			$("#password").addClass("success");
			$("#passwordErr").html("");
			user.password = passwordVal;
		}
	});
	$("#confPassword").on("change", function() {
		confPasswordVal = $("#confPassword").val();
		if(confPasswordVal === "" || confPasswordVal !== passwordVal) {
			$("#confPassword").removeClass("success");
			$("#confPassword").addClass("error");
			$("#confPasswordErr").html("Salasanat eivät täsmää.");
			$("#confPassword").val("");
			user.confPassword = "";
		} else {
			$("#confPassword").removeClass("error");
			$("#confPassword").addClass("success");
			$("#confPasswordErr").html("");
			user.confPassword = confPasswordVal;
		}
	});
	//Check firstname and lastname
	$("#firstname").on("change", function() {
		firstnameVal = $("#firstname").val();
		if(firstnameVal === "" || !/^[a-zA-ZäöüÄÖÜß]{2,30}$/.test(firstnameVal)) {
			$("#firstname").removeClass("success");
			$("#firstname").addClass("error");
			$("#firstnameErr").html("Etunimen oltava 2 - 30 merkkiä pitkä ja se voi sisältää vain kirjaimia a-z ja A-Z.");
			$("#firstname").val("");
			user.firstname = "";
		} else {
			$("#firstname").removeClass("error");
			$("#firstname").addClass("success");
			$("#firstnameErr").html("");
			user.firstname = firstnameVal;
		}
	});
	$("#lastname").on("change", function() {
		lastnameVal = $("#lastname").val();
		if(lastnameVal === "" || !/^[a-zA-ZäöüÄÖÜß]{2,30}$/.test(lastnameVal)) {
			$("#lastname").removeClass("success");
			$("#lastname").addClass("error");
			$("#lastnameErr").html("Sukunimen oltava 2 - 30 merkkiä pitkä ja se voi sisältää vain kirjaimia a-z ja A-Z.");
			$("#lastname").val("");
			user.lastname = "";
		} else {
			$("#lastname").removeClass("error");
			$("#lastname").addClass("success");
			$("#lastnameErr").html("");
			user.lastname = lastnameVal;
		}
	});
	$("#address").on("change", function() {
		addressVal = $("#address").val();
		if(addressVal === "" || !/^[a-zA-Z0-9äöüÄÖÜß_ ]{2,50}$/.test(addressVal)) {
			$("#address").removeClass("success");
			$("#address").addClass("error");
			$("#addressErr").html("Katuosoitteen oltava 2 - 50 merkkiä pitkä ja se voi sisältää vain kirjaimia a-Å ja A-Å.");
			$("#address").val("");
			user.address = "";
		} else {
			$("#address").removeClass("error");
			$("#address").addClass("success");
			$("#addressErr").html("");
			user.address = addressVal;
		}
	});
	$("#zipcode").on("change", function() {
		zipcodeVal = $("#zipcode").val();
		if(zipcodeVal === "" || !/^[0-9]{2,30}$/.test(zipcodeVal)) {
			$("#zipcode").removeClass("success");
			$("#zipcode").addClass("error");
			$("#zipcodeErr").html("Postinumeron oltava 2 - 30 merkkiä pitkä ja se voi sisältää vain numeroita 0-9.");
			$("#zipcode").val("");
			user.zipcode = "";
		} else {
			$("#zipcode").removeClass("error");
			$("#zipcode").addClass("success");
			$("#zipcodeErr").html("");
			user.zipcode = zipcodeVal;
		}
	});
	$("#city").on("change", function() {
		cityVal = $("#city").val();
		if(cityVal === "" || !/^[a-zA-ZäöüÄÖÜß-]{2,30}$/.test(cityVal)) {
			$("#city").removeClass("success");
			$("#city").addClass("error");
			$("#cityErr").html("Kaupungin nimen oltava 2 - 30 merkkiä pitkä ja se voi sisältää vain kirjaimia a-z ja A-Z.");
			$("#city").val("");
			user.city = "";
		} else {
			$("#city").removeClass("error");
			$("#city").addClass("success");
			$("#cityErr").html("");
			user.city = cityVal;
		}
	});
	// Validate conditions checkbox
	$("#terms").on("click", function() {
		user.conditions = user.conditions === false ? true : false;
	});
});