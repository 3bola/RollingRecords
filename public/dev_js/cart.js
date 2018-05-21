$(document).ready(function() {
	//Breadcrumbs
	//Set pricetag
	function setPriceTag(price) {
  		var formattedPrice;
  		var nLength = function(a) {
  			var e = 1;
  			while (Math.round(a * e) / e !== a) e *= 10;
  			return Math.log(e) / Math.LN10;
		} 
  		formattedPrice = `${Number.isInteger(price) ? `${price},00 €` : nLength(price) === 2 ? `${parseFloat(price).toFixed(2)} €` :  nLength(price) > 2 ? `${parseFloat(price).toFixed(2)} €` : `${price}0 €`}`;
  		return formattedPrice;
	};
	$(".breadcrumb").on("click", ".item", function(event) {
		event.preventDefault();
		var locationUrl = $(this).attr("href");
		window.location = locationUrl;
	});
	//Variables to store values of quantity and total price
	var cartId = $("#cartId").val();
	var btnToToggle = $(".btn-to-toggle");
	var cartTotalQuantity = $("#cartTotalQuantity");
	// variables to get all needed data for adding items in cart
	//Quantity values
	var quantity;
	var totalQuantity;
	var quantityTotal;
	var price;
	//Tax values
	var taxAmount;
	var totalTaxAmount;
	//Price values
	var unitPrice;
	var totalUnitPrice;
	var unitPriceExcludingTax;
	var totalUnitPriceExcludingTax;
	/* Bonus system variable */
	var genre;
	//function to set values that are to be send on the server.
	function setValues (self) {
		//Set quantites
		quantity = $(self).closest(".cart-buttons").find(".quantity");
		if(parseInt($(self).closest(".cart-buttons").find(".total_quantity").val()) === 0) {
			totalQuantity = 1;
		} else {
			totalQuantity = parseInt($(self).closest(".cart-buttons").find(".total_quantity").val());
		}
		quantityTotal = parseInt($(self).closest(".cart-buttons").find(".quantity_total").val());
		//Set taxes
		taxAmount = parseFloat($(self).closest(".cart-buttons").find(".tax_amount").val());
		totalTaxAmount = parseFloat($(self).closest(".cart-buttons").find(".total_tax_amount").val());
		//Set prices
		if(Number.isInteger($(self).closest(".cart-buttons").find(".total_price").val())) {
			price = parseInt($(self).closest(".cart-buttons").find(".total_price").val());
		} else {
			price = parseFloat($(self).closest(".cart-buttons").find(".total_price").val());
		}
		if(Number.isInteger($(self).closest(".cart-buttons").find(".unit_price").val())) {
			unitPrice = parseInt($(self).closest(".cart-buttons").find(".unit_price").val());
		} else {
			unitPrice = parseFloat($(self).closest(".cart-buttons").find(".unit_price").val());
		}
		if(Number.isInteger($(self).closest(".cart-buttons").find(".total_unit_price").val())) {
			totalUnitPrice  = parseInt($(self).closest(".cart-buttons").find(".total_unit_price").val());	
		} else {
			totalUnitPrice  = parseFloat($(self).closest(".cart-buttons").find(".total_unit_price").val());
		}
		unitPriceExcludingTax = parseFloat($(self).closest(".cart-buttons").find(".unit_price_excluding_tax").val());
		totalUnitPriceExcludingTax = parseFloat($(self).closest(".cart-buttons").find(".total_unit_price_excluding_tax").val());
		genre = $(self).closest(".cart-buttons").find(".product_genre").val();
	};
	//Listeners for plus and minus buttons
	// To increase or decrease quantity and total price of an item
	//Event listener for minus button
	$(".minus").on("click", function() {
		setValues(this);
		if(totalQuantity == 1) {
			totalTaxAmount = taxAmount;
			totalUnitPriceExcludingTax = unitPriceExcludingTax;
			totalUnitPrice = unitPrice;
			totalQuantity = 1;
		} else {
			totalTaxAmount = (totalTaxAmount - taxAmount).toFixed(2);
			totalUnitPriceExcludingTax = (totalUnitPriceExcludingTax - unitPriceExcludingTax).toFixed(2);
			totalQuantity --;
			totalUnitPrice = parseInt(totalUnitPrice - unitPrice);
		}
		$(this).closest(".cart-buttons").find(".quantity").html(totalQuantity);
		$(this).closest(".cart-buttons").find(".total_tax_amount").val(totalTaxAmount);
		$(this).closest(".cart-buttons").find(".total_unit_price_excluding_tax").val(totalUnitPriceExcludingTax);
		$(this).closest(".cart-buttons").find(".total_quantity").val(totalQuantity);
		$(this).closest(".cart-buttons").find(".total_unit_price").val(totalUnitPrice);
		$(this).closest(".cart-buttons").find(".total_price").val(setPriceTag(totalUnitPrice));
	});
	//Event listener fo plus button clicks
	$(".plus").on("click", function() {
		setValues(this);
		if(totalQuantity < quantityTotal) {
			totalQuantity++;
			totalUnitPrice = parseInt(totalUnitPrice + unitPrice);
			totalTaxAmount = (totalTaxAmount + taxAmount).toFixed(2);
			totalUnitPriceExcludingTax = (totalUnitPriceExcludingTax + unitPriceExcludingTax).toFixed(2);
		} else {
			totalQuantity = totalQuantity;
			totalUnitPrice = totalUnitPrice;
			totalTaxAmount = totalTaxAmount;
			totalUnitPriceExcludingTax = totalUnitPriceExcludingTax;
		}
		$(this).closest(".cart-buttons").find(".quantity").html(totalQuantity);
		$(this).closest(".cart-buttons").find(".total_tax_amount").val(totalTaxAmount);
		$(this).closest(".cart-buttons").find(".total_unit_price_excluding_tax").val(totalUnitPriceExcludingTax);
		$(this).closest(".cart-buttons").find(".total_quantity").val(totalQuantity);
		$(this).closest(".cart-buttons").find(".total_unit_price").val(totalUnitPrice);
		$(this).closest(".cart-buttons").find(".total_price").val(setPriceTag(totalUnitPrice));
	});
	// Listener for clicks on add product to cart button
	$(".addToCart").on("click", function() {
		setValues(this);
		var product = {
			id: $(this).closest(".cart-buttons").find(".product_id").val(),
			total_quantity: totalQuantity,
			total_price: totalUnitPrice,
			unit_price: unitPrice,
			tax_amount: taxAmount,
			total_tax_amount: totalTaxAmount,
			unit_price_excluding_tax: unitPriceExcludingTax,
			total_unit_price_excluding_tax: totalUnitPriceExcludingTax,
			genre: genre
		};
		$.post("/ostoskori/"+cartId, product, function(response) {
			if(!response.message) {
				$("#success").html(`
					<div class="alert alert-success alert-dismissible fade in" role="alert">
						<button type="button" class="close" data-dismiss="alert" aria-label="Close">
            				<span aria-hidden="true">&times;</span>
          				</button>
						<p>Tuote on lisätty ostoskoriin.</p>
					</div>
				`);
				$("#cart #total_price").html(`${response.total_price_including_tax} €`);
				$("#cart #totalQuantity").html(`
					${response.total}
				`);
			} else {
				$("#error").html(`
					<div class="alert alert-danger alert-dismissible fade in" role="alert">
						<button type="button" class="close" data-dismiss="alert" aria-label="Close">
            				<span aria-hidden="true">&times;</span>
          				</button>
						<p>${response.message}</p>
					</div>
				`);
			}
		});
	});
	//Listener for edit carts product quantities or delete product from cart
	$(".editQuantityPlus").on("click", function() {
		btnToToggle.prop("disabled", true);
		setValues(this);
		var totalQuantityToDisplay = $(this).closest(".product-row").find(".totalQuantityToDisplay");
		var totalPriceToDisplay = $(this).closest(".product-row").find(".totalPriceToDisplay");
		if(totalQuantity < quantityTotal) {
			totalQuantity++;
			if(Number.isInteger(unitPrice)) {
				totalUnitPrice = parseInt(totalUnitPrice + unitPrice);
			} else {
				totalUnitPrice = parseFloat(totalUnitPrice + unitPrice).toFixed(2);
			}
			totalTaxAmount = parseFloat(totalTaxAmount + taxAmount).toFixed(2);
			totalUnitPriceExcludingTax = parseFloat(totalUnitPriceExcludingTax + unitPriceExcludingTax).toFixed(2);
			$(this).closest(".cart-buttons").find(".total_tax_amount").val(totalTaxAmount);
			$(this).closest(".cart-buttons").find(".total_unit_price_excluding_tax").val(totalUnitPriceExcludingTax);
			$(this).closest(".cart-buttons").find(".total_quantity").val(totalQuantity);
			$(this).closest(".cart-buttons").find(".total_unit_price").val(totalUnitPrice);
			var data = {
				method: "add",
				item_id: $(this).attr("item_id"),
				id: $(this).closest(".cart-buttons").find(".productId").val(),
				total_quantity: totalQuantity,
				total_price: totalUnitPrice,
				unit_price: unitPrice,
				tax_amount: taxAmount,
				total_tax_amount: totalTaxAmount,
				unit_price_excluding_tax: unitPriceExcludingTax,
				total_unit_price_excluding_tax: totalUnitPriceExcludingTax,
				genre: genre
			};
			$.ajax({
				url: `/ostoskori/${cartId}`,
				method: "PATCH",
				data: data,
				success: function(response) {
					if(response !== "error") {
						btnToToggle.prop("disabled", false);
						$("#cartTotalPriceIncludingTax").html(`${setPriceTag(response.total_price_including_tax)}`);
						$("#cartTotalQuantity").html(`${response.total} kpl`);
						$("#cartTotalTaxAmount").html(`${setPriceTag(response.total_tax_amount)}`);
						$("#cartTotalPriceExcludingTax").html(`${setPriceTag(response.total_price_excluding_tax)}`);
						totalPriceToDisplay.html(`${setPriceTag(totalUnitPrice)}`);
						totalQuantityToDisplay.html(`${totalQuantity} kpl`);
					} else {
						btnToToggle.prop("disabled", false);
						$("#cartErrorMsg").html(`
							<div class="alert alert-danger alert-dismissible fade in" role="alert">
								<button type="button" class="close" data-dismiss="alert" aria-label="Close">
	            					<span aria-hidden="true">&times;</span>
	          					</button>
								<p>Tuotteen määrää ei voitu muokata.</p>
							</div>
						`);
					}
				}
			});
		} else {
			totalQuantity = totalQuantity;
			totalUnitPrice = totalUnitPrice;
			totalTaxAmount = totalTaxAmount;
			totalUnitPriceExcludingTax = totalUnitPriceExcludingTax;
			$(this).closest(".cart-buttons").find(".total_tax_amount").val(totalTaxAmount);
			$(this).closest(".cart-buttons").find(".total_unit_price_excluding_tax").val(totalUnitPriceExcludingTax);
			$(this).closest(".cart-buttons").find(".total_quantity").val(totalQuantity);
			$(this).closest(".cart-buttons").find(".total_unit_price").val(totalUnitPrice);
			btnToToggle.prop("disabled", false);
		}
	});
	$(".editQuanityMinus").on("click", function() {
		btnToToggle.prop("disabled", true);
		setValues(this);
		var totalQuantityToDisplay = $(this).closest(".product-row").find(".totalQuantityToDisplay");
		var totalPriceToDisplay = $(this).closest(".product-row").find(".totalPriceToDisplay");
		if(totalQuantity == 1) {
			totalQuantity = totalQuantity;
			totalUnitPrice = totalUnitPrice;
			totalTaxAmount = totalTaxAmount;
			totalUnitPriceExcludingTax = totalUnitPriceExcludingTax;
			$(this).closest(".cart-buttons").find(".total_tax_amount").val(totalTaxAmount);
			$(this).closest(".cart-buttons").find(".total_unit_price_excluding_tax").val(totalUnitPriceExcludingTax);
			$(this).closest(".cart-buttons").find(".total_quantity").val(totalQuantity);
			$(this).closest(".cart-buttons").find(".total_unit_price").val(totalUnitPrice);
			btnToToggle.prop("disabled", false);
		} else {
			totalQuantity--;
			totalUnitPrice = totalUnitPrice - unitPrice;
			totalTaxAmount = parseFloat(totalTaxAmount - taxAmount).toFixed(2);
			totalUnitPriceExcludingTax = parseFloat(totalUnitPriceExcludingTax - unitPriceExcludingTax).toFixed(2);
			$(this).closest(".cart-buttons").find(".total_tax_amount").val(totalTaxAmount);
			$(this).closest(".cart-buttons").find(".total_unit_price_excluding_tax").val(totalUnitPriceExcludingTax);
			$(this).closest(".cart-buttons").find(".total_quantity").val(totalQuantity);
			$(this).closest(".cart-buttons").find(".total_unit_price").val(totalUnitPrice);
			var data = {
				method: "exclude",
				item_id: $(this).attr("item_id"),
				id: $(this).closest(".cart-buttons").find(".productId").val(),
				total_quantity: totalQuantity,
				total_price: totalUnitPrice,
				unit_price: unitPrice,
				tax_amount: taxAmount,
				total_tax_amount: Number(totalTaxAmount),
				unit_price_excluding_tax: unitPriceExcludingTax,
				total_unit_price_excluding_tax: Number(totalUnitPriceExcludingTax),
				genre: genre
			};
			$.ajax({
				url: `/ostoskori/${cartId}`,
				method: "PATCH",
				data: data,
				success: function(response) {
					if(response !== "error") {
						btnToToggle.prop("disabled", false);
						$("#cartTotalPriceIncludingTax").html(`${setPriceTag(response.total_price_including_tax)}`);
						$("#cartTotalQuantity").html(`${response.total} kpl`);
						$("#cartTotalTaxAmount").html(`${setPriceTag(response.total_tax_amount)}`);
						$("#cartTotalPriceExcludingTax").html(`${setPriceTag(response.total_price_excluding_tax)}`);
						totalPriceToDisplay.html(`${setPriceTag(totalUnitPrice)}`);
						totalQuantityToDisplay.html(`${totalQuantity} kpl`);
					} else {
						btnToToggle.prop("disabled", false);
						$("#cartErrorMsg").html(`
							<div class="alert alert-danger alert-dismissible fade in" role="alert">
								<button type="button" class="close" data-dismiss="alert" aria-label="Close">
            						<span aria-hidden="true">&times;</span>
          						</button>
								<p>Tuotteen määrää ei voitu muokata.</p>
							</div>
						`);
					}
				}
			});
		}
	});
	$(".deleteItem").on("submit", function(event) {
		event.preventDefault();
		btnToToggle.prop("disabled", true);
		setValues(this);
		var data = {
			method: "remove",
			item_id: $(this).closest(".cart-buttons").find(".itemsId").val(),
			id: $(this).closest(".cart-buttons").find(".productId").val(),
			total_quantity: totalQuantity,
			total_price: totalUnitPrice,
			unit_price: unitPrice,
			tax_amount: taxAmount,
			total_tax_amount: totalTaxAmount,
			unit_price_excluding_tax: unitPriceExcludingTax,
			total_unit_price_excluding_tax: totalUnitPriceExcludingTax,
			genre: genre
		};
		var itemToDelete = $(this).closest(".cartItem");
		$.ajax({
			url: `/ostoskori/${cartId}`,
			method: "PATCH",
			data: data,
			success: function(response) {
				if(response !== "error") {
					itemToDelete.remove();
					btnToToggle.prop("disabled", false);
					$("#cartTotalPriceIncludingTax").html(`${setPriceTag(response.total_price_including_tax)}`);
					$("#cartTotalQuantity").html(`${response.total} kpl`);
					$("#cartTotalTaxAmount").html(`${setPriceTag(response.total_tax_amount)}`);
					$("#cartTotalPriceExcludingTax").html(`${setPriceTag(response.total_price_excluding_tax)}`);
				} else {
					btnToToggle.prop("disabled", false);
					$("#cartErrorMsg").html(`
						<div class="alert alert-danger alert-dismissible fade in" role="alert">
							<button type="button" class="close" data-dismiss="alert" aria-label="Close">
            					<span aria-hidden="true">&times;</span>
          					</button>
							<p>Tuotteen poistaminen ostoskorista epäonnistui.</p>
						</div>
					`);
				}
			}
		});
	});
});
