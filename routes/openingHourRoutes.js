const express = require("express");
const openingHourController = require("../controllers/openingHourController");
const authController = require("../controllers/authController");

const router = express.Router();
router.get("/:id", openingHourController.updateOpeningHour);
router.patch(
  "/:id",
  //   authController.protect,
  //   authController.restrictTo,
  openingHourController.updateOpeningHour
);

module.exports = router;
