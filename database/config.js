const Product = require("../src/models/product.js");
const Partner = require("../src/models/partner.js");
const Location = require("../src/models/location.js");
const Category = require("../src/models/category.js");

module.exports = {
  DB_HOST: "mongodb://0.0.0.0:27017/pos_db",

  SEEDS: [
    [Category, require("./factories/CategoryFactory")(15)],
  ],
};