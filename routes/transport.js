const express = require("express");
const router = express.Router();
const Transport = require("../models/Transport");

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

// @router POST api/transport/new
// @desc post new transport
// @access private
router.post("/new", async (req, res) => {
  const { name, price, img } = req.body;
  // Simple validation
  if (!name || !price)
    return res.status(200).json({
      success: false,
      message: "Bạn chưa nhập tên đơn vị và giá vận chuyển",
    });
  try {
    const newTransport = new Transport({
      name,
      price,
      img,
    });

    const transport = await Transport.findOne({ name });
    if (transport)
      return res
        .status(200)
        .json({ success: false, message: "Tên đơn vị vận chuyển đã tồn tại" });

    await newTransport.save();
    res.json({
      success: true,
      message: "Đã thêm mới đơn vị vận chuyển",
      transport: newTransport,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "server error" });
  }
});

// @router DELETE api/transport/:id/delete
// @desc DELETE  transport
// @access private
router.delete("/:id/delete", async (req, res) => {
  try {
    const id = { _id: req.params.id };
    const deleteTransport = await Transport.deleteOne(id);
    // user not Authori to restore
    if (!deleteTransport)
      return res.status(401).json({
        success: false,
        message: "Không tìm thấy đơn vị vận chuyển",
      });
    else {
      res.json({
        success: true,
        message: "Đã xóa đơn vị vận chuyển",
        transport: deleteTransport,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
