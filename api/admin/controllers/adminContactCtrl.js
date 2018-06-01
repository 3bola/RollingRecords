"use strict";
const mongoose = require('mongoose');
const Contact = require('../../../models/contact');
const User = require('../../../models/user');
module.exports.getAllContacts = (req, res, next) => {
	Contact.find({"status": "recieved"}, (err, contacts) => {
		if(err || !contacts) {
			req.flash("error", "Valitettavasti yhtään yhteydenottopyyntöä ei löytynyt tietokannasta!");
			return res.redirect("/admin/asiakaspalvelu");
		} else {
			res.render("admin/contact/index.ejs", {
				contacts: contacts
			});
		}
	});
};
module.exports.getContact = (req, res, next) => {
	Contact.findById(req.params.id).populate("owner").populate("handler").exec((err, foundContact) => {
		if(err || !foundContact) {
			req.flash("error", "Valitettavasti kyseistä yhteydenottopyyntöä ei löytynyt tietokannasta");
			return res.redirect("/admin/asiakaspalvelu");
		} else {
			res.render("admin/contact/show.ejs", {
				contact: foundContact
			});
		}
	});
};
module.exports.addReply = (req, res, next) => {
	Contact.findById(req.params.id).populate("owner").populate("handler").exec((err, foundContact) => {
		if(err || !foundContact) {
			req.flash("error", "Valitettavasti kyseistä yhteydenottopyyntöä ei löytynyt tietokannasta");
			return res.redirect("/admin/asiakaspalvelu");
		} else {
			foundContact.replies.push(req.body.reply_message);
			foundContact.save((err, updatedContact) => {
				if(err) {
					req.flash("error", err.message);
					return res.redirect("/admin/asiakaspalvelu/"+req.params.id);
				} else {
					sendMail.sendContactReplyConfirmation(req, res, updatedContact, next);
					req.flash("success", "Onnistui! yhteydenottopyyntöön on onnistuneesti vastattu!");
					return res.redirect("/admin/asiakaspalvelu/"+req.params.id);
				}
			});
		}
	});
};
module.exports.updateContact = (req, res, next) => {
	Contact.findById(req.params.id).populate("owner").populate("handler").exec((err, foundContact) => {
		if(err || !foundContact) {
			req.flash("error", "Valitettavasti kyseistä yhteydenottopyyntöä ei löytynyt tietokannasta");
			return res.redirect("/admin/asiakaspalvelu");
		} else {
			foundContact.status = req.body.status;
			foundContact.save((err, updateContact) => {
				if(err) {
					req.flash("error", err.message);
					return res.redirect("/admin/asiakaspalvelu/"+req.params.id);
				} else {
					req.flash("success", "Onnistui! yhteydenottopyynnnön tilaa on onnistuneesti päivitetty!");
					return res.redirect("/admin/asiakaspalvelu/"+req.params.id);
				}
			});
		}
	});
};
module.exports.removeContact = (req, res, next) => {
	Contact.findById(req.params.id, (err, foundContact) => {
		if(err || !foundContact) {
			req.flash("error", "Valitettavasti kyseistä yhteydenottopyyntöä ei löytynyt tietokannasta");
			return res.redirect("/admin/asiakaspalvelu");
		} else {
			if(foundContact.status === "done") {
				foundContact.remove((err) => {
					if(err) {
						req.flash("error", err.message);
						return res.redirect("/admin/asiakaspalvelu/"+req.params.id)
					} else {
						req.flash("success", "Onnistui! yhteydenottopyyntö on onnistuneesti poistettu!");
						return res.redirect("/admin/asiakaspalvelu/"+req.params.id);
					}
				});
			} else {
				req.flash("error", "Valitettavasti kyseistä yhteydenottopyyntöä ei voida poistaa, sillä sitä ei ole vielä käsitelty!");
				return res.redirect("/admin/asiakaspalvelu"+req.params.id);
			}
		}
	});
};