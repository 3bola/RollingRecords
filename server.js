"use strict";
//estalish connection to mongoDB
require('./api/data/dbConnection');
//require all required packages
const express 				= require("express");
//initialize express app
const app 					= express();
const compression 			= require('compression');
const bodyParser 			= require('body-parser');
const sanitizer 			= require('express-sanitizer');
const methodOverRide 		= require('method-override');
const cookieParser 			= require('cookie-parser');
const session 				= require('express-session');
const mongoStore			= require('connect-mongo')(session);
const csrf 					= require('csurf');
const helmet 				= require('helmet');
const flash 				= require('express-flash');
const mongoose 				= require('mongoose');
const passport 				= require('passport');
var   moment 				= require('moment');
const morgan 				= require('morgan');
const path 					= require('path');
const httpServer 			= require('http').Server(app);
const io 					= require('socket.io')(httpServer);
const socketEvents 			= require('./api/data/socketEvents')(io, app);
const ejs 					= require('ejs');
const engine				= require('ejs-mate');
const favicon 				= require('serve-favicon');
//Models
const Product 				= require('./models/product');
const User 					= require('./models/user');
const Cart 					= require('./models/cart');
//Client routes
const indexRoutes 			= require('./api/client/routes');
const profileRoutes 		= require('./api/client/routes/profile');
const authRoutes 			= require('./api/client/routes/auth');
const productRoutes 		= require('./api/client/routes/product');
const cartRoutes 			= require("./api/client/routes/cart");
//Admin routes
const adminRoutes 			= require('./api/admin/routes/admin');
const adminContactRoutes 	= require('./api/admin/routes/contact');
const adminProductRoutes 	= require('./api/admin/routes/product');
const adminOrderRoutes 		= require('./api/admin/routes/order');
const adminDCRoutes 		= require('./api/admin/routes/deliverycost');
const adminUserRoutes 		= require('./api/admin/routes/user');
const adminChratsRoutes 	= require('./api/admin/routes/charts');
const adminFrontpageRoutes 	= require('./api/admin/routes/frontpage');
/*Setup View engine*/
app.use(compression());
app.use(helmet());
app.engine('ejs', engine);
app.set('view-engine', 'ejs');
//set port and ip
app.set("port", process.env.PORT || 3000);
app.set("ip", process.env.IP || "0.0.0.0");
//Headers
//app.disable('x-powered-by');
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Credentials', true);
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
  if ('OPTIONS' == req.method) {
     res.sendStatus(200);
  } else {
     next();
  }
});
//Set up static folder
app.use(express.static(path.join(__dirname + "/public"), {maxAge: 240000}));
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//Setup app packages and middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(sanitizer());
app.use(methodOverRide("_method"));
app.use(cookieParser(/*process.env.KRYPTO_KEY*/));
//Session setup
app.use(session({
	secret: process.env.SECRET,
	resave: false,
	saveUninitialized: false,
	store: new mongoStore({ mongooseConnection: mongoose.connection}),
	cookie: { maxAge: 360 * 60 * 1000}
}));
app.use(passport.initialize());
app.use(passport.session());
//app.use(csrf({ cookie: { signed: true } }));
app.use(flash());
//app.use(csrf({cookie: true}));
// You can set morgan to log differently depending on your environment
if (app.get('env') == 'Websiteion') {
  app.use(morgan('common', { skip: function(req, res) {
    return res.statusCode < 400 }, stream: __dirname + '/../morgan.log'}));
} else {
  app.use(morgan('dev'));
}
//Set sendmail ServerData
app.use((req, res, next) => {
	var SetServerData = require("./api/data/sendMail");
	SetServerData.setServerdata(req, res, next);
	next();
});
//Pass Cart object to the session
app.use((req, res, next) => {
	// if no user and no cart in session
	if(req.session && !req.user && !req.session.cart) {
		let cart = new Cart();
		cart.owner = null;
		cart.status = "temporary";
		cart.save((err, newCart) => {
			if(err) {
				console.error("error", err.message);
				next();
			} else {
				req.session.cart = newCart;
				next();
			}
		});
	}
	if(req.user && !req.user.cart) {
		Cart.findById(req.session.cart._id, (err, foundCart) => {
			if(err || !foundCart) {
				console.error("error", "Ups! Ostoskoria ei voitu hakea tietokantavirheen vuoksi.");
				next();
			} else {
				foundCart.owner = req.user;
				foundCart.status = "permanent";
				foundCart.save((err, updatedCart) => {
					if(err) {
						console.error("error", err.message);
						next();
					} else {
						User.findById(req.user.id, (err, foundUser) => {
							if(err || !foundUser) {
								console.error("error", "Ups! Käyttäjää ei voitu hakea tietokantavirheen vuoksi.");
								next();
							} else {
								foundUser.cart = updatedCart;
								foundUser.save((err, updatedUser) => {
									if(err) {
										console.error("error", err.message);
										next();
									} else {
										req.session.cart = updatedCart;
										next();
									}
								});
							}
						});
					}
				});
			}
		});
	}
	if(req.user && req.user.cart && !req.user.cart.equals(req.session.cart._id)) {
		Cart.findById(req.user.cart).populate("items").exec((err, foundCart) => {
			if(err || !foundCart) {
				User.findById(req.user.id, (err, foundUser) => {
					if(err || !foundUser) {
						console.error("error", "Ups! Käyttäjää ei voitu hakea tietokantavirheen vuoksi.");
						next();
					} else {
						Cart.findById(req.session.cart._id, (err, foundCart) => {
							if(err || !foundCart) {
								let cart = new Cart();
								cart.owner = null;
								cart.status = "temporary";
								cart.save((err, newCart) => {
									if(err) {
										console.error("error", err.message);
										next();
									} else {
										req.session.cart = newCart;
										next();
									}
								});
							} else {
								foundCart.owner = req.user;
								foundCart.status = "permanent";
								foundCart.save((err, updatedCart) => {
									if(err) {
										console.error("error", err.message);
										next();
									} else {
										foundUser.cart = req.session.cart;
										foundUser.save((err, updatedUser) => {
											if(err) {
												console.error("error", err.message);
												next();
											} else {
												req.session.cart = updatedCart;
												next();
											}
										});
									}
								});
							}
						});
					}
				});
			} else {
				if(req.session.cart.items.length > 0) {
					let count = 0;
					for(var i = 0; i < req.session.cart.items.length; i ++) {
						foundCart.items.push({
							item: req.session.cart.items[i],
        					quantity: parseInt(req.session.cart.items[i].total_quantity),
        					unit_price: Number(req.session.cart.items[i].total_price),
        					tax_rate: 24,
        					tax_amount: parseFloat(req.session.cart.items[i].tax_amount).toFixed(2),
        					total_tax_amount: parseFloat(req.session.cart.items[i].total_tax_amount).toFixed(2),
        					unit_price_excluding_tax: parseFloat(req.session.cart.items[i].unit_price_excluding_tax).toFixed(2),
        					total_price_excluding_tax: parseFloat(req.session.cart.items[i].total_unit_price_excluding_tax).toFixed(2),
        					total_price_including_tax: Number(req.session.cart.items[i].total_price)
						});
						count++;
						if(count === req.session.cart.items.length) {
							foundCart.total = req.session.cart.total + foundCart.total;
							foundCart.total_price_excluding_tax = foundCart.total_price_excluding_tax + req.session.cart.total_price_excluding_tax;
							foundCart.total_price_including_tax = foundCart.total_price_including_tax + req.session.cart.total_price_including_tax;
							foundCart.total_tax_amount = foundCart.total_tax_amount + req.session.cart.total_tax_amount;
							foundCart.save((err, updatedCart) => {
								if(err) {
									console.error("error", err.message);
									next();
								} else {
									req.session.cart = updatedCart;
									return next();
								}
							});
						}
					}
				} else {
					req.session.cart = foundCart;
					return next();
				}
			}
		});
	} if(!req.user && req.session.cart || req.user && req.user.cart && req.session.cart._id && req.user.cart.equals(req.session.cart._id)) {
		next();
	}
});
require("moment/min/locales.min");
moment.locale('fi');
app.locals.moment = moment;
//Local variables
app.use(function(req, res, next) {
	//res.cookie('_csrfToken', req.csrfToken());
	res.locals.session = req.session;
	res.locals.cart = req.session.cart;
	res.locals.user = req.user;
	res.locals.error = req.flash('error');
	res.locals.success = req.flash('success');
	next();
});
//Use routes
// client routes
app.use("/", indexRoutes);
app.use("/profiili", profileRoutes);
app.use("/kayttajahallinta", authRoutes);
app.use("/lp:t", productRoutes);
app.use("/ostoskori", cartRoutes);
// admin routes
app.use("/admin", adminRoutes);
app.use("/admin/asiakaspalvelu", adminContactRoutes);
app.use("/admin/product", adminProductRoutes);
app.use("/admin/deliverycost", adminDCRoutes);
app.use("/admin/order", adminOrderRoutes);
app.use("/admin/user", adminUserRoutes);
app.use("/admin/reports", adminChratsRoutes);
app.use("/admin/frontpage", adminFrontpageRoutes);
//Start server
let server = httpServer.listen(app.get("port"), app.get('ip'), (err) => {
	if(err) {
		res.status(500).send(err+" Palvelinta ei voitu käynnistää, teknisen vian vuoksi.");
	} else {
		let port = server.address().port;
		console.log("Rolling Records startattu palvelimella: "+port);
	}
});
