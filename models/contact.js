"use strict";
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const contactSchema = new Schema({
	fullname: String,
	email: String,
	phone: String,
	subject: String,
	message: String,
	status: {type: String, default: "pending"},
	handler: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User"
	}
}, 
{
	timestamps: true
});
//Export Schema as mongoose model
module.exports = mongoose.model("Contact", contactSchema);