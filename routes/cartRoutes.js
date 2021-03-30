const express = require("express");
const authController = require("../controllers/authController");
const cartController = require("../controllers/cartController");
const itemRouter = require("./itemRoutes");
const router = express.Router();

router.use("/myCart/items", itemRouter);

router.use(authController.protect);
router.get("/myCart", cartController.getMyCart, cartController.getCart);

//This is only for Admin
router.use(authController.restrictTo);

router
  .route("/")
  .get(cartController.getAllCarts)
  .post(cartController.createCart);

router
  .route("/:id")
  .get(cartController.getCart)
  .patch(cartController.updateCart)
  .delete(cartController.deleteCart);

module.exports = router;
