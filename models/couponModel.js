//review / rating / createdA
const mongoose = require("mongoose");

//There are two coupons for the api.
//Firstly, no-limit coupon which should be expressed as empty field for the limit.
//The other coupon is the limit coupon which has field named "limit"
const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    unique: true,
  },
  limit: Number,
  category: {
    type: String,
    enum: ["rate", "value"],
    default: "value",
  },
  amount: Number,
  expireDate: Date,
  description: String,
});

//Use pre middleware for not to get coupon which reach to limit.
couponSchema.pre(/^find/, function (next) {
  this.find({ limit: { $ne: 0 }, expireDate: { $gte: Date.now() } });
  next();
});

const Coupon = mongoose.model("Coupon", couponSchema);

module.exports = Coupon;
