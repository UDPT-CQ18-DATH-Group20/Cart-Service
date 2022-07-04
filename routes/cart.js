var express = require("express");
var router = express.Router();
var auth = require("../services/authenticate");

var cartController = require("../controllers/cartController");

router.use(auth);
router.use(cartController.validateUser);
router.post("/", cartController.createCart);
router.get("/", cartController.getCart);
router.put("/empty-cart", cartController.emptyCart);

module.exports = router;
