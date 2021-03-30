const express = require("express");
const appInfoController = require("../controllers/appInfoController");
const authController = require("../controllers/authController");

const router = express.Router();
router.get("/:id", appInfoController.getAppInfo);
router.patch(
  "/:id",
  authController.protect,
  authController.restrictTo,
  appInfoController.updateAppInfo
);

module.exports = router;
