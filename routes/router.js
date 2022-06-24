var express = require("express");
var router = express.Router();
var cartRouter = require("./cart");

router.use("/cart", cartRouter);

module.exports = router;
