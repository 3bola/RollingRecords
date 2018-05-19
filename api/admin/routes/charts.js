"use strict";
const express = require('express');
const router = express.Router();
const chartsCtrl = require('../controllers/adminChartsCtrl');
const adminAuthObj = require('../middleware/adminAuthObj');
// Methods for /admin/charts/ or /table
router
	.route("/table")
	.get(adminAuthObj.isAdmin, chartsCtrl.getChartTable);
router
	.route("/graph")
	.get(adminAuthObj.isAdmin, chartsCtrl.getChartGraphs);
// Module.exports
module.exports = router;