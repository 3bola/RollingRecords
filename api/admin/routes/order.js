"use strict";
const express = require('express');
const router = express.Router();
const orderCtrl = require('../controllers/orderCtrl');
const adminAuthObj = require("../middleware/adminAuthObj");
//Routes for admins to manage orders and their statuses
// get all orders
router
	.route("/")
	.get(adminAuthObj.isAdmin, orderCtrl.listOrders);
// get one order and update orders and delete order
router
	.route('/:id')
	.get(adminAuthObj.isAdmin, orderCtrl.showOrder)
	.put(adminAuthObj.isAdmin, orderCtrl.updateOrder)
	.delete(adminAuthObj.isAdmin, orderCtrl.deleteOrder);
//export router
module.exports = router;