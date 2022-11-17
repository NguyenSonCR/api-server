const express = require("express");
const router = express.Router();

const Product = require("../../models/Product");
const Category = require("../../models/Category");

// @route POST api/products
// @desc Read products
// @access private
router.get("/", async (req, res) => {
  try {
    const products = await Product.find({});
    res.json({ success: true, products });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// @route GET api/products/category
// @desc Read all category
// @access private
router.get("/category", async (req, res) => {
  try {
    const categories = await Category.find({});
    res.json({ success: true, categories });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// @route GET api/products/comment/post
// @desc post comment
// @access private

router.patch("/comment/post", async (req, res) => {
  const { username, fullName, productId, img, text, imgsComment } = req.body;
  const D = new Date();
  const date = `${D.getDate()}/${D.getMonth() + 1}/${D.getFullYear()}`;
  try {
    const product = await Product.findOne({ productId: productId });
    if (!product)
      return res.json({ success: false, message: "Không tìm thấy sản phẩm" });
    const newComment = {
      username,
      fullName,
      img,
      text,
      imgsComment,
      createdAt: date,
    };
    let updated = {
      comment: product.comment.concat(newComment),
    };
    const updatedProduct = await Product.findOneAndUpdate(
      { productId: productId },
      updated,
      { new: true }
    );
    res.json({
      success: true,
      message: "Đã gửi phản hồi thành công",
      product: updatedProduct,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// @route GET api/products/comment/children/post
// @desc post comment children
// @access private

router.patch("/comment/children/post", async (req, res) => {
  const { username, fullName, productId, commentId, img, text } = req.body;
  const D = new Date();
  const date = `${D.getDate()}/${D.getMonth() + 1}/${D.getFullYear()}`;
  try {
    const product = await Product.findOne({ productId: productId });
    if (!product)
      return res.json({ success: false, message: "Không tìm thấy sản phẩm" });
    const newCommentChildren = {
      username,
      fullName,
      img,
      text,
      createdAt: date,
    };
    let updated = {
      comment: product.comment.map((item) => {
        if (item._id == commentId) {
          return {
            username: item.username,
            fullName: item.fullName,
            img: item.img,
            imgsComment: item.imgsComment,
            createdAt: item.createdAt,
            text: item.text,
            children: item.children.concat(newCommentChildren),
          };
        } else {
          return item;
        }
      }),
    };

    const updatedProduct = await Product.findOneAndUpdate(
      { productId: productId },
      updated,
      { new: true }
    );
    res.json({
      success: true,
      message: "Đã gửi phản hồi thành công",
      product: updatedProduct,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// @route GET api/products/category/:slug
// @desc Read all category with slug
// @access private
router.get("/category/:slug", async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    if (category) {
      res.json({
        success: true,
        category,
        message: "get category successfully",
      });
    } else {
      res.json({ success: false, message: "Không tìm thấy danh mục sản phẩm" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// @route POST api/products/:slug
// @desc Read product detail
// @access private
router.get("/:slug", async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (product) {
      res.json({ success: true, product });
    } else {
      res.json({ success: false, message: "Không tìm thấy sản phẩm" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
