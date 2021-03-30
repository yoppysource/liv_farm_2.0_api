const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    items: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Item",
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

cartSchema.pre(/^find/, function (next) {
  this.populate({
    path: "items",
  });
  next();
});
cartSchema.virtual("totalPrice").get(function () {
  if (!this.items || this.items.length === 0) {
    return 0;
  }
  return this.items
    .map((element) => element.product.price * element.quantity)
    .reduce((a, b) => a + b);
});

cartSchema.virtual("totalDiscountedPrice").get(function () {
  if (!this.items || this.items.length === 0) {
    return 0;
  }
  return this.items
    .map((element) => element.product.priceDiscount * element.quantity)
    .reduce((a, b) => a + b);
});

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
