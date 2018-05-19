$(document).ready(function() {
	var product = {
		title: "",
		name: "",
		category: ""
	};
	//Variables to store values of html elements and html elemnts them selves
	$(".nameField").on("change", function() {
		product.name = $("#name").val();
		product.title = $("#title").val();
		product.category = $("#category").val();
		if(product.name && product.title) {
			$.post("/admin/product/checkProductsName", product, function(response) {
				if(response === "success") {
					$("#name").removeClass("error");
					$("#name").addClass("success");
				} else {
					$("#error").html(`
						<div class="alert alert-danger alert-dismissible fade in" role="alert">
							<button type="button" class="close" data-dismiss="alert" aria-label="Close">
            					<span aria-hidden="true">&times;</span>
          					</button>
							<p>Tuote nimellä ${$("#title").val()} - ${$("#name").val()} on jo olemassa.</p>
						</div>
					`);
					$("#name").val("");
					$("#name").removeClass("success");
					$("#name").addClass("error");
				}
			});
		}
	});
});