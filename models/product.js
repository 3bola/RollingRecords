"use strict";
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ProductSchema = new Schema({
  status: {type: String, default: "available"},
  title: {type: String},
  fullname: {type: String, required: true},
  name: String,
  unit_price: Number,
  front_page: {type: Boolean, default: false},
  front_page_update: {type: Date},
  unit_price_excluding_tax: {type: Number, default: 0},
  tax: {type: Number, default: 0},
  year: Number,
  releasedate: Date,
  uri: String,
  type: String,
  times_sold: {type: Number, default: 0 /*this is used to track, how popular product is.*/},
  ean: String,
  stamps: Number,
  image_uri: String,
  cover: String,
  cover_id: String,
  image_uri: String,
  category: String,
  description: String,
  additional_info: String,
  edition: String,
  unit_type: String,
  genre: {type: String, default: "Oheistarvikkeet" },
  label: {type: String},
  tracklist: [String],
  stores: [
        {
          quantity: {type: Number, default: 1},
          location: String
        }
  ],
  advance_bookers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  total_quantity: Number,
  description: String,
  discountedPrice: Number,
  vat: Number,
  createdAt: {type: Date, default: Date.now},
  rating: {type: Number, default: 0},
  reviews: [{type: String, default: ""}],
  conditionDisk: {type: String, default: "Uusi Levy"},
  conditionCovers: {type: String, default: "Uusi Levy"}
},
{
  timestamps: true
});
//Methods on ProductSchema
ProductSchema.methods.setPriceTag = (price) => {
  var formattedPrice;
  var nLength = function(a) {
  var e = 1;
  while (Math.round(a * e) / e !== a) e *= 10;
  return Math.log(e) / Math.LN10;
} 
  formattedPrice = `${Number.isInteger(price) ? `${price},00 €` : nLength(price) === 2 ? `${parseFloat(price).toFixed(2)} €` :  nLength(price) > 2 ? `${parseFloat(price).toFixed(2)} €` : `${price}0 €`}`;
  return formattedPrice;
};
//discount rate
ProductSchema.methods.getDiscountRate = function() {
  return parseFloat((this.unit_price - this.discountedPrice)/this.unit_price).toFixed(2) * 100;
};
//Reduce quantity
ProductSchema.methods.reduceQuantity = function(quantity) {
  return Math.ceil(this.quantity - quantity);
};
ProductSchema.index({title: "text", name: "text", label: "text", ean: "text", fullname: "text"});
//Export ProductSchema as model
module.exports = mongoose.model("Product", ProductSchema);

