$(document).ready(function() {
	//search function
	$("#searchForm").on("submit", function(event) {
		event.preventDefault();
		//Set variables
		var value = $("#searchTerm").val();
		if(value !== "" && value.length >= 2) {
			$.get("/lp:t?page=1&search="+value, function(response) {
				if(response !== "no results") {
					$("#grid").html("");
					$(".pagination").hide(1000);
					var products = response.products.map(function(product) {
						return product;
					});
					function setCartButtons() {

					}
					$("#title").html(response.title);
					products.forEach(function(product) {
						$("#grid").append(`
							<div class="rig-cell col-md-3">
								<a href="/lp:t/${ product._id }">
									<div class="thumbnail">
										<img src="${ product.cover}" class="rig-img img-responsive" />
										<p class="rig-icon"><i class="fa fa-search-plus" aria-hidden="true"></i></p>
										<div class="rig-overlay"></div>
										<div class="product_grid_header">
											<h3>${ product.title }</h3>
											<h4>${ product.name}</h4>
										</div>
									</div>
								</a>
								<div class="thumbnail">
									<div class="btn-group btn-group-sm cart-buttons" role="group" aria-label="...">
											<input type="button" class="btn btn-default total_price" value="${ product.unit_price } €" />
											<input type="hidden" class="unit_price" value="${ product.unit_price}">
											<input type="hidden" class="total_unit_price" value="${ product.unit_price}">
											<input type="hidden" class="tax_amount" value="${ product.tax}">
											<input type="hidden" class="total_tax_amount" value="${ product.tax}">
											<input type="hidden" class="unit_price_excluding_tax" value="${ product.unit_price_excluding_tax}">
											<input type="hidden" class="total_unit_price_excluding_tax" value="${ product.unit_price_excluding_tax}">
											<input type="hidden" class="quantity_total" value="${ product.total_quantity}">
											<input type="hidden" value="${ product._id}" class="product_id">
											<button type="button" class="btn btn-success addToCart"><i class="fa fa-shopping-cart" aria-hidden="true"></i></button>
										
									</div>
								</div>
								<hr role="separator" class="divider">
							</div>
						`)
					});
					$("#searchTerm").val("");
				} else {
					$("#error").html(`
						<div class="alert alert-danger alert-dismissible fade in" role="alert">
							<button type="button" class="close" data-dismiss="alert" aria-label="Close">
            					<span aria-hidden="true">&times;</span>
          					</button>
							<p>Valitettavasti hakusanalla ${value}, ei löytynyt yhtään hakutulosta.</p>
						</div>
					`);
					$("#searchTerm").val("");
				}
			});
		} else {
			$("#error").html(`
				<div class="alert alert-danger alert-dismissible fade in" role="alert">
					<button type="button" class="close" data-dismiss="alert" aria-label="Close">
            			<span aria-hidden="true">&times;</span>
          			</button>
					<p>Hakusanan täytyy olla vähintään 2 merkkiä pitkä.</p>
				</div>
			`);
			$("#searchTerm").val("");
		}
	});
		//Genre menu
		var genresMenuToggle = false;
		$("#genres").on("click", function() {
			if(genresMenuToggle === false) {
				$("#genresMenu").slideDown(1000);
				genresMenuToggle = true;
			} else {
				$("#genresMenu").slideUp(1000);
				genresMenuToggle = false;
			}
		});
		//Genre menu
		var genresMenuToggle = false;
		$("#genres2").on("click", function() {
			if(genresMenuToggle === false) {
				$("#genresMenu").slideDown(1000);
				genresMenuToggle = true;
			} else {
				$("#genresMenu").slideUp(1000);
				genresMenuToggle = false;
			}
		});
		//bigImage toggle
		$("#smallImage").mouseenter(function() {
			$("#bigImage").fadeIn(700);
		});
		$("#smallImage").mouseleave(function() {
			$("#bigImage").fadeOut(700);
		});
	//Register form
	$("#username").on("change", function() {
		var username = $("#username").val();
		$.post("/kayttajahallinta/compareuname", username, function(response) {
			if(response === "success") {
				$("#usernameError").html("");
				$("#username").removeClass("error");
				$("#username").addClass("success");
			} else {
				$("#username").removeClass("success");
				$("#username").addClass("error");
				$("#usernameError").html("Käyttäjänimi "+username+" on jo rekisteröity.");
			}
		});
	});
	$("#email").on("change", function() {
		var email = $("#email").val();
		$.post("/kayttajahallinta/compareemail", email, function(response) {
			if(response === "success") {
				$("#emailError").html("");
				$("#email").removeClass("error");
				$("#email").addClass("success");
			} else {
				$("#email").removeClass("success");
				$("#email").addClass("error");
				$("#emailError").html("Sähköposti "+email+" on jo rekisteröity.");
			}
		});
	});
	//Sidebar toggle
	$("#menu-toggle").click(function(e) {
        e.preventDefault();
        $('html, body').animate({ scrollTop: 0 }, 'medium');
        $("#wrapper").toggleClass("toggled");
    });
});