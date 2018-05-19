"use strict";
require("./api/data/dbConnection");
const mongoose = require('mongoose');
const Product = require('./models/product');
function capitalizeFirstLetter(string) {
	if(string !== "") {
		return string.trim().charAt(0).toUpperCase() + string.slice(1);
	} else {
		return "";
	}
};
/*Product.find({}, (err, allProducts) => {
	if(err || !allProducts) {
		return console.error("No products found");
	} else {
		let products = allProducts.map((product) => {
			return product;
		});
		if(products.length === allProducts.length) {
			var count = 0;
			products.forEach((product) => {
				product.times_sold = 0;
				product.fullname = capitalizeFirstLetter(product.title) + " " + capitalizeFirstLetter(product.name);
				product.stamps = product.genre === "Svart-records" ? 0 : product.unit_price > 20 ? Math.floor(product.unit_price / 20) : product.unit_price === 20 ? Math.floor(product.unit_price / 20) : 0;
				product.save();
				count ++;
				if(products.length === count) {
					console.log("done");
				}
			});
		}
	}
});*/
Product.count({}, (err, count) => {
	if(err) {
		return console.log(err);
	} else {
		Product.aggregate({$group: {_id: "$fullname", total: {$sum: 1}}}).exec((err, foundProducts) => {
			if(err || !foundProducts) {
				console.error(err);
			} else {
				return console.log(foundProducts, count);
			}
		});
	}
});
console.log("got to the bottom");