const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slug = require("mongoose-slug-generator");
const mongooseDelete = require("mongoose-delete");
mongoose.plugin(slug);

const ProductSchema = new Schema(
  {
    name: { type: String, default: "", require: true },
    description: { type: String, default: "" },
    img: { type: String, default: "" },
    imgSlide: { type: Array, require: true },
    category: { type: String, default: "", require: true },
    categoryChild: { type: String, default: "", require: true },
    gender: { type: String, default: "", require: true },
    favourite: [{ username: { type: Boolean } }],
    rate: [
      {
        username: { type: String },
        star: { type: Number },
      },
    ],
    comment: [
      {
        username: { type: String },
        fullName: { type: String },
        img: { type: String },
        text: { type: String },
        imgsComment: { type: Array },
        createdAt: { type: String },
        children: [
          {
            username: { type: String },
            fullName: { type: String },
            img: { type: String },
            text: { type: String },
            imgsComment: { type: Array },
            createdAt: { type: String },
          },
        ],
      },
    ],
    priceOld: { type: Number, default: 0 },
    priceCurrent: { type: Number, default: 0 },
    saleOffPercent: { type: Number, default: 0 },
    saleOffLable: { type: String, default: "" },
    slug: { type: String, slug: "name", unique: true },
    bought: { type: Number, default: 0 },
    buff: Buffer,
  },
  {
    timestamps: true,
  }
);
ProductSchema.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: "all",
});

module.exports = mongoose.model("product", ProductSchema);
