var mongoose = require("mongoose");
var Cart = require("../models/cart");
const { query, body, validationResult } = require("express-validator");
const queue = require("../services/message_queue");

queue.start();

const CUSTOMER_TYPE = 1;

const myValidationResult = validationResult.withDefaults({
  formatter: (error) => {
    return error.msg;
  },
});

exports.validateUser = [
  query("user_id").isMongoId(),
  function (req, res, next) {
    const errors = myValidationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).send("Account id isn't valid!");
    }

    if (req.query.user_type != CUSTOMER_TYPE) {
      return res.status(401).send("User don't have the authorization!");
    }

    next();
  },
];

exports.getCart = function (req, res, next) {
  Cart.findOne({ user_id: req.query.user_id })
    .select({
      _id: 0,
      user_id: 0,
    })
    .exec(function (err, cart) {
      if (err) {
        return next(err);
      }

      if (!cart) {
        return res.status(404).send("Cart of user not found!");
      }

      res.json(cart);
    });
};

exports.createCart = function (req, res, next) {
  Cart.countDocuments({ user_id: req.query.user_id }, function (err, count) {
    if (err) return next(err);
    if (count > 0) {
      return res.status(400).send("User already has a cart!");
    }
    cart = new Cart();
    cart.user_id = req.query.user_id;

    cart
      .save()
      .then(() => res.send("Cart has been created for user."))
      .catch(next);
  });
};

exports.addItem = async function (goods, quantity, userId) {
  var cart;
  try {
    cart = await Cart.findOne({ user_id: userId }).exec();
  } catch (e) {
    console.log(e.message);
    return false;
  }

  if (!cart) {
    return console.log("Cart of user not found!");
  }

  var cart_item = cart.getItem(goods._id);
  if (!cart_item) {
    var item = goods;
    item.goods_id = goods._id;
    item.quanity = quantity;
    item.sum_amount = goods.price * quantity;
    delete item._id;
    delete item._price;

    cart.items.push(goods);
  } else {
    cart_item.quantity = cart_item.quantity + quantity;
    cart_item.sum_amount = goods.price * cart_item.quantity;
  }

  try {
    await cart.save();
  } catch (e) {
    console.log(e.message);
    return false;
  }

  return true;
};

exports.emptyCart = function (req, res, next) {
  Cart.findOne({ user_id: req.query.user_id }, function (err, cart) {
    if (err) return next(err);

    if (!cart) {
      return res.status(404).send("Cart of user not found!");
    }

    cart.items = [];
    cart
      .save()
      .then(() => res.send("Cart has been empty"))
      .catch(function (error) {
        res.status(500).send(error.message);
      });
  });
};

exports.validateAndSanitizeItem = [
  body("goods_id", "Goods Id must be alphanumeric and 24 in length!")
    .trim()
    .isLength({ min: 24, max: 24 })
    .isAlphanumeric(),
  body("goods_name", "Goods name required!").trim().isEmpty().escape(),
  body("quantity", "Quantity must be an integer above 0!")
    .isInt({ min: 1 })
    .toInt(),
  body("price", "Price must be equal to greater then 0!")
    .isFloat({ min: 0 })
    .toFloat(),
  function (req, res, next) {
    const errors = myValidationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json(errors.mapped());
    }
    next();
  },
];
