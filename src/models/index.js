const User = require("./user.js");
const Role = require("./role.js");
const Product = require("./product.js");
const Partner = require("./partner.js");
const Location = require("./location.js");
const Category = require("./category.js");
const SaleOrder = require("./saleOrder.js");
const SaleOrderLine = require("./saleLine.js");
const PurchaseOrder = require("./purchaseOrder.js");
const PurchaseOrderLine = require("./purchaseLine.js");
const Stock = require("./stock.js");
const Adjustment = require("./adjustment.js");

const models = {
  User,
  Role,
  Product,
  Partner,
  Location,
  Category,
  SaleOrder,
  SaleOrderLine,
  PurchaseOrder,
  PurchaseOrderLine,
  Stock,
  Adjustment,
};

module.exports = models;
