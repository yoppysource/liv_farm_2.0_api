const Item = require("../models/itemModel");
const Product = require("../models/productModel");

const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const Cart = require("../models/cartModel");
const factory = require("./handlerFactory");

exports.checkInventory = catchAsync(async (req, res, next) => {
  if (req.params.id) {
    //When update
    const item = await Item.findById(req.params.id);
    if (item.product.inventory < req.body.quantity)
      return next(new AppError("재고가 부족합니다.", 403));
    return next();
  } else {
    const product = await Product.findById(req.body.product);
    //When create
    if (product.inventory < req.body.quantity)
      return next(new AppError("재고가 부족합니다.", 403));
    return next();
  }
});
exports.createItem = catchAsync(async (req, res, next) => {
  const cart = await Cart.findById(req.user.cart);
  if (!cart) return next(new AppError("존재하지 않는 카트입니다.", 404));

  let duplicatedItem;
  for (const item of cart.items) {
    if (item.product.id === req.body.product) {
      duplicatedItem = item;
    }
  }
  if (duplicatedItem) {
    console.log(duplicatedItem);

    newQuantity = duplicatedItem.quantity + req.body.quantity;
    console.log(duplicatedItem.quantity);
    item = await Item.findByIdAndUpdate(
      duplicatedItem._id,
      { quantity: newQuantity },
      {
        new: true,
      }
    );
    console.log(item);
    return res.status(200).json({
      status: "success",
      data: item,
    });
  }
  const item = await Item.create(req.body);

  cart.items.push(item._id);
  await cart.save();

  res.status(201).json({
    status: "success",
    data: item,
  });
});

exports.updateItem = factory.updateOne(Item);

exports.deleteItem = catchAsync(async (req, res, next) => {
  const item = await Item.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: "success",
    data: null,
  });
});
