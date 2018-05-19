"use strict";
const express 		= require('express');
const router 		= express.Router();
const passport 		= require('passport');
const passportConf 	= require('../../config/passport');
const authObj 		= require('../middleware/authObj');
const authCtrl 		= require('../controllers/authCtrl');
// "/auth/signup"
router
	.route("/rekisteroidy")
	.get(authObj.notLoggedIn, authCtrl.getSignUpForm)
	.post(authObj.notLoggedIn, authCtrl.signUp);
// "/auth/signin"
router
	.route("/kirjaudu")
	.get(authObj.notLoggedIn, authCtrl.getSignInForm)
	.post(authObj.notLoggedIn, passport.authenticate('local', {
  		successRedirect: '/',
  		failureRedirect: '/kayttajahallinta/kirjaudu',
  		failureFlash: true
	}));
// compare email and username logic
router
	.route('/compareuname')
	.post(authObj.notLoggedIn, authCtrl.compareUname);
router
	.route('/compareemail')
	.post(authObj.notLoggedIn, authCtrl.compareEmail);
// "/signout"
router
	.route("/kirjaudu-ulos")
	.get(authObj.isLoggedIn, authCtrl.signOut);
// pw recovery
router
	.route("/salasananpalautus")
	.get(authCtrl.getPwRecoveryForm)
	.post(authCtrl.requestPwRecovery);
router
	.route('/salasananpalautus/:token')
	.get(authCtrl.getChangePasswordForm)
	.patch(authCtrl.changePassword);
// Verify user email
router
	.route('/aktivointi/:token')
	.get(authCtrl.getEmailVerificationPage)
	.patch(authCtrl.verifyEmail);
module.exports = router;