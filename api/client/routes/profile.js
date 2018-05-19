"use strict";
const express = require('express');
const router = express.Router();
const profileCtrl = require('../controllers/profileCtrl');
const orderCtrl = require("../controllers/orderCtrl");
const authObj = require('../middleware/authObj');
// "/profile" route methods-
router
    .route('/:id')
    .get(authObj.isLoggedIn, profileCtrl.getProfile)
    .put(authObj.isLoggedIn, profileCtrl.editProfile);

router
    .route('/:id/osoite')
    .post(authObj.isLoggedIn, profileCtrl.addAddress)
    .put(authObj.isLoggedIn, profileCtrl.editAddress);

router
    .route('/:id/removeAddress')
    .put(authObj.isLoggedIn, profileCtrl.removeAddress);
// Get coupon form account
router
    .route("/:id/kuponki")
    .get(authObj.isLoggedIn, profileCtrl.getCoupon);
// View an order
router
	.route('/:id/tilaus/:order_id')
	.get(authObj.isLoggedIn, orderCtrl.getOrder);
module.exports = router;