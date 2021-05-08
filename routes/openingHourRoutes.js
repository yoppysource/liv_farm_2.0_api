const express = require("express");
const openingHourController = require("../controllers/openingHourController");
const authController = require("../controllers/authController");

const router = express.Router();
router.post("/", openingHourController.createOpeningHour);
router.get("/:id", openingHourController.getOpeningHour);
router.patch(
  "/:id",
  //   authController.protect,
  //   authController.restrictTo,
  openingHourController.updateOpeningHour
);

module.exports = router;
