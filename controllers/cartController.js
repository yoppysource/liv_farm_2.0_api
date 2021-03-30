const Cart = require("../models/cartModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");

exports.getMyCart = (req, res, next) => {
  req.params.id = req.user.cart;
  next();
};

//Only for admin
exports.getCart = factory.getOne(Cart);
exports.createCart = factory.createOne(Cart);
exports.getAllCarts = factory.getAll(Cart);
exports.updateCart = factory.updateOne(Cart);
exports.deleteCart = factory.deleteOne(Cart);
