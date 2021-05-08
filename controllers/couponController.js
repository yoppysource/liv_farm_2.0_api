const Coupon = require("../models/couponModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");
const User = require("../models/userModel");
exports.registerCoupon = catchAsync(async (req, res, next) => {
  const coupon = await Coupon.findOne({ code: req.params.code });
  if (!coupon)
    return next(new AppError("요청하신 쿠폰 번호를 찾을 수 없습니다.", 404));
  let userCoupons = req.user.coupons;

  let isExist = false;
  userCoupons.forEach((element) => {
    if (element.code === req.params.code) {
      isExist = true;
    }
  });

  if (isExist)
    return next(new AppError("이미 등록되었거나 사용한 쿠폰입니다.", 403));
  let newCoupon = {
    code: coupon.code,
    used: false,
    category: coupon.category,
    amount: coupon.amount,
    expireDate: coupon.expireDate,
  };

  //register to User
  const data = await User.findByIdAndUpdate(
    req.user.id,
    {
      $push: { coupons: newCoupon },
    },
    { new: true, runValidators: true }
  );

  //If the coupon has field for limit, add -1 the field.
  if (coupon.limit)
    await Coupon.findByIdAndUpdate(coupon.id, {
      limit: coupon.limit - 1 < 0 ? 0 : coupon.limit - 1,
    });

  res.status(200).json({
    status: "success",
    data: {
      data: data.coupons,
    },
  });
});

exports.useCoupon = catchAsync(async (req, res, next) => {
  const data = await User.findOne({
    _id: req.user.id,
  });

  data.coupons.forEach((coupon) => {
    if (coupon._id.toString() === req.params.id) coupon.used = true;
  });
  data.save();

  console.log(data);

  res.status(200).json({
    status: "success",
    data: {
      data,
    },
  });
});

exports.getAllCoupons = factory.getAll(Coupon);
exports.createCoupon = factory.createOne(Coupon);
exports.updateCoupon = factory.updateOne(Coupon);
exports.deleteCoupon = factory.deleteOne(Coupon);
