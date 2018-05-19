"use strict";
const async 		= require('async');
const mongoose 		= require('mongoose');
const Product 		= require('../../../models/product');
const paginate 		= require('../middleware/paginate');
// "/" landing page
module.exports.setLandingPage = (req, res, next) => {
	let products = {
		newProducts: [],
		comingProducts: [],
		usedProducts: [],
		subProducts: [],
		frontPageProducts: []
	};
	async.parallel([
		function(cb) {
			Product.find({"front_page": true}).sort({"front_page_update": -1, "title": 1}).limit(16).exec((err, frontPageProducts) => {
				if(err || !frontPageProducts) {
					req.flash("error", "Ups! Valitettavasti tuotteiden haussa tapahtui odottamaton virhe.");
					return res.redirect("/");
				} else {
					products.frontPageProducts = frontPageProducts;
					cb(null, frontPageProducts);
				}
			});			
		},
		function(cb) {
			Product.find({"category": "Uudet"}).sort({"createdAt": -1}).limit(12).exec((err, newProducts) => {
				if(err || !newProducts) {
					req.flash("error", "Ups! Valitettavasti tuotteiden haussa tapahtui odottamaton virhe.");
					return res.redirect("/");
				} else {
					products.newProducts = newProducts;
					cb(null, newProducts);
				}
			});			
		},
		function(cb) {
			Product.find({"category": "Oheistarvikkeet"}).sort({"createdAt": -1}).limit(12).exec((err, subProducts) => {
				if(err || !subProducts) {
					req.flash("error", "Ups! Valitettavasti tuotteiden haussa tapahtui odottamaton virhe.");
					return res.redirect("/");
				} else {
					products.subProducts = subProducts;
					cb(null, subProducts);
				}
			});
		},
		function(cb) {
			Product.find({"category": "Käytetyt"}).sort({"createdAt": -1}).limit(12).exec((err, usedProducts) => {
				if(err || !usedProducts) {
					req.flash("error", "Ups! Valitettavasti tuotteiden haussa tapahtui odottamaton virhe.");
					return res.redirect("/");
				} else {
					products.usedProducts = usedProducts;
					cb(null, usedProducts);
				}
			});
		},
		function(cb) {
			Product.find({"category": "Tulevat"}).sort({"createdAt": -1}).limit(12).exec((err, comingProducts) => {
				if(err || !comingProducts) {
					req.flash("error", "Ups! Valitettavasti tuotteiden haussa tapahtui odottamaton virhe.");
					return res.redirect("/");
				} else {
					products.comingProducts = comingProducts;
					cb(null, comingProducts);
				}
			});
		}
		], (err, results) => {
		req.session.category = "Kaikki";
		res.render("product/landing.ejs", {
			newProducts: products.newProducts,
			comingProducts: products.comingProducts,
			usedProducts: products.usedProducts,
			subProducts: products.subProducts,
			frontPageProducts: products.frontPageProducts
		});
	});
};
// "/product" methods
module.exports.getProducts = (req, res, next) => {
	paginate.paginateItems(req, res, Product, next);
};
// "/product/:id" methods
module.exports.getProduct = (req, res, next) => {
	Product.findById(req.params.id, (err, foundProduct) => {
		if(err || !foundProduct) {
			req.flash("error", "Ups! Valitettavasti hakemaanne tuotetta ei tällä hetkellä voi hakea tietokannasta.");
			res.redirect("back");
			return;
		} else {
			res.render("product/show.ejs", {
				category: req.session.category !== undefined ? req.session.category : "Kaikki",
				product: foundProduct
			});
		}
	});
};