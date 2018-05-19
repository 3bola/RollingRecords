$(document).ready(function() {
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
	var cartId = $("#cartId").val();
	var userId = $("#userId").val();
	if(window.location.pathname === `/ostoskori/${cartId}/maksu`) {
		//PayToStore functionality
		var PayToStoreBtn = $("#payToStoreBtn");
		var CancelBtn = $("#cancelBtn");
		var PayToStore = $("#payToStore");
		var PayToStoreForm = $("#payToStoreForm");
		PayToStoreBtn.on("click", function(event) {
			event.stopPropagation();
			PayToStoreBtn.fadeOut(1000);
			PayToStoreForm.fadeIn(1000);
		});
		CancelBtn.on("click", function(event) {
			event.stopPropagation();
			PayToStoreForm.fadeOut(1000);
			PayToStoreBtn.fadeIn(1000);
		});
	} else {
		var tabs = $(".tab-pane");
		var dcPrice = $("#dcPrice");
		var dc_unit_price;
		var tabsMenuItem = $(".tabsMenuItem");
		var dc_id = {
			id: "5ae82c7ac91983155b4d0227"
		};
		function removeActiveClasses(id) {
			for(var i = 0; i < tabs.length; i++) {
				tabs[i].classList.remove("active");
				if(tabs[i].getAttribute("id") === id) {
					tabs[i].classList.add("active");
				}
			};
		};
		removeActiveClasses();
		function setClass() {
			tabsMenuItem[0].classList.add("active");
			tabs[0].classList.add("active");
		}
		setClass();
		$(".tabsMenuItem").on("click", function() {
			dc_id.id = $(this).attr("id");
			for(var i = 0; i < tabsMenuItem.length; i++) {
				tabsMenuItem[i].classList.remove("active");
			};
			this.classList.add("active");
			removeActiveClasses(dc_id.id);
			dcPrice.html("");
			dc_unit_price = $(this).attr("value");
			dcPrice.html(`${ Number(dc_unit_price) === 0 ? dc_unit_price+",00 €" : dc_unit_price+"0 €"}`);
			var text = $(this).children("input").attr("value");
		});
		//Update deliveryCost price value
		var totalPrice = $("#totalPrice");
		$(".tabsMenuItem").on("click", function(event) {
			var price = $("#dcPriceValue").val();
			$.ajax({
            	url: `/ostoskori/${cartId}/kassa`,
            	type: 'PUT',
            	data: dc_id,
        		// Handle successful response
    			success: function(total_price) {
    				$("#totalPrice").html("");
            		$("#totalPrice").html(`${Number.isInteger(total_price) ? total_price+",00 €" : total_price+"0 €"}`);
        		},
        		// Handle error
        		error: function(response) {
            		console.log(response);
        		}
        	});
		});
		/* Bonus sytem coupon check */
		var totalPriceValue = $("#totalPrice").attr("value");
		var promptForCoupon = $("#promptForCoupon");
		var bonuSystemTotalPrice = $("#bonuSystemTotalPrice");
		var couponDiscountValue = $("#couponDiscountValue");
		var couponIdValue = $("#couponIdValue").val();
		if(totalPriceValue >= 20 && !couponIdValue) {
			$.get(`/profiili/${ userId }/kuponki`, function(coupon) {
				if(coupon.message === "success") {
					promptForCoupon.html(`<p>Voitte maksaa tämän oston osittain tai kokonaan ${coupon.coupon.value},00 € arvoisella kupongilla. <button class="btn btn-info" type="button" id="useCouponBtn" value="${coupon.coupon._id}">Käytä kuponki</button></p>`);
				} else {
					// $("#error").html(`
					// 	<div class="alert alert-danger alert-dismissible" role="alert">
  			// 				<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
  			// 				<strong>Ups!</strong> Valitettavasti teillä ei tällä hetkellä .
					// 	</div>`
					// );
				}
			});
		}
		$("#promptForCoupon").on("click", "#useCouponBtn", function(event) {
			event.preventDefault();
			$(this).prop("disabled", true);
			var couponId = $(this).attr("value");
			var data = {
				couponId: couponId,
				value: "KuponkiID"
			};
			$.ajax({
				url: `/ostoskori/${cartId}/kassa`,
				type: "PUT",
				data: data,
				success: function(response) {
					$("#success").html(`
						<div class="alert alert-success alert-dismissible" role="alert">
  							<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
  							<strong>Onnistui!</strong> 20,00 € on onnistuneesti vähennetty loppusummasta!
						</div>`
					);
					totalPrice.html(`${Number.isInteger(response.total_price) ? response.total_price+",00 €" : response.total_price+"0 €"}`);
					couponDiscountValue.html(`- 20,00 €`);
					bonuSystemTotalPrice.html(`${setPriceTag(response.bonus_system_total_price)}`);
				},
				error: function(error) {
					console.error(error);
				}
			});
		});
	}
});
