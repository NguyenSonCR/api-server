const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongooseDelete = require("mongoose-delete");

const ThemeSchema = new Schema(
  {
    name: { type: String, default: "", require: true },
    active: { type: String, default: "inactive", require: true },
    primaryColor: { type: String, default: "#2ea865", require: true },
    hoverPrimaryColor: { type: String, default: "#31B46C", require: true },
    textColor: { type: String, default: "#333", require: true },
    backgroundColor: {
      type: String,
      default: "rgb(248, 252, 250 )",
      require: true,
    },
    borderColor: { type: String, default: "#dbdbdb", require: true },
    deleteColor: { type: String, default: "#ff0000", require: true },
    buff: Buffer,
  },
  {
    timestamps: true,
  }
);
ThemeSchema.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: "all",
});

module.exports = mongoose.model("theme", ThemeSchema);
