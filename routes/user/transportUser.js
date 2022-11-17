const express = require("express");
const router = express.Router();
const Transport = require("../../models/Transport");

// @router GET api/transport
// @desc get all transport
// @access private
router.get("/", async (req, res) => {
  try {
    const transports = await Transport.find({});
    if (transports) {
      res.json({
        success: true,
        transports,
        message: "Đã lấy đơn vị vận chuyển thành công",
      });
    } else {
      return res
        .status(500)
        .json({ success: false, message: "Không có đơn vị vận chuyển nào" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
