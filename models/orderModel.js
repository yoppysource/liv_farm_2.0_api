const mongoose = require("mongoose");

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
    scheduledDate: Date,
    payMethod: String,
    status: {
      type: Number,
      min: 0,
      max: 4,
      default: 0,
    },
    paidAmount: Number,
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
    1: "포장 중",
    2: "배송 중",
    3: "전달 완료",
    4: "환불 처리",
  };
  return statusObj[this.status];
});

orderSchema.index({ cart: 1, user: 1 });
orderSchema.pre(/^find/, function (next) {
  this.populate({ path: "cart" }).populate({
    path: "user",
    select: "name email phoneNumber",
  });
  next();
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
