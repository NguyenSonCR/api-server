require("dotenv").config();
const express = require("express");
const router = express.Router();
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const verifyToken = require("../middleware/auth");
const User = require("../models/User");

//@route GET api/admin/users/
//@descreption get all guest
//@access private
router.get("/", verifyToken, async (req, res) => {
  try {
    const users = await User.find({});
    if (!users)
      return res
        .status(400)
        .json({ success: false, message: "Don't have users" });
    res.json({ success: true, users, message: "Get users successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// @route GET api/users/:username
// @desc Get info user
// @access private

router.get("/:username", verifyToken, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (user) {
      return res.json({
        success: true,
        user,
        message: "Lay thong tin user thanh cong",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// @route POST api/users/register
// @desc Register user
// @access public
router.post("/register", async (req, res) => {
  const { username, password, img } = req.body;

  // simple validation
  if (!username || !password)
    return res
      .status(400)
      .json({ success: false, message: "Missing username or password" });

  try {
    // check for existing user
    const user = await User.findOne({ username });
    if (user)
      return res.status(400).json({ success: false, message: "User existing" });

    //   All good
    const hashedPassword = await argon2.hash(password);
    const newUser = new User({
      username: username,
      password: hashedPassword,
      img,
      phonenumber: null,
      address: null,
      fullName: null,
    });
    await newUser.save();

    // return accessToken
    const accessToken = jwt.sign(
      { userId: newUser._id },
      process.env.ACCESS_TOKEN_SECRET
    );
    return res.json({
      success: true,
      message: "User created successfully",
      accessToken,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "server error" });
  }
});

// @route POST api/users/login
// @desc Login user
// @access public
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  // simple validation
  if (!username || !password)
    return res
      .status(400)
      .json({ success: false, message: "Missing username or password" });

  try {
    // check for existing user
    const user = await User.findOne({ username });
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "Incorrect username" });

    const passwordValid = await argon2.verify(user.password, password);
    if (!passwordValid)
      return res
        .status(400)
        .json({ success: false, message: "Incorrect password" });

    // all good
    // return accessToken
    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET
    );
    return res.json({
      success: true,
      message: "Log in successfully",
      accessToken,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "server error" });
  }
});

// @route PUT api/users/checkout/addinfo
// @desc add info user when checkout
// @access private
router.put("/:username/checkout/addinfo", verifyToken, async (req, res) => {
  const { fullName, phoneNumber, address } = req.body;
  const username = req.params.username;
  try {
    const updated = {
      fullName: fullName,
      phoneNumber: phoneNumber,
      address: address,
    };
    let updatedUser = await User.findOneAndUpdate(
      { username: username },
      updated,
      {
        new: true,
      }
    );
    return res.json({
      success: true,
      message: "Đã thêm sản phẩm checkout vào giỏ hàng",
      user: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// @route PUT api/users/checkout/changeinfo
// @desc change info user when click
// @access private
router.put("/:username/checkout/changeinfo", verifyToken, async (req, res) => {
  const username = req.params.username;
  try {
    const updated = {
      fullName: null,
      phoneNumber: null,
      address: null,
    };
    let updatedUser = await User.findOneAndUpdate(
      { username: username },
      updated,
      {
        new: true,
      }
    );
    return res.json({
      success: true,
      message: "Đã thêm sản phẩm checkout vào giỏ hàng",
      user: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
