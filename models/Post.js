const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slug = require("mongoose-slug-generator");
const mongooseDelete = require("mongoose-delete");
mongoose.plugin(slug);

const PostSchema = new Schema(
  {
    title: { type: String, default: "", require: true },
    header: { type: String, default: "", require: true },
    content: { type: String, default: "", require: true },
    img: { type: Array, require: true },
    slug: { type: String, slug: "title", unique: true },
    buff: Buffer,
  },
  {
    timestamps: true,
  }
);
PostSchema.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: "all",
});

module.exports = mongoose.model("post", PostSchema);
