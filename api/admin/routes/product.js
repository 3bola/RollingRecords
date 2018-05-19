"use strict";
const express = require('express');
const router = express.Router();
const adminProductCtrl = require('../controllers/adminProductCtrl');
const adminAuthObj = require('../middleware/adminAuthObj');
// Methods for /admin/product
router
	.route("/")
	.get(adminAuthObj.isAdmin, adminProductCtrl.listProducts)
	.post(adminAuthObj.isAdmin, adminProductCtrl.addProduct);
router
	.route("/add")
	.get(adminAuthObj.isAdmin, adminProductCtrl.getAddProductForm);
router
	.route('/data')
	.post(adminAuthObj.isAdmin, adminProductCtrl.setCropperData);
router
	.route("/checkProductsName")
	.post(adminAuthObj.isAdmin, adminProductCtrl.checkProductsName);
router
	.route("/:id/store")
	.patch(adminAuthObj.isAdmin, adminProductCtrl.setStoreInfo);
router
	.route("/:id/tracklist")
	.patch(adminAuthObj.isAdmin, adminProductCtrl.editTracklist);
router
	.route("/:id/edit")
	.get(adminAuthObj.isAdmin, adminProductCtrl.getEditForm);
router
	.route("/:id/cover")
	.put(adminAuthObj.isAdmin, adminProductCtrl.updateCoverImage);
router
	.route("/:id")
	.put(adminAuthObj.isAdmin, adminProductCtrl.editProduct)
	.patch(adminAuthObj.isAdmin, adminProductCtrl.archiveProduct)
	.delete(adminAuthObj.isAdmin, adminProductCtrl.removeProduct);
// Module.exports
module.exports = router;