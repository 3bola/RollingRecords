"use strict";
const express = require('express');
const router = express.Router();
const frontpageCtrl = require('../controllers/adminFrontpageCtrl');
const adminAuthObj = require('../middleware/adminAuthObj');
// Methods for /admin/product
router
	.route("/")
	.get(adminAuthObj.isAdmin, frontpageCtrl.getFrontpageEditingpage);
router
	.route("/:id")
	.put(adminAuthObj.isAdmin, frontpageCtrl.frontpageToggle);
// Module.exports
module.exports = router;