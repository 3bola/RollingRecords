"use strict";
const mongoose = require('mongoose');
const User = require('../../../models/user');
const Order = require('../../../models/order');
const Product = require('../../../models/product');
const paginate = require('../middleware/paginate');
//Capitalize first letter of string
function capitalizeFirstLetter(string) { 
    return string.charAt(0).toUpperCase() + string.slice(1); 
};
module.exports.getProfile = (req, res, next) => {
    User.findById(req.params.id).populate("history").exec((err, foundUser) => {
        if(err || !foundUser) {
            req.flash("error", err.message);
            return res.redirect("back");
        } else {
            res.render("profile/index.ejs", {
                user: foundUser
            }); 
        }
    });
};
module.exports.editProfile = (req,res,next) => {
    User.findById(req.params.id, function(err, foundUser){
        if(err) {
            req.flash("error", err.message);
            return res.redirect("back");
        } else {
            foundUser.name.firstname = capitalizeFirstLetter(req.body.firstname);
            foundUser.name.lastname = capitalizeFirstLetter(req.body.lastname);
            foundUser.email = req.body.email;
            foundUser.mobileNumber = req.body.mobileNumber;
            foundUser.save((err,updateUser) => {
                if(err) {
                    req.flash("error", `Valitettavasti kyseinen "${req.body.email}" sähköpostiosoite on jo rekisteröity.`);
                    return res.redirect("/profiili/"+req.params.id);
                } else {
                    req.flash("success","Käyttäjätietoja on päivitetty onnistuneesti.");
                    res.redirect("/profiili/"+req.params.id);
                }
            });
        }
    });
};
module.exports.addAddress = (req,res,next) => {
    User.findById(req.params.id, function(err, foundUser){
        if(err) {
            req.flash("error", err.message);
            return res.redirect("back");
        } else {
            foundUser.completeAddress.zipcode = req.body.zipcode;
            foundUser.completeAddress.address = req.body.address;
            foundUser.completeAddress.city = req.body.city;
            //save
            foundUser.save((err,updateUser) => {
                if(err) {
                    req.flash("error", err.message);
                    return res.redirect("back");
                } else {
                    req.flash("success","Osoite on onnistunnesti lisätty.");
                    res.redirect("/profiili/"+foundUser._id);
                }
            });
        }
    });
};
module.exports.editAddress = (req, res, next) =>  {
    User.findById(req.params.id, function(err, foundUser){
        if(err) {
            req.flash("error", err.message);
            return res.redirect("back");
        } else {
            foundUser.completeAddress.zipcode = req.body.zipcode;
            foundUser.completeAddress.address = req.body.address;
            foundUser.completeAddress.city = req.body.city;
            //save
            foundUser.save((err,updateUser) => {
                if(err) {
                    req.flash("error", err.message);
                    return res.redirect("/profiili/"+foundUser._id);
                } else {
                    req.flash("success","Osoitetta on onnistuneesti päivitetty!");
                    res.redirect("/profiili/"+foundUser._id);
                }
            });
        }
    });
};
module.exports.removeAddress = (req,res,next) => {
    User.findById(req.params.id, function(err, foundUser){
        if(err) {
            req.flash("error", err.message);
            return res.redirect("back");
        } else {
            foundUser.completeAddress.zipcode = undefined;
            foundUser.completeAddress.address = undefined;
            foundUser.completeAddress.city = undefined;
            //save
            foundUser.save((err,updateUser) => {
                if(err) {
                    req.flash("error", err.message);
                    return res.redirect("back");
                } else {
                    req.flash("success","Address removed");
                    res.redirect("back");
                }
            });
        }
    });
};
// Remove profile
module.exports.removeProfile = (req, res, next) => {
    if(req.user && req.user.admin.isAdmin) {
        User.findById(req.params.id, (err, foundUser) => {
            if(err || !foundUser) {
                req.flash("error", "Ups! Tapahtui virhe käyttäjätiliäsi haettaessa tietokannasta!");
                return res.redirect("/admin/user/"+req.params.id);
            } else {
                if(foundUser.history.length) {
                    let count = 0;
                    foundUser.history.forEach((order) => {
                        order.owner = null;
                        order.save((err)=> {
                            if(err) {
                                req.flash("error", err.message);
                                return res.redirect("/admin/user/"+req.params.id);
                            } else {
                                count++;
                                if(count === foundUser.hitory.length) {
                                    foundUser.remove((err) => {
                                        if(err) {
                                            req.flash("error", err.message);
                                            return res.redirect("/admin/user/"+req.params.id);
                                        } else {
                                            req.flash("success", "Onnistui! Käyttäjätilinne on onnistuneesti poistettu!");
                                            return res.redirect("/admin/user");
                                        }
                                    });
                                }
                            }
                        });
                    });
                } else {
                    foundUser.remove((err) => {
                        if(err) {
                            req.flash("error", err.message);
                            return res.redirect("/admin/user/"+req.params.id);
                        } else {
                            req.flash("success", "Onnistui! Käyttäjätilinne on onnistuneesti poistettu!");
                            return res.redirect("/admin/user");
                        }
                    }); 
                }
            }
        });
    } else {
        User.findById(req.params.id, (err, foundUser) => {
            if(err || !foundUser) {
                req.flash("error", "Ups! Tapahtui virhe käyttäjätiliäsi haettaessa tietokannasta!");
                return res.redirect("/profiili/"+req.params.id);
            } else {
                let count = 0;
                foundUser.history.forEach((order) => {
                    order.owner = null;
                    order.save((err)=> {
                        if(err) {
                            req.flash("error", err.message);
                            return res.redirect("/profiili/"+req.params.id);
                        } else {
                            count++;
                            if(count === foundUser.hitory.length) {
                                foundUser.remove((err) => {
                                    if(err) {
                                        req.flash("error", err.message);
                                        return res.redirect("/profiili/"+req.params.id);
                                    } else {
                                        req.flash("success", "Onnistui! Käyttäjätilinne on onnistuneesti poistettu!");
                                        return res.redirect("/");
                                    }
                                });
                            }
                        }
                    });
                });
            }
        });
    }
};
//Get coupon
module.exports.getCoupon = (req, res, next) => {
    User.findById(req.user.id, (err, foundUser) => {
        if(err, !foundUser) {
            res.status(404).json({
                "message": "Valitettavasti käyttäjää ei voitu löytää tietokannasta teknisen vian vuoksi."
            });
        } else {
            res.status(200).json({
                "coupon": foundUser.bonus_system.coupons[0],
                "message": "success"
            });
        }
    });
};