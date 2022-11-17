const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CartSchema = new Schema({
  username: {
    type: String,
  },
  checkout: {
    type: Array,
  },
  products: [
    {
      product: { type: Object },
      amount: { type: Number },
    },
  ],

  createAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Cart", CartSchema);
