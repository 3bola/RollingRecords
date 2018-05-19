$(document).ready(function() {
	var _URL = window.URL || widndow.webkitURL;
	//Dom element variables
	var imgPreview = $("#imgPreview");
	var imgBtns = $("#imgBtns");
	var imgInput = $("#imageInput");
	var submitBtn = $("#submitBtn");
	var form = $("#productCreateForm");
	//Product object and cover
	var successMsg = $("#successMsg");
	var cover;
	//On image select function
	form.on("change", "#cover", function(event) {
		if(sizeValid(this, 3000000) && typeValid("cover")) {
			$("#errorMsg").html("");
			var reader = new FileReader();
			reader.onload =function(event) {
				document.getElementById("imgPreview").src = event.target.result;
				$("#imgPreview").on("load", function() {
					$("#errorMsg").html("");
					cropImage(1/1, 400, 400);
					$("#imageInput").hide();
					$("#submitBtn").hide();
					$("#imgBtns").show();
				}).on("error", function() {
					document.getElementById("imgPreview").src = "";
					reset();
					$("#errorMsg").html("Kuvan latauksessa ilmeni vika.");
				});
			};
			reader.readAsDataURL(this.files[0]);
		}
		widthAndHeightValid(this, 300, 300);
	});
	//Submit image function
	$("#submitImage").on("click", function(event) {
		event.preventDefault();
		cover = $("#imgPreview").cropper("getData", true);
		$.post("/admin/product/data", cover, function(response) {
			if(response === "success") {
				$("#imgPreview").cropper("destroy");
				$("#imgPreview").removeAttr("src");
				$("#imgBtns").hide();
				$("#submitBtn").show();
				$("#imageInput").show();
				$("#imageInput").prop("disabled", true);
				successMsg.html(`
					<div class="alert alert-success alert-dismissible" role="alert">
  						<button type="button" class="close" data-dismiss="alert" aria-label="Close">
  							<span aria-hidden="true">&times;</span>
  						</button>
  						<strong>Onnistui!</strong> 
  						Kuva on onnistuneesti lisätty.
					</div>
				`);
			} else {
				return;
			}
		});
	});
	/* *** WHEN CLICK ON RESET *** */
	$("#resetImage").on("click", function(event) {
		event.preventDefault();
		reset();
	});
	//Crop image
	function cropImage(aspect, minW, minH) {
		$("#imgPreview").cropper({
			aspectRatio: aspect,
			viewMode: 1,
			responsive: true,
			background: true,
			modal: false,
			zoomable: true,
			zoomOnTouch: true,
			cropBoxResizable: true,
			minCropBoxWidth: minW,
      		minCropBoxHeight: minH,
      		ready: function() {
      		}
		});
	};
	//Function to reset cropper data
	function reset() {
		$("#errorMsg").html("");
		$('#imgPreview').cropper('destroy');
    	$("#imgPreview").removeAttr("src");
    	$("#imageInput").show();
    	$("#submitBtn").show();
    	imgInput.prop("disabled", false);
    	imgBtns.hide();
	};
	//Validation functions
	//Validate filesize
	function sizeValid(self, size) {
		if(self.files[0].size > size) {
			reset();
			$("#errorMsg").append(`
				<div class="alert alert-warning alert-dismissible" role="alert">
  					<button type="button" class="close" data-dismiss="alert" aria-label="Close">
  						<span aria-hidden="true">&times;</span>
  					</button>
  					<strong>Varoitus!</strong> 
  					Maksimi sallittu tiedostokoko on 3MB.
				</div>
			`);
			return false;
		} else {
			return true;
		}
	};
	//Validate filetype
	function typeValid(id) {
		var id = id;
		var type = document.getElementById(id).files[0].type;
		type = type.toString();
		if(type !== "image/jpg" && type !== "image/png" && type !== "image/jpeg" && type !== "image/bmp") {
			reset();
			$("#errorMsg").append(`
				<div class="alert alert-warning alert-dismissible" role="alert">
  					<button type="button" class="close" data-dismiss="alert" aria-label="Close">
  						<span aria-hidden="true">&times;</span>
  					</button>
  					<strong>Varoitus!</strong> 
  					Vain '.jpg', '.jpeg', '.png' tai '.bmp' kuvatiedostot ovat sallittuja.
				</div>
			`);
			return false;
		} else {
			return true;
		}
	};
	//Validate width and height of an image
	function widthAndHeightValid(self, width, height) {
		var file,
			image;
		if((file = self.files[0])){
			image = new Image();
			image.onload = function() {
				if(this.width < width || this.height < height) {
					reset();
          			$("#errorMsg").append(`
          				<div class="alert alert-warning alert-dismissible" role="alert">
  							<button type="button" class="close" data-dismiss="alert" aria-label="Close">
  								<span aria-hidden="true">&times;</span>
  							</button>
  							<strong>Varoitus!</strong> 
  								Kuvan koon on oltava vähintään, ${width} * ${height} pikseliä leveä ja korkea.
						</div>
					`);
				}
			};
			image.src = _URL.createObjectURL(file);
		}
	};
	//Scroll to top when product is added.
	form.on("submit", function() {
		$("body").scrollTop(1000);
	});
});
