var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var CartSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, required: true },
  total_amount: { type: Number },
  items: [
    {
      goods_id: Schema.Types.ObjectId,
      name: String,
      pricture: String,
      quantity: { type: Number, default: 1, min: 1 },
      sum_amount: { type: Number, min: 0 },
    },
  ],
});

module.exports = mongoose.model("Cart", CartSchema);
