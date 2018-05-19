"use strict";
const mongoose 	= require('mongoose');
const User  	= require('../../../models/user');
const crypto 	= require('crypto');
const sendMail 	= require('../../data/sendMail');
const Cart 		= require('../../../models/cart');
//Helper functions
function capitalizeFirstLetter(string) { 
	return string.charAt(0).toUpperCase() + string.slice(1); 
};
module.exports.getSignInForm = (req, res, next) => {
	res.render("auth/signinform.ejs");
};
module.exports.getSignUpForm = (req, res, next) => {
	res.render("auth/signupform.ejs");
};
module.exports.signUp = (req, res, next) => {
	let token = crypto.randomBytes(20).toString('hex');
	User.create({
		username: req.body.username,
		email: req.body.email,
		mobileNumber: req.body.mobile_number,
		name: {
			firstname: capitalizeFirstLetter(req.body.firstname),
			lastname: capitalizeFirstLetter(req.body.lastname)
		},
		completeAddress: {
			address: req.body.address,
			zipcode: req.body.zipcode,
			city: req.body.city
		},
		password: req.body.password,
		user: {
			token: crypto.randomBytes(20).toString("hex"),
			tokenExpires: Date.now() + 3600000
		},
		fullname: capitalizeFirstLetter(req.body.firstname)+" "+capitalizeFirstLetter(req.body.lastname)
	}, function(err, newUser) {
		if(err) {
			return res.status(500).json(err);
		} else {
			sendMail.sendActivationEmail(req, res, newUser, next);
			res.status(201).json({
				success: "success"
			});
		}
	});
};
//compare username and email
module.exports.compareUname = (req, res, next) => {
	if(req.body.username) {
		User.findOne({username: req.body.username}, (err, user) => {
			if(err) {
				res.send(err.message);
				return;
			} if(!user) {
				res.send("success");
				return;
			} else {
				res.send("taken");
			}
		});
	} else {
		return false;
	}
};
module.exports.compareEmail = (req, res, next) => {
	if(req.body.email) {
		User.findOne({email: req.body.email}, (err, user) => {
			if(err) {
				res.send(err.message);
				return;
			} if(!user) {
				res.send("success");
				return;
			} else {
				res.send("taken");
			}
		});
	} else {
		return false;
	}
};
//Verify email
module.exports.getEmailVerificationPage = (req, res, next) => {
	User.findOne({"user.token": req.params.token, "user.tokenExpires": { $gt: Date.now() }}, (err, foundUser) => {
		if(err || !foundUser) {
			req.flash("error", "Ups! Valitettavasti aktivointi linkki on vanhentunut! Voitte lähettää uuden linkin sähköpostiinne, joka on voimassa 60 minuuttia lähetys hetkestä.");
			return res.render("auth/verifyemail.ejs", {
				user: foundUser
			});
		} else {
			res.render("auth/verifyemail.ejs", {
				user: foundUser
			});
		}
	});
};
module.exports.verifyEmail = (req, res, next) => {
	User.findOne({"user.token": req.params.token, "user.tokenExpires": { $gt: Date.now() }}, (err, foundUser) => {
		if(err || !foundUser) {
			req.flash("error", "Ups! Valitettavasti aktivointi linkki on vanhentunut! Voitte lähettää uuden linkin sähköpostiinne, joka on voimassa 60 minuuttia lähetys hetkestä.");
			return res.redirect("/kayttajahallinta/aktivointi/"+req.params.token);
		} else {
			foundUser.user.token = "";
			foundUser.user.tokenExpires = undefined;
			foundUser.user.isVerified = true;
			foundUser.save((err, updatedUser) => {
				if(err) {
					req.flash("error", err.message);
					return res.redirect("/kayttajahallinta/aktivointi/"+req.params.token);
				} else {
					sendMail.activationConfirmation(req, res, updatedUser, next);
					res.redirect("/");
				}
			});
		}
	});
};
//Logout logic
module.exports.signOut = (req, res, next) => {
	req.logout();
	let cart = new Cart();
	cart.owner = null;
	cart.status = "temporary";
	cart.save((err, newCart) => {
		if(err) {
			req.flash("success", err.message);
			res.redirect("/");
			
		} else {
			req.session.cart = newCart;
			req.flash("success", "Kiitos käynnistä, tervetuloa uudelleen!");
			res.redirect("/");
		}
	});
};
//Password recovery
// render pw recovery form
module.exports.getPwRecoveryForm = (req, res, next) => {
	res.render("auth/requestpwrecovery.ejs");
};
// request pw recovery email
module.exports.requestPwRecovery = (req, res, next) => {
	User.findOne({"email": req.body.email}, (err, foundUser) => {
		if(err || !foundUser) {
			req.flash("error", "Valitettavasti antamallanne sähköpostiosoitteella, ei löytynyt yhtäkään käyttäjätiliä.");
			return res.redirect("/kayttajahallinta/salasananpalautus");
		} else {
			foundUser.resetPasswordToken = crypto.randomBytes(20).toString("hex");
			foundUser.resetPasswordExpires = Date.now() + 3600000;
			foundUser.save((err, updatedUser) => {
				if(err) {
					req.flash("error", err.message);
					return res.redirect("/kayttajahallinta/salasananpalautus");
				} else {
					sendMail.sendPasswordRecoveryToken(req, res,updatedUser, next);
					req.flash("success", "Kiitos! Antamaanne sähköpostiosoitteeseen "+req.body.email+" on lähetetty linkki ohjeineen salasanan palutusta varten.");
					res.redirect("/kayttajahallinta/salasananpalautus");
				}
			});
		}
	});
};
// Render pw recovery form
module.exports.getChangePasswordForm = (req, res, next) => {
	User.findOne({"resetPasswordToken": req.params.token, "resetPasswordExpires": {$gt: Date.now()}}, (err, foundUser) => {
		if(err || !foundUser) {
			req.flash("error", "Ups! Valitettavasti salasanan palautus linkki on vanhentunut! Voitte lähettää uuden linkin sähköpostiinne, joka on voimassa 60 minuuttia lähetys hetkestä.");
			return res.render("/");
		} else {
			res.render("auth/confpwrecovery.ejs", {
				user: foundUser
			});
		}
	});
};
module.exports.changePassword = (req, res, next) => {
	User.findOne({"resetPasswordToken": req.params.token, "resetPasswordExpires": {$gt: Date.now()}}, (err, foundUser) => {
		if(err || !foundUser) {
			req.flash("error", "Ups! Valitettavasti salasanan palautus linkki on vanhentunut! Voitte lähettää uuden linkin sähköpostiinne, joka on voimassa 60 minuuttia lähetys hetkestä.");
			return res.redirect("/");
		} else {
			foundUser.resetPasswordToken = "";
			foundUser.resetPasswordExpires = undefined;
			foundUser.password = req.body.newpassword;
			foundUser.save((err, updatedUser) => {
				if(err) {
					req.flash('error', err.message);
					return res.redirect("/kayttajahallinta/salasananpalautus/"+req.params.token);
				} else {
					sendMail.confirmationOnPwChange(req, res, updatedUser, next);
					req.flash("success", "Onnistui! Salasananne on onnistuneesti päivitetty!");
					res.redirect("/kayttajahallinta/kirjaudu");
				}
			})
		}
	});
};