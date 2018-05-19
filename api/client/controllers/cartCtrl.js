"use strict";
const mongoose = require('mongoose');
const request  = require('request');
const async = require('async');
const crypto = require('crypto');
const MailServer = require('../../data/sendMail');
const checkOutCtrl = require('./checkoutCtrl');
//Schemas
const Cart    = require('../../../models/cart');
const Product = require('../../../models/product');
const DeliveryCost = require('../../../models/deliveryCost');
const User    = require('../../../models/user');
const Order   = require('../../../models/order');
// Methods for "/" route
//Get cart
module.exports.getCart = function(req, res, next) {
  //check if there are user and cart stored in the session,
  //if so, then render cart with populated products in it.
  //if there are no cart in the session, create new cart.
  Cart.findById(req.params.id).populate({
    path: "items.item",
    model: "Product"
  }).populate("delivery_cost").populate("owner").exec((err, foundCart) => {
    if(err || !foundCart) {
      req.flash("error", "Ostoskoria ei löytynyt.");
      return res.redirect("/lp:t");
    } else {
      req.session.cart = foundCart;
      if(req.xhr) {
        return res.json(foundCart);
      } else {
        res.render("cart/cart.ejs", {
          cart: foundCart
        });
      }
    }
  });
};
module.exports.AjaxCart = (req, res, next) => {
  Cart.findById(req.params.id).populate({
    path: "items.item",
    model: "Product"
  }).populate("delivery_cost").populate("owner").exec((err, foundCart) => {
    if(err || !foundCart) {
      req.flash("error", "Ostoskoria ei löytynyt.");
      return res.redirect("/lp:t");
    } else {
      req.session.cart = foundCart;
      return res.json(foundCart);
    }
  });
}
//Add items to the cart
module.exports.addProduct = (req, res, next) => {
  Cart.findById(req.params.id, (err, foundCart) => {
    if(err || !foundCart) {
      return res.send("error");
    } else {
       let bonus_system = {
          coupon_id: foundCart.bonus_system.coupon_id,
          coupon_value: foundCart.bonus_system.coupon_value,
          permanent_total_price: foundCart.bonus_system.permanent_total_price,
          total_price: foundCart.bonus_system.total_price,
          stamps: foundCart.bonus_system.stamps
      };
      if(req.body.genre !== "Svart-records") {
        bonus_system.permanent_total_price = Number(bonus_system.permanent_total_price) + Number(req.body.unit_price);
        bonus_system.total_price = bonus_system.total_price + Number(req.body.total_price);
        bonus_system.stamps = parseInt(bonus_system.total_price / 20);
      }
      let itemObj = {
        item_id: req.body.id,
        item: req.body.id,
        quantity: parseInt(req.body.total_quantity),
        unit_price: Number(req.body.total_price),
        tax_rate: 24,
        tax_amount: parseFloat(req.body.tax_amount).toFixed(2),
        total_tax_amount: parseFloat(req.body.total_tax_amount).toFixed(2),
        unit_price_excluding_tax: parseFloat(req.body.unit_price_excluding_tax).toFixed(2),
        total_price_excluding_tax: parseFloat(req.body.total_unit_price_excluding_tax).toFixed(2),
        total_price_including_tax: Number(req.body.total_price),
      };
      foundCart.bonus_system = bonus_system;
      foundCart.total_price_including_tax = (foundCart.total_price_including_tax + Number(req.body.total_price));
      foundCart.total_price_excluding_tax = (foundCart.total_price_excluding_tax + parseFloat(req.body.total_unit_price_excluding_tax)).toFixed(2);
      foundCart.total_tax_amount = (foundCart.total_tax_amount + parseFloat(req.body.total_tax_amount)).toFixed(2);
      foundCart.items.push(itemObj);
      foundCart.total = (foundCart.total + Number(req.body.total_quantity));
      foundCart.save((err, savedCart)=> {
        if(err) {
          return res.send("error");
        } else {
          req.session.cart = savedCart;
          res.json(savedCart);
        }
      });
    }
  });
};
// update Cart items
module.exports.updateCart = (req, res, next) => {
  Cart.findById(req.params.id, (err, foundCart)=> {
    if(err || !foundCart) {
      return res.send("error");
    } else {
      if(req.body.method === "exclude") {
        // if req has option to exclude one item or add one
        let bonus_system = {
          coupon_id: foundCart.bonus_system.coupon_id,
          coupon_value: foundCart.bonus_system.coupon_value,
          permanent_total_price: foundCart.bonus_system.permanent_total_price,
          total_price: foundCart.bonus_system.total_price,
          stamps: foundCart.bonus_system.stamps
        };
        if(req.body.genre !== "Svart-records") {
          bonus_system.permanent_total_price = Number(bonus_system.permanent_total_price) - Number(req.body.unit_price);
          bonus_system.total_price = Number(bonus_system.total_price) - Number(req.body.unit_price);
          bonus_system.stamps = parseInt(bonus_system.total_price / 20);
        }
        var updatedItem = {
          item_id: req.body.id,
          item: req.body.id,
          quantity: parseInt(req.body.total_quantity),
          unit_price: Number(req.body.unit_price),
          tax_rate: 24,
          tax_amount: parseFloat(req.body.tax_amount).toFixed(2),
          total_tax_amount: parseFloat(req.body.total_tax_amount).toFixed(2),
          total_price_excluding_tax: parseFloat(req.body.total_unit_price_excluding_tax).toFixed(2),
          unit_price_excluding_tax: parseFloat(req.body.unit_price_excluding_tax).toFixed(2),
          total_price_including_tax: Number(req.body.total_price)
        };
        var itemIndex;
        var itemIndexs = foundCart.items.some(function (elem, i) {
          return elem.item_id == req.body.id ? (itemIndex = i, true) : false;
        });
        foundCart.items.splice(itemIndex, 1, updatedItem);
        foundCart.bonus_system = bonus_system;
        foundCart.total_price_including_tax = (foundCart.total_price_including_tax - Number(req.body.unit_price));
        foundCart.total_price_excluding_tax = (foundCart.total_price_excluding_tax - parseFloat(req.body.unit_price_excluding_tax)).toFixed(2);
        foundCart.total_tax_amount = (foundCart.total_tax_amount - parseFloat(req.body.tax_amount)).toFixed(2);
        foundCart.total = (foundCart.total - 1);
        foundCart.save((err, updatedCart) => {
          if(err) {
           return res.send("error");
          } else {
            req.session.cart = updatedCart;
            return res.json(updatedCart);
          }
          return;
        });
      } else if(req.body.method === "add") {
        let bonus_system = {
          coupon_id: foundCart.bonus_system.coupon_id,
          coupon_value: foundCart.bonus_system.coupon_value,
          permanent_total_price: foundCart.bonus_system.permanent_total_price,
          total_price: foundCart.bonus_system.total_price,
          stamps: foundCart.bonus_system.stamps
        };
        if(req.body.genre !== "Svart-records") {
          bonus_system.permanent_total_price = Number(bonus_system.permanent_total_price) + Number(req.body.unit_price);
          bonus_system.total_price = Number(bonus_system.total_price) + Number(req.body.unit_price);
          bonus_system.stamps = parseInt(bonus_system.total_price / 20);
        }
        var updatedItem = {
          item_id: req.body.id,
          item: req.body.id,
          quantity: parseInt(req.body.total_quantity),
          unit_price: Number(req.body.unit_price),
          tax_rate: 24,
          tax_amount: parseFloat(req.body.tax_amount).toFixed(2),
          total_tax_amount: parseFloat(req.body.total_tax_amount).toFixed(2),
          unit_price_excluding_tax: parseFloat(req.body.unit_price_excluding_tax).toFixed(2),
          total_price_excluding_tax: parseFloat(req.body.total_unit_price_excluding_tax).toFixed(2),
          total_price_including_tax: Number(req.body.total_price)
        };
        var itemIndex;
        var itemIndexs = foundCart.items.some(function (elem, i) {
          return elem.item_id == req.body.id ? (itemIndex = i, true) : false;
        });
        foundCart.items.splice(itemIndex, 1, updatedItem);
        foundCart.bonus_system = bonus_system;
        foundCart.total_price_including_tax = (foundCart.total_price_including_tax + Number(req.body.unit_price));
        foundCart.total_price_excluding_tax = (foundCart.total_price_excluding_tax + parseFloat(req.body.unit_price_excluding_tax)).toFixed(2);
        foundCart.total_tax_amount = (foundCart.total_tax_amount + parseFloat(req.body.tax_amount)).toFixed(2);
        foundCart.total = (foundCart.total + 1);
        foundCart.save((err, updatedCart) => {
          if(err) {
            return res.send("error");
          } else {
            req.session.cart = updatedCart;
            return res.json(updatedCart);
          }
        });
      } else {
        // else carts item will be removed
        let bonus_system = {
          coupon_id: foundCart.bonus_system.coupon_id,
          coupon_value: foundCart.bonus_system.coupon_value,
          permanent_total_price: foundCart.bonus_system.permanent_total_price,
          total_price: foundCart.bonus_system.total_price,
          stamps: foundCart.bonus_system.stamps
        };
        if(req.body.genre !== "Svart-records") {
          bonus_system.permanent_total_price = Number(bonus_system.permanent_total_price) - Number(req.body.total_price);
          bonus_system.total_price = Number(bonus_system.total_price) - Number(req.body.total_price);
          bonus_system.stamps = parseInt(bonus_system.total_price / 20);
        }
        foundCart.items.pull(req.body.item_id);
        foundCart.bonus_system = bonus_system;
        foundCart.total_price_including_tax = (foundCart.total_price_including_tax - Number(req.body.total_price));
        foundCart.total_price_excluding_tax = (foundCart.total_price_excluding_tax - parseFloat(req.body.total_unit_price_excluding_tax)).toFixed(2);
        foundCart.total_tax_amount = (foundCart.total_tax_amount - parseFloat(req.body.total_tax_amount)).toFixed(2);
        foundCart.total = (foundCart.total - parseInt(req.body.total_quantity));
        foundCart.save((err, updatedCart) => {
          if(err) {
            return res.send("error");
          } else {
            req.session.cart = updatedCart;
            res.json(updatedCart);
          }
        });
      }
      return;
    }
  });
};
//Update total_price
module.exports.updateCartsTotalPrice = (req, res, next) => {
  if(req.xhr && req.body.value === "KuponkiID") {
    console.log("bonus");
    Cart.findById(req.params.id, (err, foundCart) => {
      if(err || !foundCart) {
        return res.status(404).json("cart not found");
      } else {
       foundCart.total_price = Number(foundCart.total_price) - 20;
       foundCart.bonus_system.total_price = Number(foundCart.bonus_system.permanent_total_price) === 0 ? Number(foundCart.bonus_system.total_price) = 0 : Number(foundCart.bonus_system.total_price) - 20;
       foundCart.bonus_system.coupon_id = req.body.couponId;
       foundCart.bonus_system.coupon_value = 20;
       foundCart.bonus_system.stamps = parseInt(foundCart.bonus_system.total_price / 20);
       foundCart.save((err, updatedCart) => {
        if(err) {
          return res.status(500).json(err);
        } else {
          req.session.updatedCart;
          return res.status(200).json({
            "total_price": updatedCart.total_price,
            "bonus_system_total_price": updatedCart.bonus_system.total_price
          });
        }
       });
      }
    }); // puh unifaun. 0753252505
  } else {
    Cart.findById(req.params.id, (err, foundCart) => {
      if(err || !foundCart) {
        return res.status(404).json("cart not found");
      } else {
        DeliveryCost.findById(req.body.id, (err, dcost) => {
          if(err || !dcost) {
            return res.status(404).json("deliverycost not found");
          } else {
            foundCart.delivery_cost = dcost;
            foundCart.total_price = Number(foundCart.total_price_including_tax) + Number(dcost.unit_price);
            if(foundCart.bonus_system.coupon_id !== null) {
              foundCart.total_price = Number(foundCart.total_price) - 20;
              foundCart.bonus_system.total_price = foundCart.bonus_system.permanent_total_price;
              foundCart.bonus_system.total_price = Number(foundCart.bonus_system.permanent_total_price) === 0 ? Number(foundCart.bonus_system.total_price) = 0 : Number(foundCart.bonus_system.total_price) - 20;
              foundCart.bonus_system.stamps = parseInt(foundCart.bonus_system.total_price / 20);
            }
            foundCart.save((err, updatedCart) => {
              if(err) {
                return res.json(err);
              } else {
                req.session.updatedCart;
                return res.status(200).json(updatedCart.total_price);
              }
            });
          }
        });
      }
    });
  }
};
// Checkout
module.exports.checkout = (req, res, next) => {
  Cart.findById(req.params.id).populate({
    path: "items.item",
    model: "Product"
  }).exec((err, foundCart) => {
    if(err || !foundCart) {
      req.flash("error", "Ostoskoria ei voitu löytää.");
      return res.redirect('back');
    } else if(foundCart.bonus_system.coupon_id !== null) {
      DeliveryCost.find({}).sort({"index": 1}).exec((err, foundDeliveryCosts) => {
        if(err || !foundDeliveryCosts) {
          req.flash("error", "Toimituskuluja ei voitu löytää.");
          return res.redirect("/ostoskori/"+foundCart._id);
        } else {
            foundCart.delivery_cost = foundDeliveryCosts[0];
            foundCart.total_price = (Number(foundCart.total_price_including_tax) + Number(foundDeliveryCosts[0].unit_price)) - 20;
            foundCart.bonus_system.total_price = foundCart.bonus_system.permanent_total_price;
            foundCart.bonus_system.total_price = Number(foundCart.bonus_system.permanent_total_price) === 0 ? Number(foundCart.bonus_system.total_price) = 0 : Number(foundCart.bonus_system.total_price) - 20;
            foundCart.bonus_system.stamps = parseInt(foundCart.bonus_system.total_price / 20);
            foundCart.save((err, UpdatedCart) => {
              if(err) {
                req.flash("error", err.message);
                return res.redirect("/ostoskori/"+req.params.id);
              } else {
                req.session.cart = UpdatedCart;
                return res.render("cart/checkout.ejs", {
                  cart: UpdatedCart,
                  deliveryCosts: foundDeliveryCosts
                });
              }
            });
          }
      });
    } else {
      DeliveryCost.find({}).sort({"index": 1}).exec((err, foundDeliveryCosts) => {
        if(err || !foundDeliveryCosts) {
          req.flash("error", "Toimituskuluja ei voitu löytää.");
          return res.redirect("/ostoskori/"+foundCart._id);
        } else {
            foundCart.delivery_cost = foundDeliveryCosts[0];
            foundCart.total_price = Number(foundCart.total_price_including_tax) + Number(foundDeliveryCosts[0].unit_price);
            foundCart.save((err, UpdatedCart) => {
              if(err) {
                req.flash("error", err.message);
                return res.redirect("/ostoskori/"+req.params.id);
              } else {
                req.session.cart = UpdatedCart;
                return res.render("cart/checkout.ejs", {
                  cart: UpdatedCart,
                  deliveryCosts: foundDeliveryCosts
                });
              }
            });
          }
      });
    }
  });
};
//This method is used, when order has been made without payment online.
module.exports.postConfirmation = (req, res, next) => {
  var tempItem;
  Cart.findById(req.params.id).populate({path: "items.item", model: "Product"}).populate("delivery_cost").populate("owner").exec((err, foundCart) => {
    if(err || !foundCart) {
      req.flash("error", "Ups! Jotain meni pieleen ostoskoria haettaessa.");
      return res.redirect("/ostoskori/"+req.session.cart._id+"/maksu");
    } else {
      let order_items = [];
      for(var i = 0; i < foundCart.items.length; i++) {
        let item = {
          item: foundCart.items[i].item,
          fullname: foundCart.items[i].item.fullname,
          quantity: Number(foundCart.items[i].quantity),
          total_tax_amount: Number(foundCart.items[i].total_tax_amount),
          total_price_including_tax: Number(foundCart.items[i].total_price_including_tax),
          total_price_excluding_tax: Number(foundCart.items[i].total_price_excluding_tax)
        }
        order_items.push(item);
      }
      let order = new Order();
      order.klarna_id = null;
      order.order_number = crypto.randomBytes(10).toString('hex');
      order.status = "pending"; //also "processing", "done" and "recived";
      order.items = order_items;
      order.pickup_store = req.session.pickup_store;
      order.items.fullname = foundCart.items.item
      order.delivery_method = foundCart.delivery_cost;
      order.payment_method = req.body.payment_method;
      order.paid = false;
      order.client = req.user;
      order.stamps = foundCart.bonus_system.stamps;
      order.coupon_id = foundCart.bonus_system.coupon_id ? foundCart.bonus_system.coupon_id : null;
      order.payment.total_price_including_tax = Number(foundCart.total_price_including_tax);
      order.payment.total_price_excluding_tax = Number(foundCart.total_price_excluding_tax);
      order.payment.total_tax_amount = Number(foundCart.total_tax_amount);
      order.payment.total_price = Number(foundCart.total_price);
      order.payees_information.email = req.body.email;
      order.payees_information.phone = req.body.phone;
      order.payees_information.firstname = req.body.firstname;
      order.payees_information.lastname = req.body.lastname;
      order.payees_information.address.street = req.body.street === true ? req.body.street : "";
      order.payees_information.address.street = req.body.zip === true ? req.body.zip : "";
      order.payees_information.address.street = req.body.city === true ? req.body.city : "";
      order.save((err, newOrder) => {
        if(err) {
          req.flash("error", err.message);
          return res.redirect("back");
        } else {
          if(foundCart.owner) {
            User.findById(foundCart.owner._id).select("-password").exec((err, foundUser) => {
              if(err || !foundUser) {
                req.flash("error", "Ups! Valitettavasti tapahtui virhe ostoskorin omistajaa haettaessa.");
                return res.redirect("/ostoskori"+req.params.id+"/maksu");
              } else {
                if(foundCart.bonus_system.coupon_id) {
                  var pulledCoupon = foundUser.bonus_system.coupons.pull({_id: foundCart.bonus_system.coupon_id});
                  pulledCoupon.valid = false;
                  pulledCoupon.value = 20;
                  pulledCoupon.valid_time = Date.now();
                  pulledCoupon.createdAt = Date.now();
                  pulledCoupon._id = foundCart.bonus_system.coupon_id;
                  console.log(pulledCoupon);
                  foundUser.bonus_system.coupons.push(pulledCoupon);
                  console.log(foundUser.bonus_system);
                }
                foundUser.bonus_system.stamps = foundUser.bonus_system.stamps;
                foundUser.history.push(newOrder);
                if(foundCart.coupon_id) {
                  foundUser.bonus_system.coupons.pull({_id: foundCart.coupon_id});
                }
                foundUser.save((err, updatedUser) => {
                  if(err) {
                    req.flash("error", err.message);
                    return res.redirect("/ostoskori/"+req.params.id+"/maksu");
                  } else {
                    var count = 0;
                    foundCart.items.forEach((item) => {
                      Product.findById(item.item._id, (err, foundProduct) => {
                        if(err || !foundProduct) {
                          req.flash("error", "Ups! Valitettavasti tapahtui virhe ostoskorin tuotteita haettaessa.");
                          return res.redirect("/ostoskori"+req.params.id+"/maksu");
                        } else {
                          foundProduct.total_quantity = Number(foundProduct.total_quantity) - Number(item.quantity);
                          let newStoreInfo = {};
                          if(foundProduct.stores.length > 1 && newOrder.pickup_store === "Helsinki, Sörnäinen") {
                            var locationIndex;
                            var removedLocation;
                            locationIndex = foundProduct.stores.map(function(store) { return store.location; }).indexOf(newOrder.pickup_store);
                            removedLocation = foundProduct.stores.splice(locationIndex, 1);
                            newStoreInfo.location = removedLocation[0].location;
                            newStoreInfo._id = removedLocation[0]._id;
                            newStoreInfo.quantity = Number(removedLocation[0].quantity) - Number(item.quantity);
                            foundProduct.stores.splice(locationIndex, 0, newStoreInfo);
                          } else if(foundProduct.stores.length > 1 && newOrder.pickup_store === "Tampere, Keskusta") {
                            var locationIndex;
                            var removedLocation;
                            locationIndex = foundProduct.stores.map(function(store) { return store.location; }).indexOf(newOrder.pickup_store);
                            removedLocation = foundProduct.stores.splice(locationIndex, 1);
                            newStoreInfo.location = removedLocation[0].location;
                            newStoreInfo._id = removedLocation[0]._id;
                            newStoreInfo.quantity = Number(removedLocation[0].quantity) - Number(item.quantity);
                            foundProduct.stores.splice(locationIndex, 0, newStoreInfo);
                          } else if(foundProduct.stores.length === 1){
                            var shiftedLocation = foundProduct.stores.shift(foundProduct.stores[0]);
                            newStoreInfo.location = shiftedLocation.location;
                            newStoreInfo.quantity = Number(shiftedLocation.quantity) - Number(item.quantity);
                            foundProduct.stores.unshift(newStoreInfo);
                          }
                          foundProduct.times_sold = foundProduct.times_sold + 1;
                          foundProduct.save((err, updatedProduct) => {
                            if(err) {
                              req.flash("error", err.message);
                              return res.redirect("/ostoskori/"+req.params.id+"/maksu");
                            } else {
                              count++;
                              if(count === foundCart.items.length) {
                                foundCart.items = [];
                                foundCart.delivery_cost = null;
                                foundCart.total = 0;
                                foundCart.total_price_excluding_tax = 0;
                                foundCart.total_price_including_tax = 0;
                                foundCart.total_tax_amount = 0;
                                foundCart.total_price = 0;
                                foundCart.payment_method = "";
                                foundCart.bonus_system.total_price = 0;
                                foundCart.bonus_system.stamps = 0;
                                foundCart.bonus_system.coupon_id = null;
                                foundCart.bonus_system.coupon_value = null;
                                foundCart.save((err, resettedCart) => {
                                  if(err) {
                                    req.flash("error", err.message);
                                    return res.redirect("/ostoskori/"+req.params.id+"/maksu");
                                  } else {
                                    MailServer.orderConfirmation(req, res, newOrder, next);
                                    MailServer.sendNotificationOnNewOrder(req, res, newOrder, foundUser, next);
                                    req.session.cart = resettedCart;
                                    req.flash("success", "Onnistui! Rolling Records store kiittää tilauksesta! Tilaus on vastaanotettu ja sitä käsitellään!");
                                    res.render("cart/confirmation.ejs", {
                                      order: newOrder
                                    });
                                  }
                                });
                              }
                            }
                          });
                        }
                      });
                    });
                  }
                });
              }
            });
          }
        }
      });
    }
  });
};
//Confiramtion
//This method is instead used when payment is is done using Klarna.
module.exports.getConfirmation = (req, res, next) => {
  var tempItem;
  Cart.findById(req.params.id).populate({path: "items.item", model: "Product"}).populate("delivery_cost").populate("owner").exec((err, foundCart) => {
    if(err || !foundCart) {
      req.flash("error", "Ups! Jotain meni pieleen ostoskoria haettaessa.");
      return res.redirect("/ostoskori/"+req.session.cart._id+"/maksu");
    } else {
      let order_items = [];
      for(var i = 0; i < foundCart.items.length; i++) {
        let item = {
          item: foundCart.items[i].item,
          fullname: foundCart.items[i].item.fullname,
          quantity: Number(foundCart.items[i].quantity),
          total_tax_amount: Number(foundCart.items[i].total_tax_amount),
          total_price_including_tax: Number(foundCart.items[i].total_price_including_tax),
          total_price_excluding_tax: Number(foundCart.items[i].total_price_excluding_tax)
        }
        order_items.push(item);
      }
      let order = new Order();
      order.order_number = crypto.randomBytes(10).toString('hex');
      order.status = "pending"; //also "processing", "done" and "delivered";
      order.items = order_items;
      order.items.fullname = foundCart.items.item
      order.delivery_method = foundCart.delivery_cost;
      order.payment_method = req.body.payment_method === "maksu myymälään" ? req.body.payment_method : "klarna";
      order.paid = true;
      order.client = req.user;
      order.pickup_store = req.session.pickup_store === "Helsinki, Sörnäinen" ? req.session.pickup_store : req.session.pickup_store === "Helsinki, Sörnäinen" ? req.session.pickup_store : "posti";
      order.payees_information.email = req.user.email;
      order.payees_information.phone = req.user.mobileNumber;
      order.payees_information.firstname = req.user.name.firstname;
      order.payees_information.lastname = req.user.name.lastname;
      order.payment.total_price_including_tax = Number(foundCart.delivery_cost.unit_price) !== 0 ? Number(foundCart.total_price_including_tax) + Number(foundCart.delivery_cost.unit_price) : Number(foundCart.total_price_including_tax);
      order.payment.total_price_excluding_tax = Number(foundCart.delivery_cost.unit_price) !== 0 ? Number(foundCart.total_price_excluding_tax) + Number(foundCart.delivery_cost.unit_price) : Number(foundCart.total_price_excluding_tax);
      order.payment.total_tax_amount = Number(foundCart.delivery_cost.unit_price) !== 0 ? Number(foundCart.total_tax_amount) + Number(foundCart.delivery_cost.unit_price) : Number(foundCart.total_tax_amount);
      order.payment.total_price = Number(foundCart.total_price);
      order.payees_information.address.street = req.user.completeAddress.address === true ? req.user.completeAddress.address : "";
      order.payees_information.address.street = req.user.completeAddress.zipcode === true ? req.user.completeAddress.zipcode : "";
      order.payees_information.address.street = req.user.completeAddress.city === true ? req.user.completeAddress.city : "";
      order.save((err, newOrder) => {
        if(err) {
          req.flash("error", err.message);
          return res.redirect("back");
        } else {
          if(foundCart.owner) {
            User.findById(foundCart.owner._id).select("-password").exec((err, foundUser) => {
              if(err || !foundUser) {
                req.flash("error", "Ups! Valitettavasti tapahtui virhe ostoskorin omistajaa haettaessa.");
                return res.redirect("/ostoskori/"+req.params.id+"/maksu");
              } else {
                if(req.body && req.body.payment_method === "maksu myymälään") {
                   foundUser.bonus_system.stamps = foundUser.bonus_system.stamps;
                } else {
                  foundUser.bonus_system.stamps = foundUser.bonus_system.stamps + foundCart.bonus_system.stamps;
                }
                let coupon = null;
                Number(foundUser.bonus_system.stamps) >= 10 ? coupon = {valid_time: Date.now() + 15552000000, valid: true, value: 20} : coupon = null;  
                if(coupon) {
                  foundUser.bonus_system.coupons.push(coupon);
                  foundUser.bonus_system.stamps = Number(foundUser.bonus_system.stamps) - 10; 
                }
                foundUser.history.push(newOrder);
                foundUser.save((err, updatedUser) => {
                  if(err) {
                    req.flash("error", err.message);
                    return res.redirect("/ostoskori/"+req.params.id+"/maksu");
                  } else {
                    var count = 0;
                    foundCart.items.forEach((item) => {
                      Product.findById(item.item._id, (err, foundProduct) => {
                        if(err || !foundProduct) {
                          req.flash("error", "Ups! Valitettavasti tapahtui virhe ostoskorin tuotteita haettaessa.");
                          return res.redirect("/ostoskori/"+req.params.id+"/maksu");
                        } else {
                          foundProduct.total_quantity = Number(foundProduct.total_quantity) - Number(item.quantity);
                          let newStoreInfo = {};
                          if(foundProduct.stores.length > 1 && newOrder.pickup_store === "Helsinki, Sörnäinen") {
                            var locationIndex;
                            var removedLocation;
                            locationIndex = foundProduct.stores.map(function(store) { return store.location; }).indexOf(newOrder.pickup_store);
                            removedLocation = foundProduct.stores.splice(locationIndex, 1);
                            newStoreInfo.location = removedLocation[0].location;
                            newStoreInfo._id = removedLocation[0]._id;
                            newStoreInfo.quantity = Number(removedLocation[0].quantity) - Number(item.quantity);
                            foundProduct.stores.splice(locationIndex, 0, newStoreInfo);
                          } else if(foundProduct.stores.length > 1 && newOrder.pickup_store === "Tampere, Keskusta") {
                            var locationIndex;
                            var removedLocation;
                            locationIndex = foundProduct.stores.map(function(store) { return store.location; }).indexOf(newOrder.pickup_store);
                            removedLocation = foundProduct.stores.splice(locationIndex, 1);
                            newStoreInfo.location = removedLocation[0].location;
                            newStoreInfo._id = removedLocation[0]._id;
                            newStoreInfo.quantity = Number(removedLocation[0].quantity) - Number(item.quantity);
                            foundProduct.stores.splice(locationIndex, 0, newStoreInfo);
                          } else if(foundProduct.stores.length > 1 && newOrder.pickup_store === "posti") {
                            var locationIndex;
                            var removedLocation;
                            locationIndex = foundProduct.stores.map(function(store) { return store.location; }).indexOf("Tampere, Keskusta");
                            removedLocation = foundProduct.stores.splice(locationIndex, 1);
                            newStoreInfo.location = removedLocation[0].location;
                            newStoreInfo._id = removedLocation[0]._id;
                            newStoreInfo.quantity = Number(removedLocation[0].quantity) - Number(item.quantity);
                            foundProduct.stores.splice(locationIndex, 0, newStoreInfo);
                          } else if(foundProduct.stores.length === 1){
                            var shiftedLocation = foundProduct.stores.shift(foundProduct.stores[0]);
                            newStoreInfo.location = shiftedLocation.location;
                            newStoreInfo.quantity = Number(shiftedLocation.quantity) - Number(item.quantity);
                            foundProduct.stores.unshift(newStoreInfo);
                          }
                          foundProduct.times_sold = foundProduct.times_sold + 1;
                          foundProduct.save((err, updatedProduct) => {
                            if(err) {
                              req.flash("error", err.message);
                              return res.redirect("/ostoskori/"+req.params.id+"/maksu");
                            } else {
                              count++;
                              if(count === foundCart.items.length) {
                                foundCart.items = [];
                                foundCart.delivery_cost = null;
                                foundCart.total = 0;
                                foundCart.total_price_excluding_tax = 0;
                                foundCart.total_price_including_tax = 0;
                                foundCart.total_tax_amount = 0;
                                foundCart.total_price = 0;
                                foundCart.payment_method = "";
                                foundCart.bonus_system.total_price = 0;
                                foundCart.bonus_system.stamps = 0;
                                foundCart.bonus_system.coupon_id = null;
                                foundCart.bonus_system.coupon_value = null;
                                foundCart.save((err, resettedCart) => {
                                  if(err) {
                                    req.flash("error", err.message);
                                    return res.redirect("/ostoskori/"+req.params.id+"/maksu");
                                  } else {
                                    req.session.cart = resettedCart;
                                    checkOutCtrl.confirm(req, res, req.session.klarna_id, (err, klarna_id) => {
                                      if(err) {
                                        req.flash("error", err);
                                        return res.redirect("/ostoskori/"+req.params.id);
                                      } else {
                                        newOrder.klarna_id = klarna_id;
                                        newOrder.save((err, updatedOrder) => {
                                          if(err) {
                                            req.flash("error", err.message);
                                            return res.redirect("/");
                                          } else {
                                            MailServer.orderConfirmation(req, res, updatedOrder, next);
                                            MailServer.sendNotificationOnNewOrder(req, res, updatedOrder, foundUser, next);
                                            req.session.klarna_id = undefined;
                                            req.flash("success", "Onnistui! Rolling Records store kiittää tilauksesta! Tilaus on vastaanotettu ja sitä käsitellään!");
                                            res.render("cart/confirmation.ejs", {
                                              order: updatedOrder
                                            });
                                          }
                                        });
                                      }
                                    });
                                  }
                                });
                              }
                            }
                          });
                        }
                      });
                    });
                  }
                });
              }
            });
          }
        }
      });
    }
  });
};