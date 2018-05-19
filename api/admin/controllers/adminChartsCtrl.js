"use strict";
const mongoose = require('mongoose');
const Product = require('../../../models/product');
// methods to get grpahs
module.exports.getChartTable = (req, res, next) => {
	if(req.xhr) {
		Product.aggregate({$group: {_id: "$genre", total: {$sum: 1}}}).exec((err, foundProducts) => {
			if(err || !foundProducts) {
				console.error(err);
				req.flash("error", "Tuotteita ei voitu löytää.");
				return res.redirect("back");
			} else {
				return res.status(200).json(foundProducts);
			}
		});
	} else {
		Product.find({}).count({}).exec((err, count) => {
			if(err || !count) {
				req.flash("error", "Tuotteita ei voitu löytää.");
				return res.redirect("back");
			} else {
				res.render("admin/charts/tables.ejs", {
					count: count
				});
			}
		});
	}
};
module.exports.getChartGraphs = (req, res, next) => {
	res.render("admin/charts/charts.ejs");
};