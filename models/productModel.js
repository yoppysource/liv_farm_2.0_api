//review / rating / createdA
const mongoose = require("mongoose");
const slugify = require("slugify");

const productSchema = new mongoose.Schema(
  {
    category: Number,
    rank: {
      type: Number,
      default: 100,
    },
    name: {
      type: String,
      required: [true, "Product must have a name"],
      unique: true,
      trim: true,
    },
    nameInEng: {
      type: String,
      required: [true, "Product must have a name"],
      unique: true,
      trim: true,
    },
    slug: String,
    price: Number,
    hidden: {
      type: Boolean,
      default: false,
    },
    discountedPrice: {
      type: Number,
      default: this.price,
    },
    location: String,
    inventory: {
      type: Number,
      default: 0,
    },
    description: String,
    imgPath: String,
    thumbnailPath: String,
    descriptionImgPath: String,
    detailImgPath: [String],
    sku: String,
    type: String,
    intro: String,
    tasteMeasure: [String],
    storageTip: {
      type: String,
      default:
        "밑동을 한 번에 잘라 흐르는 물에 씻어 드세요. 남으면 물기를 털어 키친 타월 등으로 감싸 냉장 보관하세요.",
    },
    recipe: String,
    nutrition: String,
    weight: String,
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [0, "Rating must be above 0.0"],
      max: [5, "Rating must be below 5.0"],
      //if there is an new value ,set called
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    isOnShelf: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
productSchema.pre(/^find/, function (next) {
  //thid points to the current query(find)
  this.find().sort("-isOnShelf").sort("rank");
  console.log("call find");
  next();
});
// productSchema.virtual("isOnShelf").get(function () {
//   if (!this.inventory || this.inventory <= 0) {
//     return false;
//   }
//   return true;
// });
//Indexing for price, ratingsAverage
productSchema.index({
  price: 1,
  ratingsAverage: -1,
  inventory: -1,
});
productSchema.index({ slug: 1 });

//Define virtual field to populate reviews
productSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "product",
  localField: "_id",
});
//Update isOnShelf
productSchema.post(/^findOneAnd/, async (document) => {
  if (document) {
    if (!document.inventory || document.inventory <= 0) {
      document.isOnShelf = false;
    } else {
      document.isOnShelf = true;
    }
    document.save();
  }
  //doc은 어쩌피 delete나 update나 둘다 리턴된다.
});
// productSchema.pre(/^update/, function (next) {
//   if (!this.inventory || this.inventory <= 0) {
//     this.isOnShelf = false;
//   } else {
//     this.isOnShelf = true;
//   }
//   next();
// });

//Save slug column when the document are created in order to use to make web-site url.
productSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
