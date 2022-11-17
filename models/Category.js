const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slug = require("mongoose-slug-generator");
const mongooseDelete = require("mongoose-delete");
mongoose.plugin(slug);

const CategorySchema = new Schema(
  {
    name: {
      type: String,
    },
    img: {
      type: String,
    },
    slug: { type: String, slug: "name", unique: true },
    children: [
      {
        childrenName: {
          type: String,
        },
        childrenImg: {
          type: String,
        },
        createAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);
CategorySchema.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: "all",
});

module.exports = mongoose.model("category", CategorySchema);
