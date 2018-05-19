"use strict";
const express = require('express');
const router = express.Router();
const indexCtrl = require('../controllers/indexCtrl');
const productCtrl = require('../controllers/productCtrl');
// landingpage
router
	.route("/")
	.get(productCtrl.setLandingPage);
// "/conditions"
router
	.route('/kayttoehdot')
	.get(indexCtrl.getConditionsPage);
router
	.route('/ostamme-levyja')
	.get(indexCtrl.getAdvertisement);
//asiakaspalvelu 
router
	.route('/asiakaspalvelu')
	.get(indexCtrl.customerservice)
	.post(indexCtrl.customerservicePost);
// bonusjärjestelmän ehdot
router
	.route("/bonusjarjestelma")
	.get(indexCtrl.customerLoyaltyConditions);
// "/*" to catch all not existing routes and redirect to root of the app.
module.exports = router;