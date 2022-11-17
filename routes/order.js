const express = require("express");
const router = express.Router();

const Order = require("../models/Order");

// @route GET api/order/
// @desc get all order
// @access private

router.get("/", async (req, res) => {
  try {
    const orders = await Order.find({});
    if (orders) {
      return res.json({
        success: true,
        message: "Get all order successfully!",
        orders: orders,
      });
    } else {
      return res.json({
        success: false,
        message: "Don't have order",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// @route GET api/order/done
// @desc Read order deleted sort
// @access private
router.get("/done", async (req, res) => {
  try {
    const ordersDone = await Order.findDeleted({});
    if (ordersDone) {
      return res.json({ success: true, ordersDone: ordersDone });
    } else {
      return res.json({
        success: false,
        message: "Không có đơn hàng nào bị xóa",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// @route GET api/order/:username
// @desc get all order
// @access private

router.get("/:username", async (req, res) => {
  const username = req.params.username;
  try {
    const orders = await Order.find({});
    const response = orders.filter((order) => order.user.username === username);
    if (response.length > 0) {
      return res.json({
        success: true,
        message: "Get orders of user successfully!",
        orders: response,
      });
    } else {
      return res.json({
        success: false,
        message: "Don't have order",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// @route PUT api/order/:id/updated
// @desc get all order
// @access private

router.put("/:id/updated", async (req, res) => {
  const { id, confirm, packed, shipper, shipperOrigan, transported, done } =
    req.body;
  try {
    const order = await Order.findById(id);
    if (order) {
      let updated = {
        user: order.user,
        checkout: order.checkout,
        state: {
          confirm: confirm,
          packed: packed,
          shipper: shipper,
          transported: transported,
          done: done,
        },
        shipper: shipperOrigan,
      };
      let newOrder = await Order.findOneAndUpdate({ _id: id }, updated, {
        new: true,
      });

      return res.json({
        success: true,
        message: "Updated order successfully!",
        order: newOrder,
      });
    } else {
      return res.json({
        success: false,
        message: "Không tìm thấy order!",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// @route PUT api/order/:id/updated/transported
// @desc put order transported
// @access private
router.put("/:id/updated/tranported", async (req, res) => {
  const { id, confirm, packed, shipper, transported, done } = req.body;
  try {
    const order = await Order.findById(id);
    if (order) {
      let updated = {
        user: order.user,
        checkout: order.checkout,
        state: {
          confirm: confirm,
          packed: packed,
          shipper: shipper,
          transported: transported,
          done: done,
        },
      };
      let newOrder = await Order.findOneAndUpdate({ _id: id }, updated, {
        new: true,
      });

      return res.json({
        success: true,
        message: "Updated order successfully!",
        order: newOrder,
      });
    } else {
      return res.json({
        success: false,
        message: "Không tìm thấy order!",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// @route POST api/order/add
// @desc add order when user buy
// @access private

router.post("/add", async (req, res) => {
  const { user, checkout, state, shipper } = req.body;
  try {
    const newOrder = new Order({
      user,
      checkout,
      state,
      shipper,
    });
    await newOrder.save();
    return res.json({
      success: true,
      message: "Create new Order successfully!",
      order: newOrder,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// @route DELETE api/order/:id/delete
// @desc delete soft
// @access private
router.delete("/:id/delete", async (req, res) => {
  try {
    const orderDeleteCondition = { _id: req.params.id };
    const deleteOrder = await Order.delete(orderDeleteCondition);
    // user not Authori to delete
    if (!deleteOrder) {
      return res.status(401).json({
        success: false,
        message: "Order not found",
      });
    } else {
      res.json({
        success: true,
        message: "Order is deleted",
        order: deleteOrder,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// @route PATCH api/order/done/:id/restore
// @desc restore order
// @access private
router.patch("/done/:id/restore", async (req, res) => {
  try {
    const orderRestoreCondition = { _id: req.params.id };
    const restoreOrder = await Order.restore(orderRestoreCondition);
    // user not Authori to restore
    if (!restoreOrder)
      return res.status(401).json({
        success: false,
        message: "Order not found",
      });

    res.json({
      success: true,
      message: "Order is restore",
      order: restoreOrder,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// @route DELETE api/order/done/:id/destroy
// @desc restore order
// @access private
router.delete("/done/:id/destroy", async (req, res) => {
  try {
    const orderDestroyCondition = { _id: req.params.id };
    const destroyOrder = await Order.restore(orderDestroyCondition);
    // user not Authori to restore
    if (!destroyOrder)
      return res.status(401).json({
        success: false,
        message: "Order not found",
      });

    res.json({
      success: true,
      message: "Order is destroy",
      order: destroyOrder,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
