"use strict";
const mongoose 		= require('mongoose');
const Order 		= require('../../../models/order');
const User 			= require('../../../models/user');
const checkOutCtrl 	= require('../controllers/checkoutCtrl');
const MailServer 	= require('../../data/sendMail');
//Methods to modify order
module.exports.getOrder = (req, res, next) => {
	Order.findById(req.params.order_id).populate("client").populate({path: "items.item", model: "Product"}).populate("delivery_method").exec((err, foundOrder) => {
		if(err || !foundOrder) {
			req.flash("error", "Ups! Valitettavasti tilausta ei voitu juuri nyt hakea tietokannasta.");
			return res.redirect("/profiili/"+req.params.id);
		} else {
			res.render("profile/show-order.ejs", {
				order: foundOrder
			});
		}
	});
};
// Update order status
//Order, get and update it
module.exports.showOrder = (req, res, next) => {
	Order.findById(req.params.order_id).populate("client").populate({path: "items.item", model: "Product"}).populate("delivery_method").exec((err, foundOrder) => {
		if(err || !foundOrder) {
			req.flash("error", "Ups! Valitettavasti tilausta ei voitu juuri nyt hakea tietokannasta.");
			return res.redirect("/profiili/"+req.params.id);
		} else {
			if(foundOrder.status === "pending") {
				foundOrder.status = "recieved";
				foundOrder.save((err, updatedOrder) => {
					if(err) {
						req.flash("error", err.message);
						return res.redirect("/admin/user/"+req.params.id);
					} else {
						return res.render("admin/users/show-order.ejs", {
							order: updatedOrder
						});
					}
				});
			} else {
				res.render("admin/users/show-order.ejs", {
					order: foundOrder
				});
			}
		}
	});
};
// mark as delivered
module.exports.markOrderAsDelivered = (req, res, next) => {
	Order.findById(req.params.order_id).populate("client").populate({path: "items.item", model: "Product"}).populate("delivery_method").exec((err, foundOrder) => {
		if(err || !foundOrder) {
			req.flash("error", "Ups! Valitettavasti tilausta ei voitu juuri nyt hakea tietokannasta.");
			return res.redirect("/admin/user/"+req.params.id+"/order/"+req.params.order_id);
		} else if(foundOrder.delivery_method.name !== "Nouto myymälästä"){
			foundOrder.status = "delivered";
			foundOrder.save((err, updatedOrder) => {
				if(err) {
					req.flash("error", err.message);
					return res.redirect("/admin/user/"+req.params.id+"/order/"+req.params.order_id);
				} else {
					checkOutCtrl.updateOrder(req, res, req.body.klarna_id, (err, order) => {
						if(err) {
							return res.status(500).json(error);
						} else {
							return res.satus(200).json(order);
						}
					});
				}
			});
		} else {
			foundOrder.status = "done";
			foundOrder.save((err, updatedOrder) => {
				if(err) {
					req.flash("error", err.message);
					return res.redirect("/admin/user/"+req.params.id+"/order/"+req.params.order_id);
				} else {
					MailServer.sendCompleteOrderVerificationEmail(req, res, updatedOrder, next);
					req.flash("success", "Onnistui! Tilauksen tlaa on onnistuneesti päivitetty!");
					return res.redirect("/admin/user/"+req.params.id+"/order/"+req.params.order_id);
				}
			});
		}
	});
};
//Mark order as paid
module.exports.markOrderAsPaid = (req, res, next) => {
  var stamps;
  Order.findById(req.params.order_id).populate("client").populate({path: "items.item", model: "Product"}).populate("delivery_method").exec((err, foundOrder) => {
    if(err || !foundOrder) {
      req.flash("error", "Ups! Tapahtui virhe tilausta haettaessa.");
      return res.redirect("/admin/user/"+req.params.id);
    } else {
      stamps = Number(foundOrder.stamps);
      foundOrder.stamps = 0;
      foundOrder.paid = true;
      foundOrder.status = "delivered";
      foundOrder.payment_time = Date.now();
      foundOrder.save((err, updatedOrder) => {
        if(err) {
          req.flash("error", err.message);
          return res.redirect("/admin/user/"+req.params.id);
        } else {
          User.findById(req.params.id, (err, foundUser) => {
            if(err || !foundUser) {
              req.flash("error", "Ups! Tapahtui virhe käyttäjää haettaessa.");
              return res.redirect("/admin/user/"+req.params.id);
            } else {
            	if(foundOrder.coupon_id) {
            		foundUser.bonus_system.coupons.pull({_id: foundOrder.coupon_id});
            	}
              	foundUser.bonus_system.stamps = Number(foundUser.bonus_system.stamps + stamps);
              	let coupon = null;
              	Number(foundUser.bonus_system.stamps) >= 10 ? coupon = {valid_time: Date.now() + 15552000000, valid: true, value: 20} : coupon = null;  
              	if(coupon) {
                foundUser.bonus_system.coupons.push(coupon);
                foundUser.bonus_system.stamps = Number(foundUser.bonus_system.stamps) - 10; 
              }
              foundUser.save((err, updatedUser) => {
                if(err) {
                	req.flash("error", err.message);
                	return res.redirect("/admin/user/"+req.params.id);
                } else {
                	MailServer.sendPaidOrderVerificationEmail(req, res, updatedUser, updatedOrder, next);
                	req.flash("success", "Onnistui! Käyttäjälle "+foundUser.name.firstname+" "+foundUser.name.lastname+" on onnistuneesti lisätty "+stamps+" leimaa.");
                	res.redirect("/admin/user/"+req.params.id);
                }
              });
            }
          });
        }
      });
    }
  });
};