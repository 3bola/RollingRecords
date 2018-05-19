"use strict";
const mongoose = require('mongoose');
const Product = require('../../../models/product');
const indicative = require('indicative');
const sanitizeHtml = require('sanitize-html');
const fs = require('fs');
const moment = require('moment');

var validationObj = {};

const DESC_MAX_LENGTH = 2200;

/* ----- functions ----- */
validationObj.sanitizeUserInput = (req, res, next) => {
	for(var key in req.body) {
		if(req.body[key]) {
			req.body[key] = sanitizeHtml(req.body[key], {allowedTags: [], allowedAttributes: []});
		} 
	}
	return next();
};
//Backend validation
validationObj.validateProduct = (req, res, next) => {
	req.body[key] = req.body[key].trim();
	if(req.body[key] == "") {
		req.body[key] = undefined;
	}
	/* ----- sanitize user input values with express sanitizer ----- */
	req.body.title = req.sanitize(req.body.title);
	req.body.name = req.sanitize(req.body.name);
	req.body.category = req.sanitize(req.body.category);
	req.body.genre = req.sanitize(req.body.genre);
	req.body.label = req.sanitize(req.body.label);
	req.body.year = req.sanitize(req.body.year);
	req.body.unit_price = req.sanitize(req.body.unit_price);
	req.body.discountedPrice = req.sanitize(req.body.discountedPrice);
	req.body.quantity = req.sanitize(req.body.quantity);
	req.body.location = req.sanitize(req.body.location);
	req.body.edition = req.sanitize(req.body.edition);
	req.body.vat = req.sanitize(req.body.vat);
	req.body.conditionCovers = req.sanitize(req.body.conditionCovers);
	req.body.conditionDisk = req.sanitize(req.body.conditionDisk);
	req.body.releasedate = req.sanitize(req.body.releasedate);
	req.body.description = req.sanitize(req.body.description);
	req.body.tracklist = req.sanitize(req.body.tracklist);
	/* ----- messages, rules & data ----- */
	const messages = {

	};
	const rules = {

	};
	const data = {
		title: req.body.title,
		name: req.body.name,
		category: req.body.category,
		genre: req.body.genre,
		label: req.body.label,
		year: req.body.year,
		unit_price: req.body.unit_price,
		discountedPrice: req.body.discountedPrice,
		quantity: req.body.quantity,
		location: req.body.location,
		edition: req.body.edition,
		vat: req.body.vat,
		conditionCovers: req.body.conditionCovers,
		conditionDisk: req.body.conditionDisk,
		releasedate: req.body.releasedate,
		description: req.body.description,
		tracklist: req.body.tracklist
	};
	let validationErrors = [];
	indicative.validateAll(data, rules, messages) {

	}
};
/* ----- module.exports validationObj ----- */
module.exports = validationObj;