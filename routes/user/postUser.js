const express = require("express");
const router = express.Router();

const Post = require("../../models/Post");

router.get("/", async (req, res) => {
  try {
    const posts = await Post.find({});
    if (posts) {
      res.json({ success: true, posts });
    } else {
      return res
        .status(500)
        .json({ success: false, message: "Không có bài viết nào" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// @route GET api/posts/:slug
// @desc Get post detail
// @access private
router.get("/:slug", async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug });
    if (post) {
      res.json({ success: true, post });
    } else {
      res.json({ success: false, message: "Khong tim thay bài viết " });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
