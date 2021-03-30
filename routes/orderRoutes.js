const express = require("express");
const authController = require("../controllers/authController");
const orderController = require("../controllers/orderController");

const router = express.Router();
//Webhook
router.route("/webhook").post(orderController.createOrderWhenPaid);

router.use(authController.protect);
router.route("/myOrders").get(orderController.getMyOrders);

//Admin
router.use(authController.restrictTo);
router.route("/").get(orderController.getAllOrders);

router
  .route("/:id")
  .get(orderController.getOrder)
  .patch(orderController.updateOrder)
  .delete(orderController.deleteOrder);
module.exports = router;
