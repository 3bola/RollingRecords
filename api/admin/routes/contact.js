"use strict";
const express = require('express');
const router = express.Router();
const adminContactCtrl = require('../controllers/adminContactCtrl');
const adminAuthObj = require('../middleware/adminAuthObj');
// Methods for "/admin/asiakaspalvelu"
router
	.route("/")
	.get(adminAuthObj.isAdmin, adminContactCtrl.getAllContacts);
// Methods for /admin/asiakaspalvelu/:id
router
	.route("/:id")
	.get(adminAuthObj.isAdmin, adminContactCtrl.getContact)
	.put(adminAuthObj.isAdmin, adminContactCtrl.updateContact)
	.delete(adminAuthObj.isAdmin, adminContactCtrl.removeContact);
module.exports = router;