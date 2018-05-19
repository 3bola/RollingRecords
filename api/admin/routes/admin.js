"use strict";
const express = require('express');
const router = express.Router();
const adminCtrl = require('../controllers/adminCtrl');
const adminAuthObj = require('../middleware/adminAuthObj');
// Methods for "/admin"
router
	.route('/')
	.get(adminAuthObj.isAdmin, adminCtrl.getAdminPanel);
// Get notification 
router
	.route('/notification/:id')
	.get(adminAuthObj.isAdmin, adminCtrl.getNotification)
	.patch(adminAuthObj.isAdmin, adminCtrl.markAsRead);
module.exports = router;