"use strict";
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = new Schema({
  payment_method: String,
  owner: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    default: null
  },
  total: {type: Number, default: 0},
  total_price_excluding_tax: {type: Number, default: 0},
  total_tax_amount: {type: Number, default: 0},
  total_price_including_tax: {type: Number, default: 0},
  delivery_cost: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "deliveryCost"
  },
  bonus_system: {
    permanent_total_price: {type: Number, default: 0},
    total_price: {type: Number, default: 0},//This will only contain prices of products, that are a part of bonusSystem.
    stamps: {type: Number, default: 0},
    coupon_id: {type: String, default: null},
    coupon_value:{ type: Number, default: null}
  },
  delivery_store: {type: String},
  total_price: {type: Number, default: 0},
	items: [
    {
      item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
      },
      item_id: {type: String},
      quantity: {type: Number, default: 0},
      unit_price: {type: Number, default: 0},
      tax_amount: {type: Number, default: 0},
      total_tax_amount: {type: Number, default: 0},
      tax_rate: {type: Number, default: 24},
      unit_price_excluding_tax: {type: Number, default: 0},
      total_price_excluding_tax: {type: Number, default: 0},
      total_price_including_tax: {type: Number, default: 0}
    }
  ],
  status: {type: String, default: "temporary"}
},
{
  timestamps: true
});
// helper method to remove expired cart
cartSchema.methods.removeCart = () => {
  if(this.expires === Date.now() || this.expires < Date.now()) {
    this.remove((err, done) => {
      if(err) {
        return false;
      } else {
        return true;
      }
    });
  }
};
cartSchema.methods.setPriceTag = (price) => {
  var formattedPrice;
  var nLength = function(a) {
  var e = 1;
  while (Math.round(a * e) / e !== a) e *= 10;
  return Math.log(e) / Math.LN10;
} 
  formattedPrice = `${Number.isInteger(price) ? `${price},00 €` : nLength(price) === 2 ? `${parseFloat(price).toFixed(2)} €` :  nLength(price) > 2 ? `${parseFloat(price).toFixed(2)} €` : `${price}0 €`}`;
  return formattedPrice;
};
module.exports = mongoose.model("Cart", cartSchema);
