"use strict";
const mongoose = require('mongoose');
const User = require('../../../models/user');
//Configure authObject
let authObj = {};
authObj.isLoggedIn = (req, res, next) => {
	if(req.isAuthenticated()) {
		return next();
	} else {
		req.session.returnTo = req.originalUrl; 
		req.flash("error", "Vain rekisteröityneet ja kirjautuneet käyttäjät ovat oikeutettuja tähän.");
    	res.redirect("/kayttajahallinta/kirjaudu");
	}
};
authObj.notLoggedIn = (req, res, next) => {
	if(req.user) {
		req.flash("error", "Ups! Olette jo kirjautuneet Rolling Records storeen.");
    	res.redirect("back");
    	return;
	} else {
		next();
	}
};
authObj.hasAddress = (req, res, next) => {
	if(req.user && req.user.completeAddress.address && req.user.completeAddress.zipcode && req.user.completeAddress.city && req.user.mobileNumber) {
		return next();
	} else {
		req.flash("error", "Ups! Olkaa hyvät ja täyttäkää osoitteenne.");
    	return res.redirect("/profiili/"+req.user.id);
	}
};
//Export authObject
module.exports = authObj;