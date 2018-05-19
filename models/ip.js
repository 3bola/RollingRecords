"use strict";
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ipSchema = new Schema({
	address: String,
	last_visited: {type: Date, default: Date.now}
});

module.exports = mongoose.model("Ip", ipSchema);