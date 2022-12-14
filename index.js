require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const port = process.env.PORT;
const verifyToken = require("./middleware/auth");

// route admin
const authRouter = require("./routes/auth");
const productRouter = require("./routes/product");
const postRouter = require("./routes/post");
const guestRouter = require("./routes/guest");
const orderRouter = require("./routes/order");
const cartRouter = require("./routes/cart");
const tokenRouter = require("./routes/token");
const transportRouter = require("./routes/transport");
const themeRouter = require("./routes/theme");
const uploadRouter = require("./routes/upload");
const deleteImageRouter = require("./routes/delete");

// route user
const userRouter = require("./routes/user/userAuth");
const productRouterUser = require("./routes/user/productUser");
const cartRouterUser = require("./routes/user/cartUser");
const postRouterUser = require("./routes/user/postUser");
const orderRouterUser = require("./routes/user/orderUser");
const transportRouterUser = require("./routes/user/transportUser");

const mongoose = require("mongoose");
const connectDB = async () => {
  try {
    await mongoose.connect(
      // `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.IP_SERVER}/${process.env.DB_NAME}`
      `mongodb+srv://app-sell:${process.env.DB_PASSWORD}@app-sell.dmldskr.mongodb.net/app-sell?retryWrites=true&w=majority`
    );
    console.log("MongoDB connected");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

connectDB();
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "static")));

app.use("/api/users", userRouter);
app.use("/api/cart", verifyToken, cartRouterUser);
app.use("/api/products", productRouterUser);
app.use("/api/posts", postRouterUser);
app.use("/api/order", verifyToken, orderRouterUser);
app.use("/api/transport", verifyToken, transportRouterUser);

app.use("/api/admin/auth", authRouter);
app.use("/api/admin/products", verifyToken, productRouter);
app.use("/api/admin/posts", verifyToken, postRouter);
app.use("/api/admin/guests", verifyToken, guestRouter);
app.use("/api/admin/order", verifyToken, orderRouter);
app.use("/api/admin/cart", verifyToken, cartRouter);
app.use("/api/admin/token", tokenRouter);
app.use("/api/admin/transport", verifyToken, transportRouter);
app.use("/api/admin/theme", verifyToken, themeRouter);
app.use("/api/admin/upload", verifyToken, uploadRouter);
app.use("/api/admin/image/delete", verifyToken, deleteImageRouter);

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
