const express = require("express");
const itemController = require("../controllers/itemController");
const authController = require("../controllers/authController");

const router = express.Router();
//Client
router.use(authController.protect);
router
  .route("/")
  .post(itemController.checkInventory, itemController.createItem);

router
  .route("/:id")
  .patch(itemController.checkInventory, itemController.updateItem)
  .delete(itemController.deleteItem);

module.exports = router;
