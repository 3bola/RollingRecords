"use strict";
const express = require("express");
const router = express.Router();
const authObj = require('../middleware/authObj');
const cartCtrl = require('../controllers/cartCtrl');
const checkOutCtrl = require('../controllers/checkoutCtrl');
// "/cart/:id" routes
router
  .route("/:id")
  .get(cartCtrl.getCart)
  .post(cartCtrl.addProduct)
  .patch(cartCtrl.updateCart);
router
	.route('/:id/ajax')
	.get(cartCtrl.AjaxCart);
// "/:id/checkout"
router
	.route("/:id/kassa")
	.get(cartCtrl.checkout)
	.put(cartCtrl.updateCartsTotalPrice);
router
	.route('/:id/maksu')
	.get(authObj.isLoggedIn, authObj.hasAddress, checkOutCtrl.getCheckoutPage)
	.post(authObj.isLoggedIn, authObj.hasAddress, checkOutCtrl.checkout);
//confirmation
router
	.route('/:id/vahvistus')
	.get(authObj.isLoggedIn, cartCtrl.getConfirmation)
	.post(authObj.isLoggedIn, authObj.hasAddress, cartCtrl.postConfirmation);
router
	.route("/:id/tilaus")
	.get(authObj.isLoggedIn, authObj.hasAddress, checkOutCtrl.getOrder);
module.exports = router;