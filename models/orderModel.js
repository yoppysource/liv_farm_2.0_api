const mongoose = require("mongoose");
const Coupon = require("./couponModel");

const orderSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    address: {
      type: {
        type: String,
        default: "Address",
        enum: ["Address"],
      },
      address: String,
      addressDetail: String,
      postcode: String,
    },
    option: {
      type: String,
      enum: ["delivery", "takeOut"],
      default: "delivery",
    },
    deliveryRequest: String,
    scheduledDate: Date,
    deliveryReservationMessage: String,
    payMethod: String,
    status: {
      type: Number,
      min: 0,
      max: 3,
      default: 0,
    },
    paidAmount: Number,
    isReviewed: {
      type: Boolean,
      default: false,
    },
    coupon: {
      type: {
        type: String,
        default: "Coupon",
        enum: ["Coupon"],
      },
      code: {
        type: String,
      },
      category: {
        type: String,
        enum: ["rate", "value"],
      },
      amount: Number,
      description: String,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Order mush belong to User"],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    cart: {
      type: mongoose.Schema.ObjectId,
      ref: "Cart",
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

orderSchema.virtual("orderStatus").get(function () {
  const statusObj = {
    0: "결제 완료",
    1: "배송 중",
    2: "전달 완료",
    3: "환불 처리",
  };
  return statusObj[this.status];
});

orderSchema.index({ cart: 1, user: 1 });
orderSchema.pre(/^find/, function (next) {
  this.populate({ path: "cart" }).populate({
    path: "user",
    select: "name phoneNumber",
  });
  next();
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
