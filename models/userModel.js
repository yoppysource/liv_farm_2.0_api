const crypto = require("crypto");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Cart = require("./cartModel");
const KlaviyoClient = require("../utils/email");

const userSchema = new mongoose.Schema({
  //AUTH
  email: {
    type: String,
    //transfer email to lower case
    lowercase: true,
    unique: true,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  password: {
    type: String,
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not the same",
    },
  },
  agreeToGetMail: Boolean,
  passwordChangedAt: Date,
  //TODO: For activate this feature, sending resetToken to user must be implemented.
  passwordResetToken: String,
  passwordResetExpires: Date,
  snsId: String,
  platform: {
    type: String,
    enum: ["kakao", "apple", "facebook", "google"],
  },
  //DATA
  name: { type: String },
  birthday: Date,
  gender: {
    type: String,
    enum: ["male", "female"],
  },
  phoneNumber: String,
  //Address might be more than one.
  addresses: [
    {
      type: {
        type: String,
        default: "Address",
        enum: ["Address"],
      },
      address: String,
      addressDetail: String,
      postcode: String,
    },
  ],
  coupons: [
    //TODO: Client must handle expireDate and used not to present.
    {
      type: {
        type: String,
        default: "Coupon",
        enum: ["Coupon"],
      },
      code: {
        type: String,
      },
      used: Boolean,
      category: {
        type: String,
        enum: ["rate", "value"],
      },
      amount: Number,
      expireDate: Date,
      description: String,
    },
  ],
  point: {
    type: Number,
    default: 0,
  },
  cart: {
    type: mongoose.Schema.ObjectId,
    ref: "Cart",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
  },
});

userSchema.pre(/^find/, function (next) {
  this.populate({
    path: "cart",
  });
  next();
});

userSchema.pre("save", async function (next) {
  if (this.snsId) return next();
  //only run this function if password was actually modified
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre("save", async function (next) {
  if (this.isNew) {
    // When user sign in the cart should be created.
    const doc = await Cart.create({});
    this.cart = doc._id;
    this.coupons.push({
      code: "WELCOME",
      used: false,
      category: "value",
      amount: 10000,
      expireDate: Date.now() + 30 * 24 * 60 * 60 * 1000,
      description: "가입 환영 쿠폰입니다.",
    });
  }
  next();
});

// //Klaviyo
// userSchema.pre("save", async function (next) {
//   if (this.isNew) {
//     console.log(this.email);
//     // KlaviyoClient.public.identify({
//     //   email: this.email,
//     //   properties: {
//     //     uid: this._id,
//     //   },
//     // });
//     // KlaviyoClient.lists.addSubscribersToList({
//     //   listId: "Sync7W",
//     //   profiles: [
//     //     {
//     //       email: this.email,
//     //     },
//     //   ],
//     // });
//   }
//   next();
// });

//This method for if we use id/password to login.
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    console.log(changedTimestamp, JWTTimestamp);
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  console.log({ resetToken }, this.passwordResetToken);

  return resetToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
