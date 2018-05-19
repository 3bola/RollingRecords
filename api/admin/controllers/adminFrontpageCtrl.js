"use strict";
//Variables as Const
const mongoose 		= require('mongoose');
const Product 		= require('../../../models/product');
const paginate 		= require('../middleware/paginate');
module.exports.getFrontpageEditingpage = (req, res, next) => {
	paginate.paginateItems(req, res, Product, (err, output) => {
		if(err) {
			req.flash("error", err.message);
			return res.redirect("/admin");
		} else {
			res.render("admin/frontpage/index.ejs", {
				products: output.products,
				pages: output.pages,
				items: output.items,
				genre: output.genre,
				category: output.category,
				title: output.title,
				Quantity: output.Quantity,
				search: output.search
			});
		}
	});
};
module.exports.frontpageToggle = (req, res, next) => {
	Product.findById(req.params.id, (err, foundProduct) => {
		if(err || !foundProduct) {
			req.flash("error", "Ups! Valitettavasti jokin meni pieleen tuotetta haettaessa!");
			return res.redirect("/admin/frontpage");
		} else {
			foundProduct.front_page = foundProduct.front_page === true ? false : true;
			foundProduct.front_page_update = Date.now();
			foundProduct.save((err, updatedProduct) => {
				if(err) {
					req.flash("error", "Ups! Valitettavasti jokin meni pieleen tuotetta haettaessa!");
					return res.redirect("/admin/frontpage");
				} else {
					req.flash("success", "Onnistui! Tuote on onnistuneesti lisätty etusivulle!");
					res.redirect("/admin/frontpage");
				}
			});
		}
	});
};
