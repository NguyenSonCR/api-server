const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GuestSchema = new Schema({
  username: {
    type: String,
    require: true,
  },
  address: {
    type: String,
    require: true,
  },
  phonenumber: {
    type: String,
    require: true,
  },
  facebook: {
    type: String,
    require: true,
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("guest", GuestSchema);
