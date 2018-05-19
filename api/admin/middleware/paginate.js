"use strict";
const mongoose = require('mongoose');
const User = require('../../../models/user');
//Variables that can be modified in code.
var page = 1;
var perPage = 10;
var queryString = "";
var title = "Tuotehallinta";
var genre = "";
var category = "";
var Quantity = -1;
var type = "lp";
var queryObj = {"status": "available", "type": type};
var sortObj = {"createdAt": -1};
// user query
var admin = false;
var userQueryObj = {"admin.isAdmin": false};
var userSortObj = {"created": -1};
//initalize output
var output = {
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
function init(req, res) {
	output.pages.visiblePages = [];
	type = "lp";
	queryString = "";
	Quantity = -1;
	queryObj = {"status": "available", "type": type};
	genre = "";
	category = "";
	if(req.query && req.query.querystring) {
		queryObj = {"username": req.query.querystring}
	}
	if(req.query && req.query.page) {
		page = parseInt(req.query.page, 10);
	}
	if(req.query && req.query.perPage) {
		perPage = parseInt(req.query.perPage, 10);
	}
	if(req.query && req.query.search) {
		queryString = new RegExp(escapeRegex(req.query.search), "gi");
	}
	if(req.query && req.query.status) {
		queryObj = {"status": req.query.status, "type": type};
	}
	if(req.query && req.query.category) {
		if(req.query.category === "Oheistarvikkeet") {
			type = "muut";
		}
		category = req.query.category;
		title = req.query.category;
		queryObj = {"status": "available", "category": req.query.category, "type": type};
	}
	if(req.query && req.query.genre) {
		genre = req.query.genre;
		title = req.query.genre;
		queryObj = {"status": "available", "genre": req.query.genre, "type": type};
	}
	if(req.query && req.query.Quantity) {
		title = "Nolla tuotteet";
		Quantity = parseInt(req.query.Quantity, 10);
		queryObj = {"status": "available", "total_quantity": Quantity, "type": type};
	}
	if(req.query && req.query.SortByCreatedAt) {
		title = "Viimeisimmät lisäykset";
		sortObj = {"createdAt": parseInt(req.query.SortByCreatedAt, 10)};
	}
	if(req.query && req.query.SortByTitle) {
		if(parseInt(req.query.SortByTitle, 10) === -1) {
			title = "Suodatus aakkosittain Z-A";
		} else {
			title = "Suodatus aakkosittain A - Z";
		}
		sortObj = {"title": parseInt(req.query.SortByTitle, 10)};
	}
	if(req.query && req.query.SortByQuantity) {
		title = "Suodatus varastomäärän mukaan";
		sortObj = {"total_quantity": parseInt(req.query.SortByQuantity, 10)};
	}
	if(req.query && req.query.SortByPrice) {
		if(parseInt(req.query.SortByPrice, 10) === -1) {
			title = "Kalleimmat ensin";
		} else {
			title = "Halvimmat ensin";
		}
		sortObj = {"unit_price": parseInt(req.query.SortByPrice, 10)};
	}
	// user search related queries
	if(req.query && req.query.admin) {
		admin = req.query.admin === "true" ? true : false;
		userQueryObj = {"admin.isAdmin": admin};
	}
	if(req.query && req.query.UserCreated) {
		userSortObj = {"created": Number(req.query.UserCreated)};
	}
};
function setOutput(items, count, done) {
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
	return done(null, true);
};
module.exports.paginateItems = (req, res, items, cb) => {
	init(req, res);
	if(queryString !== "") {
		items.find({$or: [{'title': queryString}, {'name': queryString}, {'label': queryString}, {'ean': queryString}, {'fullname': queryString}]})
		.skip((page - 1) * perPage)
    	.limit(perPage)	
		.sort(sortObj)
		.exec((err, things) => {
			if(err || !things) {
				req.flash("error", `Valitettavasti hakusanalla "${req.query.search}", ei löytynyt yhtään hakutulosta.`);
				return res.redirect("/admin/product");
			} else {
				items.count({$or: [{'title': queryString}, {'name': queryString}, {'label': queryString}, {'ean': queryString}, {'fullname': queryString}]})
				.exec((err, count)=> {
					if(err || !count) {
						req.flash("error", `Valitettavasti hakusanalla "${req.query.search}", ei löytynyt yhtään hakutulosta.`);
						return res.redirect("/admin/product");
					} else {
						setOutput(things, count, (err, done) => {
							if(err) {
								req.flash("error", "Jotain meni vikaan.");
								return res.redirect("back");
							} else {
								return cb(null, {
									search: req.query.search,
									products: output.data,
									pages: output.pages,
									items: output.items,
									genre: genre,
									category: category,
									title: "Tuloksia hakusanalle: '"+req.query.search+"'",
									Quantity: Quantity
								});
							}
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
						req.flash("error", "Tässä tuotekategoriassa ei löytynyt yhtään hakutulosta.");
						return res.redirect("back");
					} else {
						setOutput(things, count, (err, done) => {
							if(err) {
								req.flash("error", "Jotain meni vikaan.");
								return res.redirect("back");
							} else {
								return cb(null, {
									products: output.data,
									pages: output.pages,
									items: output.items,
									genre: genre,
									category: category,
									title: title,
									Quantity: Quantity,
									search: queryString
								});
								return;
							}
						});
					}
				});
			}
		});
	}
};
//Paginate users
module.exports.paginateUsers = (req, res, User, cb) => {
	init(req, res);
	if(queryString !== "") {
		User.find({$or: [{'username': queryString}, {'email': queryString}, {"fullname": queryString}]})
		.select('-password')
		.skip((page - 1) * perPage)
    	.limit(200)	
		.sort(sortObj)
		.exec((err, things) => {
			if(err || !things) {
				req.flash("error", "Tällä nimellä ei löytynyt yhtään käyttäjää.");
				return res.redirect("/admin/user");
			} else {
				User.count({$or: [{'username': queryString}, {'email': queryString}, {"fullname": queryString}]})
				.exec((err, count)=> {
					if(err || !count) {
						req.flash("error", "Tällä nimellä ei löytynyt yhtään käyttäjää.");
						return res.redirect("/admin/user");
					} else {
						setOutput(things, count, (err, done) => {
							if(err) {
								req.flash("error", "Tällä nimellä ei löytynyt yhtään käyttäjää.");
								return res.redirect("/admin/user");
							} else {
								return cb(null, {
									users: output.data,
									pages: output.pages,
									items: output.items,
									admin: admin
								});
							}
						});
					}
				});
			}
			return;
		});
	} else {
		User.find(userQueryObj)
		.select('-password')
		.skip((page - 1) * perPage)
    	.limit(200)	
		.sort(userSortObj)
		.exec((err, things) => {
			if(err || !things) {
				req.flash("error", "Tällä nimellä ei löytynyt yhtään käyttäjää.");
				return res.redirect("/admin/user");
			} else {
				User.count({})
				.exec((err, count)=> {
					if(err || !count) {
						req.flash("error", "Yhtään käyttjää ei löytynyt antamilla kriteereillä.");
						return res.redirect("back");
					} else {
						setOutput(things, count, (err, done) => {
							if(err) {
								req.flash("error", "Jotain meni vikaan.");
								return res.redirect("back");
							} else {
								return cb(null, {
									users: output.data,
									pages: output.pages,
									items: output.items,
									admin: admin
								});
							}
						});
					}
				});
			}
		});
	}
};
//sanitze input
function escapeRegex(text){
	return text.replace(/[-[\]{}()*+?,\\^$|#\s]/g, "\\$&");
};