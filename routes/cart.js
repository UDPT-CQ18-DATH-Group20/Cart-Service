var express = require("express");
var router = express.Router();

var cartController = require("../controllers/cartController");

router.get("/", cartController.cart_list);

module.exports = router;
