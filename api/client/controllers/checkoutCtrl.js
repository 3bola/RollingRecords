"use strict";
const mongoose = require('mongoose');
const async = require("async");
const klarna = require('klarna-checkout');
const Product = require('../../../models/product');
const Cart = require('../../../models/cart');
const DeliveryCost = require('../../../models/deliveryCost');
//Initialize klarna-checkout package
function initializeKlarna(req, res, done) {
  async.series([
    function(callback) {
        klarna.init({
          eid: process.env.EID,
          secret: process.env.KLARNA_SECRET,
          live: true
        });
        callback(null, 'one');
    },
    function(callback) {
        let cartID = req.session.cart._id;
        klarna.config({
          purchase_country: "FI",     
          purchase_currency: "EUR",   
          locale: "fi-fi",                     
          layout: "desktop",
          terms_uri: "https://www.rollingrecords.fi/kayttoehdot",
          cancellation_terms_uri: "https://www.rollingrecords.fi/kayttoehdot",
          checkout_uri: "https://www.rollingrecords.fi/ostoskori/"+cartID+"/maksu",
          confirmation_uri: "https://www.rollingrecords.fi/ostoskori/"+cartID+"/vahvistus",
          push_uri: "https://www.rollingrecords.fi/ostoskori/"+cartID
        });
        callback(null, 'two');
    }
  ],
  // optional callback
  function(err, results) {;
    // results is now equal to ['one', 'two']
    if(results.length > 0) {
      return done(null, true);
    } else {
      return done(true, false);
    }
  });
};
//Get payment page
module.exports.getCheckoutPage = (req, res, next) => {
  Cart.findById(req.params.id).populate({
    path: "items.item",
    model: "Product"
  }).populate("delivery_cost").exec((err, foundCart) => {
    if(err || !foundCart) {
      req.flash("error", "Ups! Valitettavasti ostoskoria ei voitu hakea tietokannasta, tietokantavirheen vuoksi.");
      return res.redirect("/ostoskori/"+req.params.id+"/kassa");
    } else {
      req.session.pickup_store = req.query.store_location === undefined ? "posti" : req.query.store_location;
      return res.render("cart/payment.ejs", {
        cart: foundCart
      });
    }
  });
};
//Payment route
module.exports.checkout = (req, res, next) => {
  initializeKlarna(req, res, (err, done) => {
    if(done) {
      return klarna.place(req.body).then(function(id) {
        req.session.klarna_id = id;
        return klarna.fetch(id);
      }, function(error) {
        console.error("Klarna init Error", error);
        return res.status(500).send(error);
      }).then(function(order) {
        return res.json({
          "snippet": order.gui.snippet,
          "order": order
        });
      }, function(error) {
        console.error("Klarna init Error", error);
        return res.status(500).send(error);
      });
    } else {
      res.send("error, Jotain meni vikaan");
    }
  });
};
module.exports.confirm = (req, res, id, cb) => {
  return klarna.confirm(id, '1000').then(function(order) {
    return cb(null, order.id);
  }, function(error) {
    return cb(error, false);
  });
};
module.exports.getOrder = (req, res, next) => {
  var id = req.query.klarna_id;
  return klarna.fetch(id).then(function(order) {
      return res.json(order);
    }, function(error) {
      return res.status(500).json(error);
    });
}
module.exports.updateOrder = (req, res, id, cb) => {
   initializeKlarna(req, res, (err, done) => {
    if(done) {
      klarna.update(id, {"delivered": true}).then((order) => {
        return cb(null, order);
      }, function(error) {
        return cb(error, null);
      });
    } else {
      res.send("error, Jotain meni vikaan");
    }
  });
};