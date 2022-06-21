var mongoose = require("mongoose");
var Cart = require("../models/cart");

exports.cart_list = function (req, res, next) {
  Cart.find({}).exec(function (err, cart_list) {
    if (err) {
      next(err);
    }

    if (!cart_list.length) {
      console.log("gay");
      cart = new Cart({
        user_id: mongoose.Types.ObjectId("62ab0780f470be717276745b"),
        total_amount: 100,
        items: [],
      });

      cart.save();
    }

    res.json({ data: cart_list });
  });
};
