const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.ObjectId,
    ref: "Product",
    required: [true, "cartItem must belong to product"],
  },
  quantity: {
    type: Number,
    default: 1,
    min: [1, "quantity must be above 1"],
  },
});

itemSchema.pre(/^find/, function (next) {
  this.populate({
    path: "product",
    select: "name price thumbnailPath discountedPrice inventory",
  });
  next();
});

const Item = mongoose.model("Item", itemSchema);

module.exports = Item;
