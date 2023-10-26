const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    ref: { type: String },
    salePrice: { type: Number, required: true },
    marginProfit: { type: Number },
    purchasePrice: { type: Number, required: true },
    barcode: { type: String, required: true, unique: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    tax: { type: Number, default: 0 },
    expiredAt: { type: String },
    image: String,
    avaliableInPos: { type: Boolean, default: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

schema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id.toString();
  return object;
});

const Product = mongoose.model("Product", schema);

module.exports = Product;
