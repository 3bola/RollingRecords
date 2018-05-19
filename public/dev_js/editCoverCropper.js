$(document).ready(function() {
	var _URL = window.URL || window.webkitURL;
	//Dom elements as variables
	var imagePreview = $("#imagePreview");
	var imageButtons = $("#imageButtons");
	var selectImage = $("#selectImage");
	var submitButton = $("#submitButton");
	var imageUploadForm = $("#imageUploadForm");
	// variables to hold temporary data:
	var id = $("#product_id").val();
	var errorMessage = $("#errorMessage");
	var successMessage = $("#successMessage");
	var coverImageInput = $("#coverImageInput");
	var coverImage;
	//Event Listeners
	$("#imageUploadForm").on("change", "#coverImageInput", function(event) {
		if(sizeValidation(this, 3000000) && typeValidation("coverImageInput")) {
			errorMessage.html("");
			var reader = new FileReader();
			reader.onload = function(event) {
				document.getElementById("imagePreview").src = event.target.result;
				$("#imagePreview").on("load", function() {
					errorMessage.html("");
					cropImage(1/1, 576, 576);
					selectImage.hide(500);
					submitButton.hide(500);
					imageButtons.show(500);
				}).on("error", function() {
					document.getElementById("imagePreview").src = "";
					resetImage();
					errorMessage.html(`
						<div class="alert alert-warning alert-dismissible" role="alert">
  							<button type="button" class="close" data-dismiss="alert" aria-label="Close">
  								<span aria-hidden="true">&times;</span>
  							</button>
  							<strong>Varoitus!</strong> 
  							Kuvan latauksessa ilmeni vika.
						</div>	
					`);
				});
			};
			reader.readAsDataURL(this.files[0]);
		}
		widthAndHeightValidation(this, 300, 300);
	});
	//even listener for cropped image submission
	$("#cropImage").on("click", function(event) {
		event.preventDefault();
		coverImage = $("#imagePreview").cropper("getData", true);
		var id = $("#product_id").val();
		$.post("/admin/product/data", coverImage, function(response) {
			if(response === "success") {
				$("#imagePreview").cropper("destroy");
				$("#imagePreview").removeAttr("src");
				imageButtons.hide(500);
				submitButton.show(600);
				selectImage.show();
				$("#selectImage").prop("disabled", true);
				successMessage.html(`
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
		})
	});
	//Event listener for image reset click
	$("#resetImageSelection").on("click", function(event) {
		event.preventDefault();
		resetImage();
	});
	//Helper functions
	// Reset function
	function resetImage() {
		errorMessage.html("");
		successMessage.html("");
		$("#imagePreview").cropper("destroy");
		$("#imagePreview").removeAttr("src");
		selectImage.show(500);
		$("#selectImage").prop("disabled", false);
		submitButton.show(500);
		imageButtons.hide(500);
	};
	//Crop acceptedImage
	function cropImage(aspect, minW, minH) {
		$("#imagePreview").cropper({
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
	//File validation functions
	//Validate file size in MB
	function sizeValidation (self, size) {
		if(self.files[0].size > size) {
			resetImage();
			errorMessage.html(`
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
	//Validate file type by file exctencion
	function typeValidation (id) {
		var id = id;
		var type = document.getElementById(id).files[0].type;
		type = type.toString();
		if(type !== "image/jpg" && type !== "image/jpeg" && type !== "image/png" && type !== "image/bmp") {
			resetImage();
			errorMessage.html(`
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
	//Validate images width and height by pixels 300px x 300px is minimum
	function widthAndHeightValidation (self, width, height) {
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
	$("#imageUploadForm").on("submit", function() {
		$("body").scrollTop(1000);
	})
});