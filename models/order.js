"use strict";
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const orderSchema = new Schema({
	klarna_id: {type: String},
	items: [{
		item: {
        	type: mongoose.Schema.Types.ObjectId,
        	ref: "Product"
      },
      fullname: {type: String, required: true},
      quantity: {type: Number, default: 0},
      unit_price: {type: Number, default: 0},
      tax_amount: {type: Number, default: 0},
      total_tax_amount: {type: Number, default: 0},
      tax_rate: {type: Number, default: 24},
      unit_price_excluding_tax: {type: Number, default: 0},
      total_price_excluding_tax: {type: Number, default: 0},
      total_price_including_tax: {type: Number, default: 0}
	}],
	client: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User"
	},
	order_number: String,
	payees_information: {
		phone: String,
		email: String,
		firstname: String,
		lastname: String,
		address: {
			street: String,
			zip: String,
			city: String,
			country: {type: String, default: "Suomi / Finland"}
		}
	},
	delivery_method: {
		type: mongoose.Schema.Types.ObjectId, 
		ref: "deliveryCost"
	},
	coupon_id: {type: String, default: null},
	pickup_store : {type: String},
	delivery_store: {type: String, default: "Tampere, Keskusta"},
	stamps: {type: Number},
	paid: {type: Boolean},
	payment_method: {type: String, required: true},//Coupon, in store, klarna
	payment_time: {type: Date, default: Date.now},
	payment: {
		total_price: {type: Number},
		total_price_including_tax: Number,
		total_tax_amount: Number,
		total_price_excluding_tax: Number
	},
	status: {type: String},//"pending", "recieved", "done" and "delivered",
	delivered: {type: Boolean, default: false}
},
{
	timestamps: true
});
orderSchema.methods.setPriceTag = (price) => {
  var formattedPrice;
  var nLength = function(a) {
  var e = 1;
  while (Math.round(a * e) / e !== a) e *= 10;
  return Math.log(e) / Math.LN10;
} 
  formattedPrice = `${Number.isInteger(price) ? `${price},00 €` : nLength(price) === 2 ? `${parseFloat(price).toFixed(2)} €` :  nLength(price) > 2 ? `${parseFloat(price).toFixed(2)} €` : `${price}0 €`}`;
  return formattedPrice;
};
module.exports = mongoose.model("Order", orderSchema);