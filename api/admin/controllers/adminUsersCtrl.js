"use strict";
//Variables as Const
const mongoose 		= require('mongoose');
const User	 		= require('../../../models/user');
const Order	 		= require('../../../models/order');
const paginate 		= require('../middleware/paginate');
//module.exports methods to get list of users
module.exports.listUsers = (req, res, next) => {
	paginate.paginateUsers(req, res, User, (err, done) => {
		if(err) {
			req.flash("error", err);
			return res.redirect("/admin");
		} else {
			res.render("admin/users/index.ejs", {
				users: done.users,
				pages: done.pages,
				items: done.items,
				admin: done.admin
			});
		}
	});
};
//Get single user on show page
module.exports.getUser = (req, res, next) => {
	User.findById(req.params.id).populate("history").select('-password').exec((err, foundUser) => {
		if(err || !foundUser) {
			req.flash("error", "Käyttäjää ei voitu löytää.");
			return res.redirect("back");
		} else {
			res.render("admin/users/show.ejs", {
				found_user: foundUser
			});
		}
	});
};
//Add admin or remove admin rights
module.exports.editAdminAccess = (req, res, next) => {
	User.findById(req.params.id).select('-password').exec((err, foundUser) => {
		if(err || !foundUser) {
			req.flash("error", "Käyttäjää ei voitu löytää.");
			return res.redirect("back");
		} else {
			if(foundUser.admin.isAdmin && foundUser.admin.premission_level === "ultimate") {
				foundUser.admin.premission_level = "basic";
			} if(foundUser.admin.isAdmin && foundUser.admin.premission_level === "basic") {
				foundUser.admin.premission_level = "ultimate";
			} if(foundUser.admin.isAdmin) {
				foundUser.admin.isAdmin = false;
			} else {
				foundUser.admin.isAdmin = true;
			}
			foundUser.save((err, updatedUser) => {
				if(err) {
					req.flash("error", err.messge);
					return res.redirect("back");
				} else {
					req.flash("success", `Käyttäjän ${updatedUser.username} admin oikeuksia on päivitetty.`);
					res.redirect("/admin/user");
				}
			});
		}
	});
};
//update stamps
module.exports.updateStamps = (req, res, next) => {
	User.findById(req.params.id, (err, foundUser) => {
		if(err || !foundUser) {
			req.flash("error", "Käyttäjää ei voitu löytää.");
			return res.redirect("/admin/user/"+user.id);
		} else {
			if(req.body.method === "add"){
				let coupon = null;
				foundUser.bonus_system.stamps = parseInt(foundUser.bonus_system.stamps) + parseInt(req.body.stamps);
				Number(foundUser.bonus_system.stamps) >= 10 ? coupon = {valid_time: Date.now() + 15552000000, valid: true, value: 20} : coupon = null;  
              	if(coupon) {
                	foundUser.bonus_system.coupons.push(coupon);
                	foundUser.bonus_system.stamps = Number(foundUser.bonus_system.stamps) - 10; 
              	}
				foundUser.save((err, updatedUser) => {
					if(err) {
						req.flash("error", err.message);
						return res.redirect("/admin/user/"+user.id);
					} else {
						req.flash("success", "Onnistui! Käyttäjälle "+foundUser.username+" on onnistuneesti lisätty "+req.body.stamps+" leimaa!");
						res.redirect("/admin/user/"+req.params.id);
					}
				});
			} else {
				foundUser.bonus_system.stamps = parseInt(foundUser.bonus_system.stamps) - parseInt(req.body.stamps);
				foundUser.save((err, updatedUser) => {
					if(err) {
						req.flash("error", err.message);
						return res.redirect("/admin/user/"+req.params.id);
					} else {
						req.flash("success", "Onnistui! Käyttäjältä "+foundUser.username+" on onnistuneesti vähennetty "+req.body.stamps+" leimaa!");
						return res.redirect("/admin/user/"+req.params.id)
					}
				});
			}
		}
	});
};