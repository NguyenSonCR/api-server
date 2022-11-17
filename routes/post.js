const express = require("express");
const router = express.Router();

const Post = require("../models/Post");

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

// @router GET api/posts/trash
// @desc get all posts had deleted
// @access private
router.get("/trash", async (req, res) => {
  try {
    const postsDeleted = await Post.findDeleted({});
    if (postsDeleted) {
      return res.json({ success: true, postsDeleted: postsDeleted });
    } else {
      return res.json({
        success: false,
        message: "Không có bài viết nào đã xóa",
      });
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

// @router POST api/posts/new
// @desc Post one post
// @access private
router.post("/new", async (req, res) => {
  const { title, header, content, img } = req.body;
  // Simple validation
  if (!title || !header)
    return res.status(400).json({
      success: false,
      message: "Title and header is required",
    });
  try {
    const newPost = new Post({
      title,
      header,
      content,
      img,
    });

    const post = await Post.findOne({ title });
    if (post)
      return res
        .status(400)
        .json({ success: false, message: "Tiêu đề bài viết đã tồn tại" });

    await newPost.save();
    res.json({
      success: true,
      message: "Create new Post successfully!",
      post: newPost,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "server error" });
  }
});

// @router POST api/posts/:slug/update
// @desc updated one post
// @access private
router.put("/:slug/update", async (req, res) => {
  const { title, header, content, img } = req.body;
  // Simple validation
  if (!title || !header)
    return res.status(400).json({
      success: false,
      message: "Title and header is required",
    });
  try {
    let updatePost = {
      title,
      header,
      content,
      img,
    };

    const condition = { slug: req.params.slug };

    updatePost = await Post.findOneAndUpdate(condition, updatePost, {
      new: true,
    });
    // user not Authori to update
    if (!updatePost)
      return res.status(401).json({
        success: false,
        message: "Post not found or user not authorised",
      });
    res.json({
      success: true,
      message: "Updated successfully",
      post: updatePost,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "server error" });
  }
});

// @router DELETE api/posts/:slug/delete
// @desc delete soft post
// @access private

router.delete("/:slug/delete", async (req, res) => {
  try {
    const postDeleteCondition = { slug: req.params.slug };
    const deletePost = await Post.delete(postDeleteCondition);
    // user not Authori to delete
    if (!deletePost)
      return res.status(401).json({
        success: false,
        message: "Post not found",
      });

    res.json({
      success: true,
      message: "Post is deleted",
      post: deletePost,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// @router PATCH api/posts/trash/:slug/restore
// @desc restore post
// @access private
router.patch("/trash/:id/restore", async (req, res) => {
  try {
    const postRestoreCondition = { _id: req.params.id };
    const restorePost = await Post.restore(postRestoreCondition);
    console.log(restorePost);
    // user not Authori to restore
    if (!restorePost)
      return res.status(401).json({
        success: false,
        message: "Post not found",
      });
    else {
      res.json({
        success: true,
        message: "Post is restore",
        post: restorePost,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// @router DELETE api/posts/trash/:id/delete
// @desc destroy post
// @access private
router.delete("/trash/:id/delete", async (req, res) => {
  try {
    const postDeleteCondition = { _id: req.params.id };
    const deletePost = await Post.deleteOne(postDeleteCondition);
    // user not Authori to restore
    if (!deletePost)
      return res.status(401).json({
        success: false,
        message: "Post not found",
      });
    else {
      res.json({
        success: true,
        message: "Post is destroy",
        post: deletePost,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});
module.exports = router;
