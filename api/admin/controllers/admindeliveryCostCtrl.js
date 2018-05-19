"use strict";
const mongoose = require('mongoose');
const DeliveryCost = require("../../../models/deliveryCost");
//get deliverycosts and add new
module.exports.getDeliverycosts = (req, res, next) => {
	DeliveryCost.find({}).sort({"price": 1}).exec((err, allDeliveryCosts) => {
		if(err || !allDeliveryCosts) {
			req.flash("error", err.message);
			return res.redirect('back');
		} else {
			res.status(200).json(allDeliveryCosts);
		}
	});
};
module.exports.addDeliverycost = (req, res, next) => {
	var deliveryCost = new DeliveryCost();
	deliveryCost.name = req.body.name;
	deliveryCost.unit_price = parseFloat(req.body.unit_price).toFixed(2);
	deliveryCost.description = req.body.description;
	deliveryCost.tax_rate = parseInt(req.body.tax_rate, 10);
	if(deliveryCost.unit_price > 0) {
		let tax = ((parseFloat(req.body.unit_price).toFixed(2) * (parseInt(req.body.tax_rate) / 100) * 100) / 100).toFixed(2);
		console.log(tax);
  		deliveryCost.tax = tax;
  		deliveryCost.unit_price_excluding_tax = (parseFloat(req.body.unit_price).toFixed(2) - tax).toFixed(2);
	}
	deliveryCost.save((err, newDeliveryCost) => {
		if(err) {
			req.flash("error", err.message);
			return res.redirect('back');	
		} else {
			req.flash("success", "Toimituskulu on luotu onnistuneesti.");
			res.redirect('back');
		}
	});
};
//get new deliverycost form
module.exports.getDeliverycostForm = (req, res, next) => {
	res.render("admin/deliverycost/addDeliverycostForm.ejs");
};
//Edit and remove deliveryCost
module.exports.updateDeliveryCost = (req, res, next) => {
	DeliveryCost.findByIdAndUpdate(req.params.id, deliverycost, (err, udatedDeliveryCost) => {
		if(err) {
			req.flash("error", err.message);
			return res.redirect("back");
		} else {
			req.flash("success", "Toimituskulu on onnistuneesti päivitetty.");
			res.redirect("back");
		}
	});
};
module.exports.removeDeliveryCost = (req, res, next) => {
	DeliveryCost.findByIdAndRemove(req.params.id, (err) => {
		if(err) {
			req.flash("error", err.message);
			return res.redirect("back");
		} else {
			req.flash("success", "Toimituskulu on onnistuneesti poistettu.");
			res.redirect("/admin/deliverycost");
		}
	});
};