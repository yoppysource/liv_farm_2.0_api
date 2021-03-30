//review / rating / createdA
const mongoose = require("mongoose");
const Product = require("./productModel");

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
    },
    rating: {
      type: Number,
      min: [0, "Rating must be above 0.0"],
      max: [5, "Rating must be below 5.0"],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    imgPath: String,
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: [true, "Review must belong to product."],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review must belong to a user."],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.index({ product: 1, user: 1 });

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name",
  });

  next();
});
reviewSchema.statics.calcAverageRatings = async function (productId) {
  const stats = await this.aggregate([
    {
      $match: { product: productId },
    },
    {
      $group: {
        _id: "$product",
        nRating: {
          $sum: 1,
        },
        avgRating: {
          $avg: "$rating",
        },
      },
    },
  ]);
  console.log(stats);

  if (stats.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Product.findByIdAndUpdate(produtId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};
//When review created
reviewSchema.post("save", function () {
  this.constructor.calcAverageRatings(this.product);
});

//When review updated
reviewSchema.post(/^findOneAnd/, async (document) => {
  if (document) await document.constructor.calcAverageRatings(document.product);
});
const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
