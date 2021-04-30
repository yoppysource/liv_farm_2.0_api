const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");
const Order = require("../models/orderModel");
const User = require("../models/userModel");
const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const axios = require("axios");
const dotenv = require("dotenv");
const AppError = require("../utils/appError");
const aligoApi = require("../utils/aligoApi");

// Webhook이 호출되어 생성되는 POST요청의 body에는 imp_uid, merchant_uid, status속성이 포함되어있습니다.
// imp_uid는 아임포트 주문번호, merchant_uid는 가맹점 주문번호, 그리고 status는 결제 결과를 나타냅니다.
// 콜백 url 에서 수신한 imp_uid와 merchant_uid를 통해 아임포트 REST API를 활용하여 결제 정보를 조회한 후, 해당 데이터를 가맹점 서버에 동기화할 수 있습니다.

const getTokenFromIamPort = async () => {
  try {
    const response = await axios({
      url: "https://api.iamport.kr/users/getToken",
      method: "post", // POST method
      headers: { "Content-Type": "application/json" }, // "Content-Type": "application/json"
      data: {
        imp_key: process.env.IMP_KEY, // REST API키
        imp_secret: process.env.IMP_SECRET, // REST API Secret
      },
    });
    if (response.status === 200) {
      return response.data.response.access_token;
    }
  } catch (error) {
    throw new AppError(error.response.data.message, error.response.status);
  }
};

const getDataFromIamPort = async (accessToken, merchantUID) => {
  try {
    const response = await axios({
      url: `https://api.iamport.kr/payments/find/${merchantUID}`,
      method: "get", // POST method
      headers: {
        "Content-Type": "application/json",
        Authorization: accessToken,
      },
    });
    return response.data.response;
  } catch (error) {
    throw new AppError(error.response.data.message, error.response.status);
  }
};
const updateInventory = async (cartID) => {
  const cart = await Cart.findById(cartID);
  for (const item of cart.items) {
    const product = await Product.findById(item.product._id);
    //TODO: 음수일 경우 어떤식으로 처리 할 것인지
    let newInventory = product.inventory - item.quantity;
    if (newInventory < 0) newInventory = 0;
    await Product.findByIdAndUpdate(product.id, { inventory: newInventory });
  }
};

exports.sendAlarmTalkWhenPaid = catchAsync(async (req, res, next) => {
  const token = await getTokenFromIamPort();
  const data = await getDataFromIamPort(token, req.body.merchant_uid);
  console.log(data);
  req.data = data;
  const customData = JSON.parse(data.custom_data);
  console.log(customData);
  req.data.customData = customData;
  return aligoApi.sendAlimtalk(req, res);
});
exports.createOrder = catchAsync(async (req, res, next) => {
  const doc = await Order.create(req.body);
  await updateInventory(req.body.cart);
  const newCart = await Cart.create({});
  await User.findByIdAndUpdate(req.body.user, { cart: newCart.id });
  //UpdateCoupon
  if (req.body.coupon) {
    User.update(
      {
        _id: req.body.user,
        coupon: { $elemMatch: { code: req.body.coupon } },
      },
      { $set: { coupon: { isUsed: true } } },
      (error, result) => {
        if (error) {
        }
        console.log(result);
      }
    );
  }

  res.status(201).json({
    status: "success",
    data: {
      data: doc,
    },
  });

  // const doc = await Order.create({
  //   _id: data.merchant_uid,
  //   // _id: "test",
  //   address: {
  //     address: data.buyer_addr,
  //     postcode: data.buyer_postcode,
  //   },
  //   scheduledDate: data.customerData?.scheduledDate ?? null,
  //   deliveryRequest: data.customerData?.deliveryRequest ?? null,

  //   payMethod: data.pay_method,
  //   paidAmount: data.amount,
  //   user: data.customerData.customerId,
  //   cart: data.customerData.cartId,
  // });
});
//Client
exports.getMyOrders = catchAsync(async (req, res, next) => {
  //find order by ID
  const docs = await Order.find({ user: req.user.id }).sort("-createdAt");

  res.status(200).json({
    status: "success",
    results: docs.length,
    //when sending arrary
    data: {
      data: docs,
    },
  });
});

//Should be only for admin
exports.getAllOrders = factory.getAll(Order);
exports.getOrder = factory.getOne(Order);
exports.updateOrder = factory.updateOne(Order);
exports.deleteOrder = factory.deleteOne(Order);
