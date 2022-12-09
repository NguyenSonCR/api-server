require("dotenv").config();
const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");

// @route PUT api/cart/addcart
// @desc add product in cart
// @access private

router.post("/add", async (req, res) => {
  const { username, product, amount } = req.body;
  try {
    const cart = await Cart.findOne({ username: username });
    // khi người dùng lần đầu tạo giỏ hàng
    if (!cart) {
      const newCart = new Cart({
        username,
        products: [
          {
            product: product,
            amount: amount,
          },
        ],
      });
      await newCart.save();
      return res.json({
        success: true,
        message: "Create new Cart successfully!",
        cart: newCart,
      });
    }

    if (cart.products.length === 0) {
      // thêm mới sản phẩm khi chưa có sản phẩm nào
      const cartItemAdd = { product: product, amount: amount };
      const updated = {
        products: [cartItemAdd],
      };
      let updatedCart = await Cart.findOneAndUpdate(
        { username: username },
        updated,
        { new: true }
      );
      return res.json({
        success: true,
        message: "Đã thêm mới sản phẩm vào giỏ hàng",
        cart: updatedCart,
      });
    } else if (cart.products.length > 0) {
      const condition = cart.products.find((cartItem) => {
        return cartItem.product._id === product._id;
      });

      //   thêm mới sản phẩm cùng loại
      if (condition) {
        const newProducts = cart.products.map((cartItem) => {
          return {
            product: cartItem.product,
            amount:
              cartItem.product._id === product._id
                ? cartItem.amount + 1
                : cartItem.amount,
          };
        });

        const updated = { products: newProducts };
        let updatedCart = await Cart.findOneAndUpdate(
          { username: username },
          updated,
          { new: true }
        );
        return res.json({
          success: true,
          message: "Đã thêm mới sản phẩm cùng loại vào giỏ hàng",
          cart: updatedCart,
        });
      } else {
        // Thêm mới sản phẩm khác loại
        const productsPre = cart.products;
        const cartItemAdd = { product: product, amount: amount };
        const updated = {
          products: [...productsPre, cartItemAdd],
        };
        let updatedCart = await Cart.findOneAndUpdate(
          { username: username },
          updated,
          { new: true }
        );
        return res.json({
          success: true,
          message: "Đã thêm mới sản phẩm khác loại vào giỏ hàng",
          cart: updatedCart,
        });
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "server error" });
  }
});

// @route PUT api/cart/remove
// @desc remove product on cart
// @access private

router.put("/remove", async (req, res) => {
  const { username, listProduct } = req.body;
  try {
    const cart = await Cart.findOne({ username: username });
    if (listProduct.length > 1) {
      const updatedArray = cart.products.filter((cartItem) => {
        let deleteProduct = listProduct.find((item) => {
          return item.product._id === cartItem.product._id;
        });

        if (deleteProduct) {
          return false;
        } else {
          return true;
        }
      });
      const updated = {
        products: updatedArray,
      };

      let updatedCart = await Cart.findOneAndUpdate(
        { username: username },
        updated,
        { new: true }
      );
      return res.json({
        success: true,
        message: "Đã xóa list sản phẩm khỏi giỏ hàng",
        cart: updatedCart,
      });
    } else {
      const updatedArray = cart.products.filter((cartItem) => {
        return cartItem.product._id !== listProduct[0].product._id;
      });
      const updated = {
        products: updatedArray,
      };

      let updatedCart = await Cart.findOneAndUpdate(
        { username: username },
        updated,
        { new: true }
      );
      return res.json({
        success: true,
        message: "Đã xóa 1 sản phẩm khỏi giỏ hàng",
        cart: updatedCart,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "server error" });
  }
});

router.put("/minus", async (req, res) => {
  const { username, product } = req.body;
  try {
    const cart = await Cart.findOne({ username: username });
    const newProducts = cart.products.map((cartItem) => {
      return {
        product: cartItem.product,
        amount:
          cartItem.product._id === product._id && cartItem.amount > 1
            ? cartItem.amount - 1
            : cartItem.amount,
      };
    });

    const updated = { products: newProducts };
    let updatedCart = await Cart.findOneAndUpdate(
      { username: username },
      updated,
      { new: true }
    );
    return res.json({
      success: true,
      message: "Đã trừ một sản phẩm cùng loại trong giỏ hàng",
      cart: updatedCart,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "server error" });
  }
});

// @route GET api/cart
// @desc get all product in cart
// @access private
router.get("/:username", async (req, res) => {
  try {
    const cart = await Cart.findOne({ username: req.params.username });
    if (cart) {
      return res.json({ success: true, cart: cart });
    } else {
      return res
        .status(500)
        .json({ success: false, message: "Don't have Cart" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// @route PUT api/cart/addcheckout
// @desc add checkout array on cart
// @access private
router.put("/addcheckout", async (req, res) => {
  const { username, checkout } = req.body;
  try {
    const updated = { checkout: checkout };
    let updatedCart = await Cart.findOneAndUpdate(
      { username: username },
      updated,
      { new: true }
    );
    return res.json({
      success: true,
      message: "Đã thêm sản phẩm checkout vào giỏ hàng",
      cart: updatedCart,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// @route PUT api/cart/removecheckout
// @desc add checkout array on cart
// @access private
router.put("/removecheckout", async (req, res) => {
  const { username, checkout } = req.body;

  try {
    const updated = { checkout: checkout };
    let updatedCart = await Cart.findOneAndUpdate(
      { username: username },
      updated,
      { new: true }
    );
    return res.json({
      success: true,
      message: "Đã xóa sản phẩm trong checkout",
      cart: updatedCart,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
