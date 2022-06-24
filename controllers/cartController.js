var mongoose = require("mongoose");
var Cart = require("../models/cart");
const { check, validationResult } = require("express-validator");

const myValidationResult = validationResult.withDefaults({
  formatter: (error) => {
    return {
      message: error.msg,
    };
  },
});

exports.validateUserId = [
  check("user_id", "User Id must be alphanumeric and 24 in length!")
    .trim()
    .isLength({ min: 24, max: 24 })
    .isAlphanumeric(),
  function (req, res, next) {
    const errors = myValidationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).send("User id isn't valid!");
    } else next();
  },
];

exports.getCart = function (req, res, next) {
  Cart.findOne({ user_id: req.params.user_id })
    .select({
      _id: 0,
      user_id: 0,
    })
    .exec(function (err, cart) {
      if (err) {
        next(err);
      }

      if (!cart) {
        return res.status(404).send("Cart of user not found!");
      }

      res.json(cart);
    });
};

exports.createCart = function (req, res, next) {
  let userId = req.params.user_id;
  if (Cart.isCustomerExist(userId, next)) {
    return res.status(400).send("User already has a cart!");
  }

  cart = new Cart();
  cart.user_id = userId;

  cart
    .save()
    .then(() => res.send("Cart has been created for user."))
    .catch(next);
};

exports.addItem = [
  check("goods_id", "Goods Id must be alphanumeric and 24 in length!")
    .trim()
    .isLength({ min: 24, max: 24 })
    .isAlphanumeric(),
  check("goods_name", "Goods name required!")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  check("quantity", "quantity must be an integer above 0!")
    .trim()
    .isInt({ min: 1 })
    .toInt(),
  check("price", "price must be equal to greater then 0")
    .trim()
    .isFloat({ min: 0 })
    .toFloat(),
  function (req, res, next) {
    const errors = myValidationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json(errors.mapped());
    }

    let userId = req.params.user_id;
    let goodsID = req.body.goods_id;
    let goodsName = req.body.goods_name;
    let quantity = req.body.quantity;
    let price = req.body.price;

    Cart.findOne({ user_id: userId }, function (err, cart) {
      if (err) next(err);

      if (!cart) {
        return res.status(404).send("Cart of user not found!");
      }

      let item = cart.getItem(goodsID);
      if (!item) {
        item = {
          goods_id: goodsID,
          goods_name: goodsName,
          sum_amount: price * quantity,
        };

        cart.items.push(item);
      } else {
        item.quantity += quantity;
        item.sum_amount = price * item.quantity;
      }

      cart
        .save()
        .then(() => res.send("Add item successfull"))
        .catch(function (error) {
          res.status(500).send(error.message);
        });
    });
  },
];

exports.emptyCart = function (req, res, next) {
  Cart.findOne({ user_id: req.params.user_id }, function (err, cart) {
    if (err) next(err);

    cart.items = [];
    cart
      .save()
      .then(() => res.send("Cart has been empty"))
      .catch(function (error) {
        res.status(500).send(error.message);
      });
  });
};
