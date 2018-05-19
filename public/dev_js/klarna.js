$(document).ready(function() {
	var klarna = $("#klarna");
	var klarnaCheckoutBtn = $("#klarnaCheckoutBtn");
	var cartId = $("#cartId").val();
	var Klarna_Cart = {
    	items: []
    	//shipping_address
	};
	function getCart(cb) {
		$.get("/ostoskori/"+cartId+"/ajax", function(cart) {
			if(cart.items.length) {
				var dc_item = {
					reference: cart.delivery_cost._id,
					name: cart.delivery_cost.name,
					quantity: parseInt(cart.delivery_cost.quantity, 10),
					unit_price: Number(cart.delivery_cost.unit_price) * 100,
					tax_rate: parseInt(cart.delivery_cost.tax_rate, 10) * 100,
					type: cart.delivery_cost.unit_type
				};
				if(cart.bonus_system.coupon_id) {
					var discount = {
						reference: cart.bonus_system.coupon_id,
						name: "Hyvitys",
						quantity: 1,
						unit_price: parseInt(- cart.bonus_system.coupon_value, 10) * 100,
						tax_rate: 0 * 100,
						type: "discount"
					};
					Klarna_Cart.items.push(discount);
				}
				Klarna_Cart.items.push(dc_item);
				// Klarna_Cart.address.email = cart.owner.email;
				// Klarna_Cart.address.postal_code = cart.owner.completeAddress.zipcode;
				var count = 0;
				for(var i = 0; i < cart.items.length; i++) {
					var item = {
						reference: cart.items[i]._id,
						name: cart.items[i].item.fullname,
						quantity: parseInt(cart.items[i].quantity),
						unit_price: parseInt(cart.items[i].unit_price) * 100,
						tax_rate: parseInt(cart.items[i].tax_rate) * 100,
						image_uri: cart.items[i].item.cover,
						uri: "https://rollingrecords.fi/lp:t/"+cart.items[i].item._id,
						type: cart.items[i].item.unit_type
					};
					Klarna_Cart.items.push(item);
					count++;
					if(count === cart.items.length) {
						return cb(false, true);
					}
				}
			} else {
				return cb(true, false);
			}
		});
	};
	if($("#delivery_method").val() === "Nouto myymälästä") {
		klarnaCheckoutBtn.on("click", function(event) {
			event.preventDefault();
			$(this).prop("disabled", true);
			// Format and send HTTP request to local server
			getCart(function(err, done) {
				if(err) {
					console.error("Jotain meni peileen.");
				} else {
					$.ajax({
            			url: '/ostoskori/'+cartId+"/maksu",
            			type: 'POST',
            			data: JSON.stringify(Klarna_Cart),
            			contentType: 'application/json; charset=utf-8',
        				// Handle successful response
    					success: function(data) {
            				$("#klarna").html(data.snippet);
        				},
        				// Handle error
        				error: function(response) {
            				console.log(response);
        					$("#klarna").html("Error: " + response.responseText);
        				}
        			});
				}
			});
    	});
	} else {
		getCart(function(err, done) {
			if(err) {
				console.error("Jotain meni peileen.");
			} else {
				$.ajax({
        			url: '/ostoskori/'+cartId+"/maksu",
        			type: 'POST',
        			data: JSON.stringify(Klarna_Cart),
        			contentType: 'application/json; charset=utf-8',
    				// Handle successful response
					success: function(data) {
        				$("#klarna").html(data.snippet);
    				},
    				// Handle error
    				error: function(response) {
        				console.log(response);
    					$("#klarna").html("Error: " + response.responseText);
    				}
    			});
			}
		});
	}
    if(window.location.pathname === `/ostoskori/${cartId}/vahvistus`) {
    	var klarnaId = $("#klarna_id").val();
    	if(klarnaId !== undefined) {
    		$.get(`/ostoskori/${cartId}/tilaus?klarna_id=${klarnaId}`, function(order) {
    			console.log(order);
    			$("#klarna_order").html(order.gui.snippet);
    		});
    	}
    }
});