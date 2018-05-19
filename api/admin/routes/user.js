"use strict";
const express = require('express');
const router = express.Router({mergeParams: true});
const usersCtrl = require('../controllers/adminUsersCtrl');
const checkOutCtrl = require('../../client/controllers/checkoutCtrl');
const orderCtrl = require('../../client/controllers/orderCtrl');
const profileCtrl = require('../../client/controllers/profileCtrl');
const adminAuthObj = require('../middleware/adminAuthObj');
// Methods for /admin/product
router
	.route("/")
	.get(adminAuthObj.isAdmin, usersCtrl.listUsers);
router
	.route("/:id")
	.get(adminAuthObj.isAdmin, usersCtrl.getUser)
	.put(adminAuthObj.isAdmin, usersCtrl.updateStamps)
	.patch(adminAuthObj.isAdmin, adminAuthObj.checkUltimateAdminLevel, usersCtrl.editAdminAccess)
	.delete(adminAuthObj.isAdmin, adminAuthObj.checkUltimateAdminLevel, profileCtrl.removeProfile);
router
	.route("/:id/order/:order_id")
	.get(adminAuthObj.isAdmin, orderCtrl.showOrder)
	.put(adminAuthObj.isAdmin, orderCtrl.markOrderAsDelivered)
	.patch(adminAuthObj.isAdmin, orderCtrl.markOrderAsPaid);
// Module.exports
module.exports = router;