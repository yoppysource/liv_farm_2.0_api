const express = require("express");
const authController = require("../controllers/authController");
const orderController = require("../controllers/orderController");

const router = express.Router();
//Admin
// router.use(authController.restrictTo);
router.route("/").get(orderController.getAllOrders);
//Webhook
router.route("/webhook").post(orderController.sendAlarmTalkWhenPaid);

router.use(authController.protect);
router.route("/").post(orderController.createOrder);
router.route("/myOrders").get(orderController.getMyOrders);

router
  .route("/:id")
  .get(orderController.getOrder)
  .patch(orderController.updateOrder)
  .delete(orderController.deleteOrder);
module.exports = router;
