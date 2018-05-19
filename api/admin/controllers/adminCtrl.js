"use strict";
const mongoose = require('mongoose');
const Notification = require('../../../models/notification');
//Get admin Panel
module.exports.getAdminPanel = (req, res, next) => {
	res.render("admin/adminpanel.ejs");
};
// get single notification
module.exports.getNotification = (req, res, next) => {
	Notification.findById(req.params.id).populate("products").exec((err, foundNotification) => {
		if(err || !foundNotification) {
			req.flash("error", "Couldn't find Notification");
			return res.redirect("/admin");
		} else {
			return res.render("admin/notification/show.ejs", {
				notification: foundNotification,
				products: foundNotification.products
			});
		}
	});
};
//Mark as read
module.exports.markAsRead = (req, res, next) => {
	Notification.findById(req.params.id, (err, foundNotification) => {
		if(err || !foundNotification) {
			req.flash("error", "Couldn't find Notification");
			return res.redirect("/admin");
		} else {
			if(foundNotification.isRead) {
				foundNotification.isRead = false;
			} else {
				foundNotification.isRead = true;
			}
			foundNotification.save((err, savedNotification) => {
				if(err) {
					req.flash("error", "Couldn't find Notification");
					return res.redirect("/admin");
				} else {
					res.render("admin/adminpanel.ejs");
				}
			});
		}
	});
};
