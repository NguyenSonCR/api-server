const express = require("express");
const router = express.Router();
const fs = require("fs");

router.delete("/single", async (req, res) => {
  const { path } = req.body;

  try {
    fs.unlinkSync(path);
    return res
      .status(200)
      .json({ success: true, message: "Đã xóa list file", path: path });
    //file removed
  } catch (err) {
    console.error(err);
  }
});

router.delete("/multiple", async (req, res) => {
  const { path } = req.body;

  try {
    let i = 0;
    path.map((p) => {
      if (i === path.length) {
        fs.unlinkSync(p);
        return res
          .status(200)
          .json({ success: true, message: "Đã xóa list file", path: path });
      } else {
        fs.unlinkSync(p);
        i = i + 1;
      }
    });

    //file removed
  } catch (err) {
    return res.status(500).json({ success: false, message: "server error" });
  }
});

module.exports = router;
