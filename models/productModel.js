//review / rating / createdA
const mongoose = require("mongoose");
const slugify = require("slugify");

const productSchema = new mongoose.Schema(
  {
    category: Number,
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
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
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

//Save slug column when the document are created in order to use to make web-site url.
productSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
