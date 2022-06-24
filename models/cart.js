var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ItemSchema = new Schema({
  goods_id: Schema.Types.ObjectId,
  name: String,
  quantity: { type: Number, default: 1, min: 1 },
  sum_amount: { type: Number, min: 0 },
});

var CartSchema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, required: true },
    total_amount: { type: Number, default: 0 },
    items: [ItemSchema],
  },
  {
    versionKey: false,
    methods: {
      getItem(goods_id) {
        item = this.items.filter(function (item) {
          return (item.goods_id = goods_id);
        });

        if (!item) return false;
        return item.pop();
      },
    },
    statics: {
      isCustomerExist(userId, callback) {
        this.countDocuments({ user_id: userId }, function (err, count) {
          if (err) callback(err);
          if (count > 0) return true;
          else return false;
        });
      },
    },
  }
);

module.exports = mongoose.model("Cart", CartSchema);
