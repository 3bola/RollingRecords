var mongoose 	= require('mongoose'),
	Schema 		= mongoose.Schema;

var deliveryCostSchema = new Schema({
	name: String,
	index: Number,
	unit_type: {type: String, default: "shipping_fee" /* Required by Klarna */},
	unit_price: {type: Number, default: 0},
	tax_rate: {type: Number, default: 24},
	unit_price_excluding_tax: {type: Number, default: 0},
	tax: {type: Number, default: 0},
	description: {type: String, default: ""},
	quantity: {type: Number, default: 1}
});

module.exports = mongoose.model('deliveryCost', deliveryCostSchema);