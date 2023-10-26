require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { errorMiddleware } = require("./src/middlewares");
const cookieParser = require("cookie-parser");

const app = express();

// middlewares
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// routes
app.use("/auth", require("./src/routes/auth.routes"));
app.use("/role", require("./src/routes/role.routes"));
app.use("/user", require("./src/routes/user.routes"));
app.use("/product", require("./src/routes/product.routes"));
app.use("/partner", require("./src/routes/partner.routes"));
app.use("/location", require("./src/routes/location.routes"));
app.use("/category", require("./src/routes/category.routes"));
app.use("/sale", require("./src/routes/sale.routes"));
app.use("/purchase", require("./src/routes/purchase.routes"));
app.use("/stock", require("./src/routes/stock.routes"));
app.use("/salelines", require("./src/routes/saleline.routes"));
app.use("/purchaselines", require("./src/routes/purchaseline.routes"));
app.use("/inventory-adjustment", require("./src/routes/adjustment.routes"));

app.all("*", (req, res, next) => {
  const err = new Error(`Route ${req.originalUrl} not found`);
  err.statusCode = 404;
  next(err);
});

// middleware for all fallback errors
app.use(errorMiddleware);

module.exports = app;
