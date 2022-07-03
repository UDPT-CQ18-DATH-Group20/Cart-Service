var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ItemSchema = new Schema({
  goods_id: { type: Schema.Types.ObjectId, required: true },
  name: { type: String, required: true },
  picture: { type: String, required: true },
  quantity: { type: Number, default: 1, min: 1, required: true },
  sum_amount: { type: Number, min: 0, required: true },
});

var CartSchema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, required: true },
    total_amount: { type: Number, default: 0, min: 0 },
    items: [ItemSchema],
  },
  {
    versionKey: false,
    methods: {
      getItem(goods_id) {
        item = this.items.filter(function (item) {
          return item.goods_id == goods_id;
        });

        if (!item) return false;
        return item.pop();
      },
    },
  }
);

module.exports = mongoose.model("Cart", CartSchema);
