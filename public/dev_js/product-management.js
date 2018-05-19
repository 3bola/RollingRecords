$(document).ready(function() {
	//Validate new product form
	//Variables to store and show inputs
	var conditionInputs = $(".condition");
	var releaseDate = $(".releaseDate");
	var discountedPrice = $(".discount");
	var oheistarvikkeet = $(".oheistarvikkeet");
	var lp = $(".lp");
	if($("#category").val() === "Oheistarvikkeet" || $("#category").val() === "T-paidat") {
		lp.slideUp(1000);
		$("#conditionCovers").attr("required", false);
		$("#conditionDisk").attr("required", false);
		$("#productName").attr("required", true);
		$("#genre").attr("required", false);
		$("#releasedate").attr("required", false);
		$("#title").attr("required", false);
		$("#quantity").attr("required", false);
		$("#label").attr("required", false);
		$("#name").attr("required", false);
		return oheistarvikkeet.slideDown(1000);
	}else if($("#category").val() === "Käytetyt") {
		lp.slideDown(1000);
		$("#conditionCovers").attr("required", true);
		$("#conditionDisk").attr("required", true);
		$("#productName").attr("required", false);
		$("#releasedate").attr("required", false);
		$("#genre").attr("required", true);
		$("#title").attr("required", true);
		$("#quantity").attr("required", true);
		$("#label").attr("required", true);
		$("#name").attr("required", true);
		releaseDate.slideUp(500);
		discountedPrice.slideUp(500);
		oheistarvikkeet.slideUp(1000);
		return conditionInputs.slideDown(1000);
	}else if($("#category").val() === "Tulevat") {
		lp.slideDown(1000);
		$("#conditionCovers").attr("required", false);
		$("#conditionDisk").attr("required", false);
		$("#productName").attr("required", false);
		$("#title").attr("required", true);
		$("#genre").attr("required", true);
		$("#releasedate").attr("required", true);
		$("#quantity").attr("required", true);
		$("#label").attr("required", true);
		$("#name").attr("required", true);
		conditionInputs.slideUp(500);
		discountedPrice.slideUp(500);
		oheistarvikkeet.slideUp(1000);
		return releaseDate.slideDown(1000);
	} else if($("#category").val() === "Tarjoukset") {
			lp.slideDown(1000);
			$("#releasedate").attr("required", false);
			$("#conditionCovers").attr("required", false);
			$("#conditionDisk").attr("required", false);
			$("#productName").attr("required", false);
			$("#title").attr("required", true);
			$("#genre").attr("required", true);
			$("#quantity").attr("required", true);
			$("#label").attr("required", true);
			$("#name").attr("required", true);
			releaseDate.slideUp(500);
			conditionInputs.slideUp(500);
			oheistarvikkeet.slideUp(1000);
			return discountedPrice.slideDown(1000);
	} else {
		lp.slideDown(1000);
		$("#releasedate").attr("required", false);
		$("#conditionCovers").attr("required", false);
		$("#conditionDisk").attr("required", false);
		$("#productName").attr("required", false);
		$("#genre").attr("required", true);
		$("#title").attr("required", true);
		$("#quantity").attr("required", true);
		$("#label").attr("required", true);
		$("#name").attr("required", true);
		releaseDate.slideUp(500);
		discountedPrice.slideUp(500);
		conditionInputs.slideUp(500);
		oheistarvikkeet.slideUp(1000);
	}
	$("#category").on("change", function() {
		console.log("changing"+this);
		if($("#category").val() === "Käytetyt") {
			lp.slideDown(1000);
			$("#conditionCovers").attr("required", true);
			$("#conditionDisk").attr("required", true);
			$("#releasedate").attr("required", false);
			$("#productName").attr("required", false);
			$("#genre").attr("required", true);
			$("#title").attr("required", true);
			$("#quantity").attr("required", true);
			$("#label").attr("required", true);
			$("#name").attr("required", true);
			releaseDate.slideUp(500);
			discountedPrice.slideUp(500);
			oheistarvikkeet.slideUp(1000);
			return conditionInputs.slideDown(1000);
		} else if($("#category").val() === "Tulevat") {
			lp.slideDown(1000);
			$("#conditionCovers").attr("required", false);
			$("#conditionDisk").attr("required", false);
			$("#productName").attr("required", false);
			$("#releasedate").attr("required", true);
			$("#title").attr("required", true);
			$("#genre").attr("required", true);
			$("#quantity").attr("required", true);
			$("#label").attr("required", true);
			$("#name").attr("required", true);
			conditionInputs.slideUp(500);
			discountedPrice.slideUp(500);
			oheistarvikkeet.slideUp(1000);
			return releaseDate.slideDown(1000);
		} else if($("#category").val() === "Tarjoukset") {
			lp.slideDown(1000);
			$("#releasedate").attr("required", false);
			$("#conditionCovers").attr("required", false);
			$("#conditionDisk").attr("required", false);
			$("#productName").attr("required", false);
			$("#title").attr("required", true);
			$("#genre").attr("required", true);
			$("#quantity").attr("required", true);
			$("#label").attr("required", true);
			$("#name").attr("required", true);
			releaseDate.slideUp(500);
			conditionInputs.slideUp(500);
			oheistarvikkeet.slideUp(1000);
			return discountedPrice.slideDown(1000);
		} else if($("#category").val() === "Oheistarvikkeet" || $("#category").val() === "T-paidat") {
			$("#conditionCovers").attr("required", false);
			$("#releasedate").attr("required", false);
			$("#conditionDisk").attr("required", false);
			$("#productName").attr("required", true);
			$("#title").attr("required", false);
			$("#genre").attr("required", false);
			$("#quantity").attr("required", false);
			$("#label").attr("required", false);
			$("#name").attr("required", false);
			lp.slideUp(1000);
			return oheistarvikkeet.slideDown(1000);
		} else {
			lp.slideDown(1000);
			$("#releasedate").attr("required", false);
			$("#conditionCovers").attr("required", false);
			$("#conditionDisk").attr("required", false);
			$("#productName").attr("required", false);
			$("#title").attr("required", true);
			$("#genre").attr("required", true);
			$("#quantity").attr("required", true);
			$("#label").attr("required", true);
			$("#name").attr("required", true);
			releaseDate.slideUp(500);
			discountedPrice.slideUp(500);
			conditionInputs.slideUp(500);
			oheistarvikkeet.slideUp(1000);
		}
	})
	// verify product removal
	$("#productGrid").on("click", ".deleteProduct", function(event) {
		event.preventDefault();
		var prompt = confirm("Oletko varma, että haluat poistaa tämän tuotteen, sillä tuotteen poistamista ei coida enää kumota?");
		if(prompt) {
			var id = $(this).attr("value");
			var formUrl = "/admin/product/"+id;
			var itemToDelete = $(this).closest(".productlist.col-md-10");
			console.log(id);
			$.ajax({
				url: formUrl,
				type: "DELETE",
				data: id,
				success: function(response) {
					if(response === "success") {
						itemToDelete.remove();
        				$("#success").html(`
        					<div class="alert alert-success alert-dismissible fade in" role="alert">
								<button type="button" class="close" data-dismiss="alert" aria-label="Close">
            						<span aria-hidden="true">&times;</span>
          						</button>
								<p>Tuote on onnistuneesti poistettu.</p>
							</div>
        				`);
					} else {
						$("#error").html(`
							<div class="alert alert-danger alert-dismissible fade in" role="alert">
								<button type="button" class="close" data-dismiss="alert" aria-label="Close">
            						<span aria-hidden="true">&times;</span>
          						</button>
								<p>Jokin meni pieleen tuotetta poistettaessa.</p>
							</div>
						`);
						$(".deleteProduct").blur();
					}
				}
			});
		} else {
			$(".deleteProduct").blur();
		}
	});
});