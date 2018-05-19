"use strict";
const passport 			= require('passport');
const LocalStrategy 	= require('passport-local').Strategy;
const mongoose 			= require('mongoose');
const User 				= require('../../models/user');
//Serialize and deserialize user
passport.serializeUser((user, done) => {
	done(null, user._id);
});
passport.deserializeUser((id, done)=> {
	User.findById(id).select('-password').exec((err, user) => {
		done(err, user);
	});
});
//Define and use localStrategy
passport.use("local", new LocalStrategy({
	usernameField: "email",
	passwordField: "password",
	passReqToCallback: true
},
(req, email, password, done) => {
	User.findOne({"email": email}).select('+password').exec((err, user) => {
		if(err) {
			return done(null, false, {
				error: err.message
			});
		} if(!user) {
			return done(null, false, {
				message: "Käyttäjää ei löytynyt antamallanne sähköpostiosoitteella."
			});
		} if(!user.comparePassword(password)){
			return done(null, false, {
				message: "Väärä salasana, tarkista isot ja pienet kirjaimet sekä, että caps lock näppäin ei ole päällä."
			});
		} else {
			return done(null, user, req.flash("success", "Arvoisa "+user.username+", tervetuloa takaisin Rolling Records storeen."));
		}
	});
}));