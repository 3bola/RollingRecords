"use strict";
const mongoose = require('mongoose');
const User = require('../../models/user');
const Product = require('../../models/product');
const Cart = require('../../models/cart');
const Contact = require('../../models/contact');
const Notification = require('../../models/notification');
const sendMail = require('./sendMail');
exports = module.exports = function(io) { 
  // Set socket.io listeners.
  io.on('connection', (socket) => {
    const notificationsPush = setInterval(() => {
      Product.find({}).where("total_quantity").equals(0).exec((err, products) => {
        if(err || !products) {
          req.flash("error", "Tapahtui virhe tuotteita arvioitaessa.");
          return res.redirect("back");
        } else {
          User.find({"admin.isAdmin": true}).exec((err, users) => {
            if(err || !users) {
              req.flash("error", "Tapahtui virhe tuotteita arvioitaessa.");
              return res.redirect("back");
            } else {
              const notification = new Notification();
              for(var i = 0; i < products.length; i++) {
                notification.products.push(products[i]);
              }
              for(var u = 0; u < users.length; u++) {
                notification.followers.push(users[u]);
              }
              notification.isOutOfStock = true;
              notification.save((err, newNotification) => {
                if(err) {
                  req.flash("error", "Tapahtui virhe tuotteita arvioitaessa.");
                  return res.redirect("back");
                } else {
                  Notification.count({"isRead": false}, (err, count) => {
                    if(err) {
                      return io.emit("error", {from: "Admin", message: "No notifications found."});
                    } else {
                      // send notification with total count to the client
                      sendMail.sendNotificationEmail(users, newNotification);
                      socket.emit('new-notification', newNotification, count);
                    }
                  });
                }
              });
            }
          });
        }
      });
    // Create 0 amount notification list
  }, 86400000);
    socket.on('disconnect', () => {
      clearInterval(notificationsPush);
      console.log('Disconnected');
    });
  const productsToBeUpdatedPush = setInterval(() => {
      Product.find({"releasedate": {$lte: Date.now()}, "category": "Tulevat"}, (err, products) => {
        if(err || !products) {
          req.flash("error", "Tapahtui virhe tuotteita arvioitaessa.");
          return res.redirect("back");
        } else {
          User.find({"admin.isAdmin": true}).exec((err, users) => {
            if(err || !users) {
              req.flash("error", "Tapahtui virhe tuotteita arvioitaessa.");
              return res.redirect("back");
            } else {
              const notification = new Notification();
              for(var i = 0; i < products.length; i++) {
                notification.products.push(products[i]);
              }
              for(var u = 0; u < users.length; u++) {
                notification.followers.push(users[u]);
              }
              notification.isNewProduct = true;
              notification.save((err, newNotification) => {
                if(err) {
                  req.flash("error", "Tapahtui virhe tuotteita arvioitaessa.");
                  return res.redirect("back");
                } else {
                    Notification.count({"isRead": false}, (err, count) => {
                      if(err) {
                       return io.emit("error", {from: "Admin", message: "No notifications found."});
                      } else {
                        // send notification with total count to the client
                        sendMail.sendNotificationEmail(users, newNotification);
                        socket.emit('new-notification', newNotification, count);
                      }
                    });
                }
              });
            }
          });
        }
      });
    // Create new list with products to be updated
  }, 86400000);
  socket.on('disconnect', () => {
      clearInterval(productsToBeUpdatedPush);
      console.log('Disconnected');
    });
  //Listen for events to get all notifications
  socket.on("get-notifications", (callback) => {
    Notification.find({}).populate("products").exec((err, allNotifications) => {
      if(err){
        io.emit("error", {from: "Admin", message: "No notifications found."});
      } else {
        Notification.count({"isRead": false}, (err, count) => {
          if(err) {
            io.emit("error", {from: "Admin", message: "No notifications found."});
          } else {
             socket.emit("all-notifications", allNotifications, count);
          }
        });
      }
    });
  });
  // Remove carts without owner and create notification, with how many carts were removed
  const removeCarts = setInterval(() => {
      Cart.find({"owner": null}).exec((err, carts) => {
        if(err || !carts) {
          io.emit("error", "Tapahtui odottamaton tietokanta yhteys virhe.");
        } else {
          Cart.count({"owner": null}).exec((err, count) => {
            if(err || !count) {
              return socket.emit("error", "Tapahtui odottamaton tietokanta yhteys virhe.");
            } else {
               User.find({"admin.isAdmin": true}).exec((err, users) => {
            if(err || !users) {
              io.emit("error", "Tapahtui virhe tuotteita arvioitaessa.");
            } else {
              carts.forEach((cart) => {
                cart.remove((err) => {
                  if(err) {
                    return socket.emit("error", err);
                  } 
                });
              });
              const notification = new Notification();
              for(var u = 0; u < users.length; u++) {
                notification.followers.push(users[u]);
              }
              notification.cartsRemoved = true;
              notification.save((err, newNotification) => {
                if(err) {
                  return socket.emit("error", err);
                } else {
                    Notification.count({"isRead": false}, (err, isReadCount) => {
                      if(err) {
                       return io.emit("error", {from: "Admin", message: "No notifications found."});
                      } else {
                        // send notification with total count to the client
                        socket.emit('new-notification', newNotification, count, isReadCount);
                      }
                    });
                }
              });
            }
          });
            }
          });
        }
      });
    // Create new list with products to be updated
  }, 86400000);
  socket.on('disconnect', () => {
    clearInterval(removeCarts);
    console.log('Disconnected');
  });
  // create notification on new contact form data
  const checkNewContacts = setInterval(() => {
    Contact.find({status: "pending"}).exec((err, contacts)=> {
      if(err || !contacts) {
        io.emit("error", "Tällä hetkellä ei ole uusia yhteydenottoja.");
      } else {
        User.find({"admin.isAdmin": true}).exec((err, users) => {
          if(err || !users) {
            io.emit("error", "Tapahtui virhe tuotteita arvioitaessa.");
          } else {
            var notification = new Notification();
            notification.newContacts = true;
            for(var u = 0; u < users.length; u++) {
              notification.followers.push(users[u]);
            }
            for(var i = 0; i < contacts.length; i++) {
              contacts[i].status = "recieved";
              var count = 0;
              contacts[i].save((err, updatedContact) => {
                if(err) {
                  io.emit("error", err.message);
                } else {
                  count++;
                  notification.contacts.push(updatedContact);
                  if(count === contacts.length) {
                    notification.save((err, newNotification) => {
                      if(err) {
                        io.emit("error", err.message);
                      } else {
                        socket.emit("new-notification", newNotification);
                      }
                    });
                  }
                }
              });
            }
          }
        });
      }
    });
  }, 100000);
  });
}