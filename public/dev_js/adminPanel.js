$(document).ready(function() {
	$("#adminSearchForm").on("submit", function(event) {
		event.preventDefault();
		var searchTerm = $("#adminSearchTerm").val();
		if(searchTerm !== "" && searchTerm.length >= 2) {
			$.get("/admin/product?page=1&search="+searchTerm, function(response) {
			if(response !== "no results") {
				$("#productGrid").html("");
				$(".pagination").hide(1000);
				$(".productsOnPage").hide(1000);
				var products = response.products.map(function(product) {
						return product;
					});
					products.forEach(function(product) {
						$("#resultHeader").html("Tuloksia hakusanalle "+searchTerm);
						$("#productGrid").append(`
							<div class="productlist col-md-10">
								<div class="col-md-2">
									<img class="img-responsive" src="${ product.cover }" alt="${ product.title } - ${ product.name }">
								</div>
								<div class="col-md-6">
									<h4>${ product.title }, ${ product.unit_price } €</h4>
									<h4>${ product.name }</h4>
									<p><strong>${ product.category }</strong> ${ product.year }, ${ product.label }</p>
								</div>
								<div class="col-md-4 edit-product-buttons">
									<a href="/admin/product/${ product._id}/edit" class="btn btn-warning"><i class="fa fa-edit" aria-hidden="true"></i></a>
									<form action="/admin/product/${product._id}?_method=PATCH" method="POST">
										<button class="btn btn-primary" type="submit"><i class="fa fa-archive" aria-hidden="true"></i> Arkistoi</button>
									</form>
									<form class="deleteProduct" value="${ product._id}">
										<button class="btn btn-danger" type="submit" id="${ product._id}">
											<i class="fa fa-trash-o" aria-hidden="true"></i>
										</button>
									</form>
								</div>
							</div>
						`);
					});
					$("#adminSearchTerm").val("");
				} else {
					$("#error").html(`
						<div class="alert alert-danger alert-dismissible fade in" role="alert">
							<button type="button" class="close" data-dismiss="alert" aria-label="Close">
            					<span aria-hidden="true">&times;</span>
          					</button>
							<p>Valitettavasti hakusanalla ${searchTerm}, ei löytynyt yhtään hakutulosta.</p>
						</div>
					`);
					$("#adminSearchTerm").val("");
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
			$("#adminSearchTerm").val("");
		}
	});
	//Trigger editTrackNameForm
	$(".editTrackName").on("click", function() {
		$(this).closest(".wrapper").find(".editTrackNameForm").slideToggle(1000);
	});
});