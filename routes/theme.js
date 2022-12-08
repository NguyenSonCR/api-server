const express = require("express");
const router = express.Router();
const Theme = require("../models/Theme");

// @router GET api/theme/
// @desc get theme active
// @access private
router.get("/", async (req, res) => {
  try {
    const theme = await Theme.find({});
    if (theme) {
      res.json({
        success: true,
        theme,
        message: "Đã lấy giao diện thành công",
      });
    } else {
      return res
        .status(200)
        .json({ success: false, message: "Không có giao diện nào" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// @router PUT api/theme/default
// @desc set theme default
// @access private
router.patch("/default", async (req, res) => {
  try {
    const theme = await Theme.findOne({ active: "active" });
    if (theme) {
      await Theme.findOneAndUpdate(
        { name: theme.name },
        { active: "inactive" },
        {
          new: true,
        }
      );

      res.status(200).json({
        success: true,
        message: "Đã đặt giao diện mặc định",
      });
    } else {
      return res
        .status(200)
        .json({ success: false, message: "Không có giao diện nào" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// @router GET api/theme/active
// @desc get theme active
// @access private
router.get("/active", async (req, res) => {
  try {
    const theme = await Theme.findOne({ active: "active" });
    if (theme) {
      res.json({
        success: true,
        theme,
        message: "Đã lấy giao diện thành công",
      });
    } else {
      return res
        .status(500)
        .json({ success: false, message: "Không có giao diện nào được chọn" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// @router POST api/theme/new
// @desc post new theme
// @access private
router.post("/new", async (req, res) => {
  const {
    name,
    active,
    primaryColor,
    hoverPrimaryColor,
    textColor,
    backgroundColor,
    borderColor,
    deleteColor,
  } = req.body;
  // Simple validation
  try {
    const newTheme = new Theme({
      name,
      active,
      primaryColor,
      hoverPrimaryColor,
      textColor,
      backgroundColor,
      borderColor,
      deleteColor,
    });

    const theme = await Theme.findOne({ name });
    if (theme)
      return res
        .status(200)
        .json({ success: false, message: "Tên giao diện đã tồn tại" });

    await newTheme.save();
    res.json({
      success: true,
      message: "Đã thêm mới giao diện",
      theme: newTheme,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "server error" });
  }
});

// @router DELETE api/them/:name/delete
// @desc DELETE theme
// @access private
router.delete("/:name/delete", async (req, res) => {
  try {
    const condition = { name: req.params.name };
    const deleteTheme = await Theme.deleteOne(condition);
    // user not Authori to restore
    if (!deleteTheme)
      return res.status(401).json({
        success: false,
        message: "Không tìm thấy giao diện này",
      });
    else {
      res.json({
        success: true,
        message: "Đã xóa giao diện thành công",
        theme: deleteTheme,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// @router PATCH api/them/:name/active
// @desc active theme
// @access private
router.patch("/:name/active", async (req, res) => {
  try {
    const name = req.params.name;

    const themeStop = await Theme.findOne({ active: "active" });
    if (themeStop) {
      await Theme.findOneAndUpdate(
        { name: themeStop.name },
        { active: "inactive" },
        {
          new: true,
        }
      );
      const updated = { active: "active" };

      const themeActive = await Theme.findOneAndUpdate(
        { name: name },
        updated,
        { new: true }
      );

      res.status(200).json({
        success: true,
        message: "Đã đổi giao diện thành công",
        theme: themeActive,
      });
    } else {
      const updated = { active: "active" };
      const themeActive = await Theme.findOneAndUpdate(
        { name: name },
        updated,
        { new: true }
      );

      res.status(200).json({
        success: true,
        message: "Đã đổi giao diện thành công",
        theme: themeActive,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
