require("dotenv").config();
const express = require("express");
const router = express.Router();
const fs = require("fs");

const Product = require("../models/Product");
const Category = require("../models/Category");

// @route POST api/products/create
// @desc Create product
// @access private

router.post("/create", async (req, res) => {
  const {
    name,
    description,
    category,
    categoryChild,
    gender,
    img,
    imgSlide,
    priceOld,
    priceCurrent,
    saleOffPercent,
    saleOffLable,
    bought,
  } = req.body;

  try {
    const newProduct = new Product({
      name,
      description,
      category,
      categoryChild,
      gender,
      img,
      imgSlide,
      priceOld,
      priceCurrent,
      saleOffPercent,
      saleOffLable,
      bought,
    });

    await newProduct.save();
    res.json({
      success: true,
      message: "Thêm mới sản phẩm thành công!",
      product: newProduct,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "server error" });
  }
});

// @route POST api/products
// @desc Read products
// @access private
router.get("/", async (req, res) => {
  try {
    const products = await Product.find({});
    res.json({ success: true, products });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "server error" });
  }
});

// @route POST api/products/trash
// @desc Read products deleted sort
// @access private
router.get("/trash", async (req, res) => {
  try {
    const products = await Product.findDeleted({});
    res.json({ success: true, products });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "server error" });
  }
});

// @route PUT api/products/:slug/update
// @desc Update post
// @ Access private

