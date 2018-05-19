"use strict";
const mongoose = require('mongoose');
const Product = require("../../../models/product");
const middlewareObj = require('./middlewareObj');
//Variables that can be modified in code.
const genres = [
	"Rock",
	"Kotimainen",
	"Heavy-metal",
	"Blues",
	"Jazz",
	"Rock-roll",
	"Punk-hardcore",
	"Svart-records",
	"Funk-soul",
	"Indie-alternative",
	"HipHop",
	"Electronic",
	"Folk-country"
];
const categories = [
	"Uudet",
	"Käytetyt"
];
let page = 1;
let perPage = 28;
let queryString = "";
let titleObj = {};
let title;
let genre;
let category;
let type;
let SortByTitle;
let SortByCreatedAt;
let SortByPrice;
let queryObj = {};
let sortObj = {};
//initalize output
let output = {
	data: null,
	pages: {
		start: 1,
		end: 1,
		current: page,
		next: 0,
		hasNext: false,
		prev: 0,
		hasPrev: false,
		total: 0,
		first: 1,
		last: 1,
		visiblePages: []
	},
	items: {
		begin: ((page * perPage) - perPage) +1,
		end: page * perPage,
		total: 0
	}
};
function init(req, res, done) {
	genre = req.query.genre !== "Kaikki" ? req.query.genre : "Kaikki";
	category = req.query.category !== "Kaikki" ? req.query.category : "Kaikki";
	output.pages.visiblePages = [];
	type = req.query.category === "Oheistarvikkeet" ? "muut" : "lp";
	SortByTitle = req.query.SortByTitle === undefined ? 0 : parseInt(req.query.SortByTitle, 10) === 0 ? 0 : parseInt(req.query.SortByTitle, 10);
	SortByPrice = req.query.SortByPrice === undefined ? 0 : parseInt(req.query.SortByPrice, 10) === 0 ? 0 : parseInt(req.query.SortByPrice, 10);
	SortByCreatedAt = req.query.SortByCreatedAt === undefined ? 0 : parseInt(req.query.SortByCreatedAt, 10) === 0 ? 0 : parseInt(req.query.SortByCreatedAt, 10);
	titleObj = {
			"genre": genre,
			"category": category,
			"SortByCreatedAt": SortByCreatedAt === 0 ? "" : SortByCreatedAt === -1 ? "Viimeisimmät lisäykset" : "Vanhimmat lisäykset", 
			"SortByTitle": SortByTitle === 0 ? "" : SortByTitle === -1 ? "Z - A" : "A - Z",
			"SortByPrice": SortByPrice === 0 ? "" : SortByPrice === -1 ? "Kalleimmat ensin" : "Halvimmat ensin"
	};
	//Set title
	if(titleObj.genre === "Kaikki" && titleObj.category === "Kaikki") {
		title = "Rolling Records";
	}
	else if(titleObj.genre === "Kaikki" && titleObj.category !== "Kaikki") {
		if(titleObj.SortByCreatedAt.length) {
			if(titleObj.SortByCreatedAt === "Viimeisimmät lisäykset") {
				title = titleObj.category === "Oheistarvikkeet" ? titleObj.category+" uusimmasta vanhimapaan" : titleObj.category + " Lp:t uusimmasta vanhimapaan";
			}
			else {
				title = titleObj.category === "Oheistarvikkeet" ? titleObj.category+" vanhimmasta uusimpaan" : titleObj.category + " Lp:t vanhimmasta uusimpaan";
			}
		}
		else if(titleObj.SortByTitle.length) {
			if(titleObj.SortByTitle === "A - Z") {
				title = titleObj.category === "Oheistarvikkeet" ? titleObj.category+" aakkosittain A - Z" : titleObj.category + " Lp:t aakkosittain A - Z";
			}
			else {
				title = titleObj.category === "Oheistarvikkeet" ? titleObj.category+" aakkosittain Z - A" : titleObj.category + " Lp:t aakkosittain Z - A";
			}
		}
		else if(titleObj.SortByPrice.length) {
			if(titleObj.SortByPrice === "Kalleimmat ensin") {
				title = titleObj.category === "Oheistarvikkeet" ? titleObj.category+" kalleimmasta halvimpaan" : titleObj.category + " Lp:t kalleimmasta halvimpaan";
			} 
			else {
				title = titleObj.category === "Oheistarvikkeet" ? titleObj.category+" kalleimmasta halvimpaan" : titleObj.category + " Lp:t kalleimmasta halvimpaan";
			}
		}
		else {
			title = titleObj.category === "Oheistarvikkeet" ? titleObj.category : titleObj.category + " Lp:t";
		}
	}
	else if(titleObj.genre !== "Kaikki" && titleObj.category === "Kaikki") {
		if(titleObj.SortByCreatedAt.length) {
			if(titleObj.SortByCreatedAt === "Viimeisimmät lisäykset") {
				title = titleObj.category === "Oheistarvikkeet" ? titleObj.category+" uusimmasta vanhimapaan" : titleObj.genre + " Lp:t uusimmasta vanhimapaan";
			}
			else {
				title = titleObj.category === "Oheistarvikkeet" ? titleObj.category+" vanhimmasta uusimpaan" : titleObj.genre + " Lp:t vanhimmasta uusimpaan";
			}
		}
		else if(titleObj.SortByTitle.length) {
			if(titleObj.SortByTitle === "A - Z") {
				title = titleObj.category === "Oheistarvikkeet" ? titleObj.category+" aakkosittain A - Z" : titleObj.genre + " Lp:t aakkosittain A - Z";
			}
			else {
				title = titleObj.category === "Oheistarvikkeet" ? titleObj.category+" aakkosittain Z - A" : titleObj.genre + " Lp:t aakkosittain Z - A";
			}
		}
		else if(titleObj.SortByPrice.length) {
			if(titleObj.SortByPrice === "Kalleimmat ensin") {
				title = titleObj.category === "Oheistarvikkeet" ? titleObj.category+" kalleimmasta halvimpaan" : titleObj.genre + " Lp:t kalleimmasta halvimpaan";
			} 
			else {
				title = titleObj.category === "Oheistarvikkeet" ? titleObj.category+" halvimmasta kalleimpaan" : titleObj.genre + " Lp:t halvimmasta kalleimpaan";
			}
		}
		else {
			title = titleObj.category === "Oheistarvikkeet" ? titleObj.category : titleObj.genre + " Lp:t";
		}
	}
	else {
		if(titleObj.SortByCreatedAt.length) {
			if(titleObj.SortByCreatedAt === "Viimeisimmät lisäykset") {
				title = titleObj.category === "Oheistarvikkeet" ? titleObj.category+" uusimmasta vanhimapaan" : titleObj.category + " " + titleObj.genre + " Lp:t uusimmasta vanhimapaan";
			}
			else {
				title = titleObj.category === "Oheistarvikkeet" ? titleObj.category+" vanhimmasta uusimpaan" : titleObj.category + " " + titleObj.genre + " Lp:t vanhimmasta uusimpaan";
			}
		}
		else if(titleObj.SortByTitle.length) {
			if(titleObj.SortByTitle === "A - Z") {
				title = titleObj.category === "Oheistarvikkeet" ? titleObj.category+" aakkosittain A - Z" : titleObj.category + " " + titleObj.genre + " Lp:t aakkosittain A - Z";
			}
			else {
				title = titleObj.category === "Oheistarvikkeet" ? titleObj.category+" aakkosittain Z - A" : titleObj.category + " " + titleObj.genre + " Lp:t aakkosittain Z - A";
			}
		}
		else if(titleObj.SortByPrice.length) {
			if(titleObj.SortByPrice === "Kalleimmat ensin") {
				title = titleObj.category === "Oheistarvikkeet" ? titleObj.category+" kalleimmasta halvimpaan" : titleObj.category + " " + titleObj.genre + " Lp:t kalleimmasta halvimpaan";
			} 
			else {
				title = titleObj.category === "Oheistarvikkeet" ? titleObj.category+" halvimmasta kalleimpaan" : titleObj.category + " " + titleObj.genre + " Lp:t halvimmasta kalleimpaan";
			}
		}
		else {
			title = titleObj.category === "Oheistarvikkeet" ? titleObj.category : titleObj.category + " " + titleObj.genre + " Lp:t";
		}
	}
	queryString = "";
	queryObj = {
		"status": "available", 
		"type": type, 
		"category": category !== "Kaikki" ? category : categories,
		"genre": genre !== "Kaikki" ? genre : genres
	};
	//Set sort object
	if(req.query.SortByCreatedAt === undefined && req.query.SortByTitle === undefined && req.query.SortByPrice === undefined) {
		sortObj = {
			"createdAt": -1,
			"title": 1,
			"unit_price": -1
		};
	}
	else if(parseInt(req.query.SortByUpdatedAt, 10)) {
		sortObj = {
			"updatedAt": -1,
			"title": 1
		}
	}
	else if(parseInt(req.query.SortByPrice, 10)) {
		sortObj = {
			"unit_price": parseInt(req.query.SortByPrice, 10) === -1 ? -1 : 1
		};
	}
	else if(parseInt(req.query.SortByTitle, 10)) {
		sortObj = {
			"title": parseInt(req.query.SortByTitle, 10) === -1 ? -1 : 1
		};
	}
	else if(parseInt(req.query.SortByCreatedAt, 10)) {
		sortObj = {
			"createdAt": parseInt(req.query.SortByCreatedAt, 10) === -1 ? -1 : 1
		};
	}	
	if(req.query && req.query.page) {
		page = parseInt(req.query.page, 10);
	}
	if(req.query && req.query.perPage) {
		perPage = parseInt(req.query.perPage, 10);
	}
	if(req.query && req.query.search) {
		queryString = new RegExp(escapeRegex(req.query.search), "gi");
		return done(null, true);
	}
	if(title && queryObj && sortObj && type && category && genre && page && perPage) {
		return done(null, true);
	}
};
function setOutput(items, count) {
	//Set items
	output.items.total = count;
	//Set Data
	output.data = items;
	//Set pages
	output.pages.total = Math.ceil(output.items.total / perPage);
	output.pages.current = page;
	if(output.pages.current < output.pages.total) {
		output.pages.next = Number(output.pages.current) + 1;
	} else {
		output.pages.next = 0;
	}
	output.pages.hasNext = (output.pages.next !== 0);
	output.pages.prev = Number(output.pages.current) -1;
	output.pages.hasPrev = (output.pages.prev !== 0);
	output.pages.last = Math.ceil(output.items.total / perPage);
	if(output.pages.last === 1) {
		output.pages.start = 1;
		output.pages.end = 1;
	}
	if(output.pages.total < 6) {
		output.pages.start = 1;
		output.pages.end = output.pages.last;
	}
	if(page === 1 && output.pages.total > 6 || output.pages.total === 6) {
		output.pages.start = 1;
		output.pages.end = 6;
	}
	if(output.pages.total > 6) {
		if(page === output.pages.total || page > (output.pages.total - 5) || page === (output.pages.total - 5)) {
			output.pages.start = output.pages.last - 5;
			output.pages.end = output.pages.last;
		}
		if(page !== 1 && page !== output.pages.total && parseInt(page) === output.pages.total - 5) {
			output.pages.start = output.pages.last - 6;
			output.pages.end = output.pages.last -1;
		}
		if(page !== 1 && page !== output.pages.total && parseInt(page) < output.pages.total - 5 && parseInt(page) !== output.pages.total - 5) {
			output.pages.start = output.pages.current -1;
			output.pages.end = output.pages.current + 5 - 1;
		}
	} 
	var count = output.pages.start;
	while(count <= output.pages.end) {
		output.pages.visiblePages.push(count);
		count++;
	};
};
//Method for "/products" route
module.exports.paginateItems = (req, res, items, next) => {
	init(req, res, ((err, done) => {
		if(done) {
			if(queryString !== "") {
				items.find({$or: [{'title': queryString}, {'name': queryString}, {'label': queryString}, {'ean': queryString}, {'fullname': queryString}]})
				.skip((page - 1) * perPage)
				.limit(perPage)	
				.sort(sortObj)
				.exec((err, things) => {
					if(err || !things) {
						req.flash("error", `Valitettavasti hakusanalla "${req.query.search}", ei löytynyt yhtään hakutulosta.`);
						return res.redirect("back");
					} else {
						items.count({$or: [{'title': queryString}, {'name': queryString}, {'label': queryString}, {'ean': queryString}, {'fullname': queryString}]})
						.exec((err, count)=> {
							if(err || !count) {
								req.flash("error", `Valitettavasti hakusanalla "${req.query.search}", ei löytynyt yhtään hakutulosta.`);
								return res.redirect("back");
							} else {
								setOutput(things, count);
								res.render("product/index.ejs", {
									search: req.query.search,
									products: output.data,
									pages: output.pages,
									items: output.items,
									genre: genre,
									category: category,
									title: "Tuloksia hakusanalle: '"+req.query.search+"'",
									SortByPrice: SortByPrice,
									SortByTitle: SortByTitle,
									SortByCreatedAt: SortByCreatedAt
								});
							}
						});
					}
					return;
				});

			} else {
				items.find(queryObj)
				.skip((page - 1) * perPage)
				.limit(perPage)	
				.sort(sortObj)
				.exec((err, things) => {
					if(err || !things) {
						req.flash("error", "Tässä tuotekategoriassa ei löytynyt yhtään hakutulosta.");
						return res.redirect("back");

					} else {
						items.count(queryObj)
						.exec((err, count)=> {
							if(err || !count) {
								req.flash("error", "Ups! Tässä tuotekategoriassa ei löytynyt yhtään hakutulosta.");
								return res.redirect("back");
							} else {
								setOutput(things, count);
								req.session.category = category;
								res.render("product/index.ejs", {
									search: queryString,
									products: output.data,
									pages: output.pages,
									items: output.items,
									genre: genre,
									category: category,
									title: title,
									SortByPrice: SortByPrice,
									SortByTitle: SortByTitle,
									SortByCreatedAt: SortByCreatedAt
								});
								return;
							}
						});
					}
				});
			}
		}
	}));
};
//sanitze input
function escapeRegex(text){
	return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};