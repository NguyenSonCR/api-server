const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slug = require("mongoose-slug-generator");
const mongooseDelete = require("mongoose-delete");
mongoose.plugin(slug);

const OrderSchema = new Schema(
  {
    user: { type: Object, require: true },
    checkout: { type: Object, require: true },
    state: {
      confirm: { type: Boolean },
      cancel: { type: Boolean },
      packed: { type: Boolean },
      shipper: { type: Boolean },
      transported: { type: Boolean },
      done: { type: Boolean },
    },
    shipper: { type: String, default: null },
    transport: {
      name: { type: String, default: "", require: true },
      price: { type: Number, default: 0, require: true },
    },
    buff: Buffer,
  },
  {
    timestamps: true,
  }
);
OrderSchema.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: "all",
});

module.exports = mongoose.model("order", OrderSchema);
