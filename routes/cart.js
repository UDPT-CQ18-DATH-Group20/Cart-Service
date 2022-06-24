var express = require("express");
var router = express.Router();

var cartController = require("../controllers/cartController");

router.use("/:user_id", cartController.validateUserId);
router.post("/:user_id", cartController.createCart);
router.get("/:user_id", cartController.getCart);
router.post("/:user_id/add-item", cartController.addItem);
router.put("/:user_id/empty-cart", cartController.emptyCart);

module.exports = router;
