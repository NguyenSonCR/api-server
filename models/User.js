const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    require: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
  },
  img: {
    type: String,
  },

  phoneNumber: {
    type: String,
  },

  fullName: {
    type: String,
  },

  address: {
    type: String,
  },
  userId: {
    type: String,
    default: "",
  },
  uid: {
    type: String,
    default: "",
  },

  email: {
    type: String,
    default: "",
  },

  createAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", UserSchema);
