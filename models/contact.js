"use strict";
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const contactSchema = new Schema({
	owner: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		default: null
	},
	fullname: String,
	email: String,
	phone: String,
	subject: String,
	message: String,
	status: {type: String, default: "pending"},//also "recived", "done"
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