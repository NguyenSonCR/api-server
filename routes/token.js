require("dotenv").config();
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

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

router.post("/", async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken)
    return res.json({ success: false, message: "không có refreshtoken" });

  const user = await Admin.findOne({ refreshToken: refreshToken });
  if (!user)
    return res.json({
      success: false,
      message: "refreshtoken không chính xác",
    });
  try {
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const tokens = generateTokens(user._id);

    const updated = { refreshToken: tokens.refreshToken };
    await Admin.findOneAndUpdate({ _id: user._id }, updated, { new: true });
    return res.json({
      success: true,
      tokens: tokens,
      message: "da lay accessToken thanh cong",
    });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: "server error" });
  }
});

module.exports = router;
