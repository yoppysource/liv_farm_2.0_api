const express = require("express");
const eventController = require("../controllers/eventController");
const authController = require("../controllers/authController");

const router = express.Router();
router.route("/").get(eventController.getAllEvents).post(
  // authController.protect,
  // authController.restrictTo,
  eventController.createEvent
);
router
  .route("/:id")
  .patch(
    // authController.protect,
    // authController.restrictTo,
    eventController.updateEvent
  )
  .delete(eventController.deleteEvent);

module.exports = router;
