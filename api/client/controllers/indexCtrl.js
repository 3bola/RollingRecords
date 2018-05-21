"use strict";
const mongoose = require('mongoose');
const DeliveryCosts = require("../../../models/deliveryCost");
const sendMail = require('../../data/sendMail');
const Contact = require('../../../models/contact');
;//Get conditionspage with deliverycosts
module.exports.getConditionsPage = (req, res, next) => {
	DeliveryCosts.find({}, function(err, allDeliveryCosts) {
		if(err) {
			req.flash("error", err.message);
			return res.redirect("back");
		} else {
			res.render("static_pages/conditions.ejs", {
				deliveryCosts: allDeliveryCosts
			});
		}
	});
};
module.exports.getAdvertisement = (req, res, next) => {
	res.render("static_pages/advertisement.ejs");
};
module.exports.redirectToIndexPage = (req, res, next) => {
	req.flash("error", "Valitettavasti hakemaanne osoitetta \""+req.url+"\" ei löytynyt.");
	res.redirect("/");
};
module.exports.customerservice = (req, res, next) => {
	res.render("static_pages/customer_service.ejs");
};
//customer service messages
//post new message
module.exports.createContact = (req, res, next) => {
	let newContact = {
		fullname: req.body.fullname,
		email: req.body.email,
		phone: req.body.phone,
		subject: req.body.subject,
		message: req.body.message,
		owner: req.user ? req.user : null
	};
	if(newContact.fullname !== "" && newContact.email !== "" && newContact.subject !== "" && newContact.message !== "") {
		Contact.create(newContact, (err, contact) => {
			if(err) {
				req.flash("error", err.message);
				return res.redirect("/asiakaspalvelu");
			} else {
				req.flash("success", "Onnistui! Rolling Records kiittää teitä yhteydenotostanne. Palaamme takaisin teille mahdollisimman pian.");
				res.redirect("/asiakaspalvelu");
			}
		});
	}
};
//read message
module.exports.getContact = (req, res, next) => {
	Contact.findById(req.params.id, (err, foundContact) => {
		if(err || !foundContact) {
			req.flash("error", "Valitettavasti tällä hetkellä tietokantaan on yhteyskatkos.");
			return res.redirect("/admin");
		} else {
			foundContact.handler = req.user;
			foundContact.status = "recieved";
			foundContact.save((err, updatedContact) => {
				if(err) {
					req.flash("error", err.message);
					return res.redirect("/admin");
				} else {
					res.render("admin/contact/show.ejs", {
						contact: updatedContact
					});
				}
			})
		}
	});
};
module.exports.customerLoyaltyConditions = (req, res, next) => {
	res.render("static_pages/customerLoyaltyConditions.ejs");
};
//US0y,eXeERs
//Cookies policy page
module.exports.cookiesPolicy = (req, res, next) => {
	res.render("static_pages/cookies-policy.ejs");
};