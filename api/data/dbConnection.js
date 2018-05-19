"use strict";
const mongoose = require('mongoose');
const dburl = process.env.DATABASE;
mongoose.Promise = global.Promise;

//establish Connection
mongoose.connect(dburl, {useMongoClient: true});

//Mongoose events
//Successfull Connection
mongoose.connection.on("connected", function() {
	console.log("Mongoose Connected to "+dburl);
});
// If the connection throws an error
mongoose.connection.on('error',function (err) {
  console.log('Mongoose default connection error: ' + err);
});
// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
  console.log('Mongoose default connection disconnected');
});
/*Node app statuses*/
/*Localhost*/
process.on('SIGINT', function() {
	mongoose.connection.close(function() {
		console.log('Mongoose default connection disconnected through app termination');
		process.exit(0);
	});
});
/*Heroku*/
process.on('SIGTERM', function() {
	mongoose.connection.close(function() {
		console.log('Mongoose default connection disconnected through app termination (SIGTERM)');
		process.exit(0);
	});
});
/*Nodemon*/
process.once('SIGUSR2', function() {
	mongoose.connection.close(function() {
		console.log('Mongoose default connection disconnected through app termination (SIGUSR2)');
		process.kill(process.pid, 'SIGUSR2');
	});
});

require("../../models/product");
require('../../models/user');
require('../../models/cart');
require('../../models/deliveryCost');