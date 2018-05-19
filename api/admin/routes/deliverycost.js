"use strict";
const express = require('express');
const router = express.Router();
const deliveryCostCtrl = require('../controllers/admindeliveryCostCtrl');
//
router
	.route('/add')
	.get(deliveryCostCtrl.getDeliverycostForm);
router
	.route("/")
	.post(deliveryCostCtrl.addDeliverycost)
	.put(deliveryCostCtrl.updateDeliveryCost)
	.delete(deliveryCostCtrl.removeDeliveryCost);
module.exports = router;