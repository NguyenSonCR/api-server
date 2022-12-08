require("dotenv").config();
const express = require("express");
const router = express.Router();
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const verifyToken = require("../middleware/auth");
const Admin = require("../models/Admin");

//@route GET api/auth/
//@descreption Checked if user is logged in
//@access Public
router.get("/", verifyToken, async (req, res) => {
  try {
    const user = await Admin.findById(req.userId).select("-password");
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "user not found" });
    res.json({ success: true, user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

const generateTokens = (payload) => {
  // return accessToken
  const accessToken = jwt.sign(
    { userId: payload },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "2h",
    }
  );

  const refreshToken = jwt.sign(
    { userId: payload },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );

  return { accessToken, refreshToken };
};

// @route POST api/auth/register
// @desc Register user
// @access public
router.post("/register", async (req, res) => {
  const { username, password, fullName, img } = req.body;

  // simple validation
  if (!username || !password)
    return res
      .status(400)
      .json({ success: false, message: "Missing username or password" });

  try {
    // check for existing user
    const user = await Admin.findOne({ username });
    if (user)
      return res
        .status(400)
        .json({ success: false, message: "Admin existing" });

    //   All good
    const hashedPassword = await argon2.hash(password);
    const newUser = new Admin({
      username: username,
      password: hashedPassword,
      fullName: fullName,
      refreshToken: null,
      img,
    });
    await newUser.save();

    // return accessToken
    const tokens = generateTokens(newUser._id);

    await Admin.findOneAndUpdate(
      { username },
      {
        refreshToken: tokens.refreshToken,
      },
      { new: true }
    );
    return res.json({
      success: true,
      message: "Admin created successfully",
      tokens: tokens,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "server error" });
  }
});

// @route POST api/auth/login
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
    const user = await Admin.findOne({ username });
    if (!user)
      return res.status(400).json({
        success: false,
        message: "Tên đăng nhập hoặc mật khẩu không chính xác",
      });

    const passwordValid = await argon2.verify(user.password, password);
    if (!passwordValid)
      return res.status(400).json({
        success: false,
        message: "Tên đăng nhập hoặc mật khẩu không chính xác",
      });

    // all good
    // return accessToken

    const tokens = generateTokens(user._id);
    await Admin.findOneAndUpdate(
      { username: username },
      { refreshToken: tokens.refreshToken },
      { new: true }
    );
    return res.json({
      success: true,
      message: "Đăng nhập thành công",
      tokens: tokens,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "server error" });
  }
});

// @route PUT api/auth/updated
// @desc change info user
// @access private

router.put("/updated", verifyToken, async (req, res) => {
  const user = req.body;
  try {
    const updated = {
      img: user.img,
    };
    let updatedUser = await Admin.findOneAndUpdate(
      { username: user.username },
      updated,
      {
        new: true,
      }
    );
    return res.json({
      success: true,
      message: "Đã thêm ảnh người dùng thành công",
      user: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// @route PUT api/auth/changepassword
// @desc change info acount
// @access private

router.put("/changepassword", verifyToken, async (req, res) => {
  const formValue = req.body;
  const { oldPassword, newPassword, username } = formValue;
  try {
    const user = await Admin.findOne({ username });
    const passwordValid = await argon2.verify(user.password, oldPassword);
    if (!passwordValid)
      return res.status(200).json({
        success: false,
        message: "Mật khẩu không chính xác",
      });
    const hashedPassword = await argon2.hash(newPassword);
    const updated = {
      password: hashedPassword,
    };
    let updatedUser = await Admin.findOneAndUpdate(
      { username: username },
      updated,
      {
        new: true,
      }
    );
    return res.json({
      success: true,
      message: "Đã đổi mật khẩu thành công",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