router.put("/:slug/update", async (req, res) => {
  const {
    name,
    description,
    img,
    imgSlide,
    category,
    categoryChild,
    gender,
    priceOld,
    priceCurrent,
    saleOffPercent,
    saleOffLable,
    bought,
  } = req.body;

  try {
    let updatedProduct = {
      name,
      description,
      img,
      imgSlide,
      category,
      categoryChild,
      gender,
      priceOld,
      priceCurrent,
      saleOffPercent,
      saleOffLable,
      bought,
    };
    const productUpdatedCondition = { slug: req.params.slug };
    updatedProduct = await Product.findOneAndUpdate(
      productUpdatedCondition,
      updatedProduct,
      { new: true }
    );

    // user not Authori to update
    if (!updatedProduct)
      return res.status(401).json({
        success: false,
        message: "Không tìm thấy sản phẩm",
      });
    res.json({
      success: true,
      message: "Cập nhật sản phẩm thành công!",
      product: updatedProduct,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// @route DELETE api/products/:slug/delete
// @desc Delete sort product
// @ Access private
router.delete("/:slug/delete", async (req, res) => {
  try {
    const productDeleteCondition = { slug: req.params.slug };
    const deleteProduct = await Product.delete(productDeleteCondition);
    // user not Authori to delete
    if (!deleteProduct)
      return res.status(401).json({
        success: false,
        message: "Không tìm thấy sản phẩm",
      });

    res.json({
      success: true,
      message: "Đã xóa sản phẩm thành công!",
      product: deleteProduct,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// @route DELETE api/products/trash/:slug/delete
// @desc Delete  product
// @ Access private
router.delete("/trash/:slug/destroy", async (req, res) => {
  const slug = req.params.slug;
  try {
    const product = await Product.findOneDeleted({ slug: slug });
    const productDeleteCondition = { slug: slug };
    const condition = fs.existsSync(
      `./static${product.img.split(process.env.DOMAIN)[1]}`
    );
    if (condition)
      fs.unlinkSync(`./static${product.img.split(process.env.DOMAIN)[1]}`);
    let i = 0;
    await product.imgSlide.map((p) => {
      if (i === product.imgSlide.length) {
        const path = `./static${p.split(process.env.DOMAIN)[1]}`;
        const condition = fs.existsSync(path);
        if (condition) fs.unlinkSync(path);
        return;
      } else {
        const path = `./static${p.split(process.env.DOMAIN)[1]}`;
        const condition = fs.existsSync(path);
        if (condition) fs.unlinkSync(path);
        i = i + 1;
      }
    });
    const deleteProduct = await Product.deleteOne(productDeleteCondition);
    // user not Authori to delete
    if (!deleteProduct)
      return res.status(401).json({
        success: false,
        message: "Product not found",
      });

    res.json({
      success: true,
      message: "Đã xóa sản phẩm thành công!",
      product: deleteProduct,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// @route DELETE api/products/trash/:slug/restore
// @desc restore product
// @ Access private
router.patch("/trash/:slug/restore", async (req, res) => {
  try {
    const productRestoreCondition = { slug: req.params.slug };
    const restoreProduct = await Product.restore(productRestoreCondition);
    // user not Authori to restore
    if (!restoreProduct)
      return res.status(401).json({
        success: false,
        message: "Product not found",
      });

    res.json({
      success: true,
      message: "Đã khôi phục sản phẩm thành công!",
      product: restoreProduct,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// @route GET api/products/comment/post
// @desc post comment
// @access private

router.patch("/comment/post", async (req, res) => {
  const { username, fullName, _id, img, text } = req.body;
  try {
    const product = await Product.findOne({ _id: _id });
    if (!product)
      return res.json({ success: false, message: "Không tìm thấy sản phẩm" });
    const newComment = {
      username,
      fullName,
      img,
      text,
    };
    let updated = {
      comment: product.comment.concat(newComment),
    };
    const updatedProduct = await Product.findOneAndUpdate(
      { _id: _id },
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
// @desc post comment
// @access private

router.patch("/comment/children/post", async (req, res) => {
  const { username, fullName, _id, commentId, img, text } = req.body;
  try {
    const product = await Product.findOne({ _id: _id });
    if (!product)
      return res.json({ success: false, message: "Không tìm thấy sản phẩm" });
    const newCommentChildren = {
      username,
      fullName,
      img,
      text,
    };
    let updated = {
      comment: product.comment.map((item) => {
        if (item._id == commentId) {
          return {
            username: item.username,
            fullName: item.fullName,
            img: item.img,
            text: item.text,
            children: item.children.concat(newCommentChildren),
          };
        } else {
          return item;
        }
      }),
    };

    const updatedProduct = await Product.findOneAndUpdate(
      { _id: _id },
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

// @route POST api/products/comment/delete
// @desc delete comment
// @access private

router.patch("/comment/delete", async (req, res) => {
  const { _id, comment } = req.body;
  try {
    const product = await Product.findOne({ _id: _id });
    if (!product)
      return res.json({ success: false, message: "Không tìm thấy sản phẩm" });
    let updatedComment = product.comment.filter(
      (item) => item._id != comment._id
    );

    let updated = {
      comment: updatedComment,
    };
    const updatedProduct = await Product.findOneAndUpdate(
      { _id: _id },
      updated,
      { new: true }
    );
    res.json({
      success: true,
      message: "Đã xóa bình luận thành công",
      product: updatedProduct,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// @route GET api/products/addbought/:_id
// @desc add bought
// @access private

router.patch("/addbought", (req, res) => {
  const checkout = req.body;
  checkout.map(async (item) => {
    try {
      const product = await Product.findOne({
        _id: item.product._id,
      });
      if (!product)
        return res.json({
          success: false,
          message: "Không tìm thấy sản phẩm",
        });

      let updated = {
        bought: product.bought + item.amount,
      };
      await Product.findOneAndUpdate({ _id: item.product._id }, updated, {
        new: true,
      });
    } catch (error) {
      console.log(error);
    }
  });
  return res.json({
    success: true,
    message: "Đã thêm mới vào sản phẩm đã bán",
  });
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

// @route GET api/products/category/:id
// @desc Read all category
// @access private
router.get("/category/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    res.json({ success: true, category });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// @route CREATE api/products/category
// @desc manage category products
// @ Access private
router.post("/category/new", async (req, res) => {
  const { name, img } = req.body;

  // Simple validation
  if (!name)
    return res.status(400).json({
      success: false,
      message: "Name category is required",
    });

  try {
    const newCategory = new Category({
      name,
      img,
    });

    const category = await Category.findOne({ name });
    if (category)
      return res
        .status(400)
        .json({ success: false, message: "Danh mục sản phẩm đã tồn tại" });

    await newCategory.save();
    res.json({
      success: true,
      message: "Create category product successfully!",
      category: newCategory,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "server error" });
  }
});

// @route DELETE api/products/category/:id
// @desc Delete category
// @ Access private
router.delete("/category/:id/delete", async (req, res) => {
  try {
    const category = await Category.findOne({ _id: req.params.id });
    const productDeleteCondition = { _id: req.params.id };
    const deleteCategory = await Category.deleteOne(productDeleteCondition);

    const path = `./static${category.img.split(process.env.DOMAIN)[1]}`;
    const condition = fs.existsSync(path);
    if (condition) fs.unlinkSync(path);

    // user not Authori to delete
    if (!deleteCategory)
      return res.status(401).json({
        success: false,
        message: "Category not found",
      });

    res.json({
      success: true,
      message: "Category is deleted",
      category: category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// @route POST api/products/category/:slug/addchildren
// @desc post new category children
// @access private
router.patch("/category/:slug/addchildren", async (req, res) => {
  const slug = req.params.slug;
  const { newCategoryChildren } = req.body;
  const { childrenName } = newCategoryChildren;
  try {
    const category = await Category.findOne({ slug: slug });
    if (!category) {
      return res.status(401).json({
        success: false,
        message: "Category not found",
      });
    } else {
      const condition = category.children.some(
        (categoryChildren) => categoryChildren.childrenName === childrenName
      );
      if (condition)
        return res.json({
          success: false,
          message: "Danh mục đã tồn tại",
        });
      let updated = {
        children: [...category.children, newCategoryChildren],
      };
      let newCategory = await Category.findOneAndUpdate(
        { slug: slug },
        updated,
        { new: true }
      );

      return res.json({
        success: true,
        message: "Add category Children successfully!",
        category: newCategory,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// @route PATCH api/products/category/:slug/deletechildren
// @desc delete category children
// @access private
router.patch("/category/:slug/deletechildren", async (req, res) => {
  const slug = req.params.slug;
  const categoryChildren = req.body;
  try {
    const category = await Category.findOne({ slug: slug });
    if (!category) {
      return res.status(401).json({
        success: false,
        message: "Category not found",
      });
    } else {
      let catedelete = category.children.filter(
        (children) => children._id != categoryChildren._id
      );
      let updated = {
        children: catedelete,
      };

      let newCategory = await Category.findOneAndUpdate(
        { slug: slug },
        updated,
        { new: true }
      );

      return res.json({
        success: true,
        message: "Category Children deleted successfully!",
        category: newCategory,
      });
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
      res.json({ success: false, message: "Khong tim thay san pham" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
