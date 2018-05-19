"use strict";
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const NotificationSchema = new Schema({
	products: [
		{
			type: mongoose.Schema.Types.ObjectId, 
			ref: "Product"
		}
	],
	contacts: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Contact"
		}
	],
	followers: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		}
	],
	isNewProduct: {type: Boolean, default: false},
	isOutOfStock: {type: Boolean, default: false},
	cartsRemoved: {type: Boolean, default: false},
	newContacts: {type: Boolean, default: false},
	isRead: {type: Boolean, default: false}
},
	{
		timestamps: true // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
});
module.exports = mongoose.model("Notification", NotificationSchema);