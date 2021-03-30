const express = require("express");
const couponController = require("../controllers/couponController");
const authController = require("../controllers/authController");

const router = express.Router();
//Client
router.use(authController.protect);
router.route("/registerCoupon").post(couponController.registerCoupon);
router.route("/useCoupon").post(couponController.useCoupon);

//Admin
router.use(authController.restrictTo);
router
  .route("/")
  .get(couponController.getAllCoupons)
  .post(couponController.createCoupon);

router
  .route("/:id")
  .patch(couponController.updateCoupon)
  .delete(couponController.deleteCoupon);
module.exports = router;
