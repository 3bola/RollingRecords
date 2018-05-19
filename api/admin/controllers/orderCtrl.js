"use strict";
const mongoose = require('mongoose');
const Order = require('../../../models/order');
const user = require('../../../models/user');
//Export all methods
//List all orders
module.exports.listOrders = (req, res, next) => {
	if(req.query.order_type === "klarna") {
		Order.find({"delivered": false, "payment_method": "klarna"}).sort({"createdAt": -1}).populate("client").populate({path: "items.item", model: "Product"}).populate("delivery_method").exec((err, orders) => {
			if(err || !orders) {
				req.flash("error", "Ups! Valitettavasti yhtään tilausta ei voitu hakea tietokannasta, teknisen vian vuoksi.");
				return res.redirect("/admin");
			} else {
				return res.render("admin/orders/list-orders.ejs", {
					orders: orders
				});
			}
		});
	} else if(req.query.order_type === "nouto-myymalasta") {
		Order.find({"delivered": false, "klarna_id": null}).sort({"createdAt": -1}).populate("client").populate({path: "items.item", model: "Product"}).populate("delivery_method").exec((err, orders) => {
			if(err || !orders) {
				req.flash("error", "Ups! Valitettavasti yhtään tilausta ei voitu hakea tietokannasta, teknisen vian vuoksi.");
				return res.redirect("/admin");
			} else {
				return res.render("admin/orders/list-orders.ejs", {
					orders: orders
				});
			}
		});
	} else {
		Order.find({"delivered": false}).sort({"createdAt": -1}).populate("client").populate({path: "items.item", model: "Product"}).populate("delivery_method").exec((err, orders) => {
			if(err || !orders) {
				req.flash("error", "Ups! Valitettavasti yhtään tilausta ei voitu hakea tietokannasta, teknisen vian vuoksi.");
				return res.redirect("/admin");
			} else {
				res.render("admin/orders/list-orders.ejs", {
					orders: orders
				});
			}
		});
	}
};
// Show one order
module.exports.showOrder = (req, res, next) => {
	Order.findById(req.params.id).sort({"createdAt": -1}).populate("client").populate({path: "items.item", model: "Product"}).populate("delivery_method").exec((err, foundOrder) => {
		if(err || !foundOrder) {
			req.flash("error", "Ups! Valitettavasti yhtään tilausta ei voitu hakea tietokannasta, teknisen vian vuoksi.");
			return res.redirect("/admin");
		} else {
			res.render("admin/orders/show-order.ejs", {
				order: foundOrder
			});
		}
	});
};
// update order
module.exports.updateOrder = (req, res, next) => {
	
};
//delete order
module.exports.deleteOrder = (req, res, next) => {
	
};