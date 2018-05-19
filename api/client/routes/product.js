"use strict";
const express 		= require('express');
const router 		= express.Router();
const productCtrl 	= require('../controllers/productCtrl');
// "/product" routes
router
	.route('/')
	.get(productCtrl.getProducts);
// "/product/:id" routes
router
	.route("/:id")
	.get(productCtrl.getProduct);
module.exports = router;