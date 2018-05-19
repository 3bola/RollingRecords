"use strict";
const mongoose 	= require("mongoose");
const Schema    = mongoose.Schema;
const	bcrypt 		= require('bcrypt-nodejs');
const	crypto 		= require('crypto');

var UserSchema = new Schema({
  admin: {
    isAdmin: {type: Boolean, default: false},
    adminCodeToken: String,
    adminCodeTokenExpires: Date,
    premission_level: {type: String, default: "basic"}
  },
  completeAddress: {
    zipcode: {type: String, default: ""},
    address: {type: String, default: ""},
    city: {type: String, default: ""}
  },
  mobileNumber: {type: String, default: ""},
	email: {type: String, unique: true, lowercase: true, required: true},
	name: {
		firstname: String,
		lastname: String
	},
  fullname: String,
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cart"
  },
  user: {
    isVerified: {type: Boolean, default: false},
    token: String,
    tokenExpires: Date
  },
	username: {type: String, unique: true, required: true},
	password: { type: String, required: true, select: false},
  resetPasswordToken: String,
  resetPasswordExpires: Date,
	created: {type: Date, default: Date.now},
	avatar: String,
  bonus_system: {
    coupons: [
      {
          createdAt: {type: Date, default: Date.now},
          value: {type: Number, default: 20},
          valid: {type: Boolean, default: false},
          valid_time: {type: Date}
      }
    ],
    stamps: {type: Number, default: 0},
    alert: {type: Boolean, default: false},
    counter: {type: Number, default: 1}
  },
  history: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order"
    }
  ]
});

// Hash the password before saving it to the database
UserSchema.pre('save', function(next) {
  var user = this;
  if (!user.isModified('password')) return next();
  bcrypt.genSalt(10, function(err, salt) {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});
UserSchema.methods.getFullName = function() {
  return this.name.firstname + ' ' + this.name.lastname;
};
//compare password in the database and the one that the user types in
UserSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};
//Admin premissions
UserSchema.methods.confirmAdminLevel = (isAdmin) => {
  if(this.admin.isAdmin && this.admin.premissions.name === "basic" || this.admin.isAdmin && this.admin.premissions.name === "ultimate" && this.admin.premissions.premit) {
    return true;
  } else {
    return false;
  }
};
UserSchema.index({username: 1}, {unique: true});
UserSchema.index({email: 1}, {unique: true});
UserSchema.index({created: 1});
UserSchema.index({email: "text", username: "text", fullname: "text"});
module.exports = mongoose.model("User", UserSchema);
