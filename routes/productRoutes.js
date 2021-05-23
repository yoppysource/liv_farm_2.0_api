const express = require("express");
const productController = require("../controllers/productController");
const authController = require("../controllers/authController");
const reviewRouter = require("./reviewRoutes");

const router = express.Router();

router.use("/:productId/reviews", reviewRouter);

router
  .route("/")
  .get(authController.identifyingRole, productController.getAllProducts)
  .post(
    authController.protect,
    authController.restrictTo,
    productController.createProduct
  );
router
  .route("/:id")
  .get(productController.getProduct)
  .patch(
    authController.protect,
    authController.restrictTo,
    productController.updateProduct
  )
  .delete(
    authController.protect,
    authController.restrictTo,
    productController.deleteProduct
  );

module.exports = router;
