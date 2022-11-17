const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongooseDelete = require("mongoose-delete");

const TransportSchema = new Schema(
  {
    name: { type: String, default: "", require: true },
    price: { type: Number, default: 0, require: true },
    img: { type: String, default: "", require: true },
    buff: Buffer,
  },
  {
    timestamps: true,
  }
);
TransportSchema.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: "all",
});

module.exports = mongoose.model("transport", TransportSchema);
