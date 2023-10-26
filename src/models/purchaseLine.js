const mongoose = require("mongoose");

const PurchaseOrderLineSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PurchaseOrder",
      required: true,
    },
    orderDate: { type: Date, required: true, default: Date.now },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Missing Product"],
    },
    qty: { type: Number, default: 0, required: true },
    tax: { type: Number, default: 0.0 },
    subTaxTotal: { type: Number, default: 0.0 },
    unitPrice: {
      type: Number,
      default: 0.0,
      required: true,
    },
    subTotal: {
      type: Number,
      default: 0.0,
      required: true,
    },
  },
  { timestamps: true, toObject: { flattenObjectIds: true } }
);

PurchaseOrderLineSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

PurchaseOrderLineSchema.pre(/^find/, function (next) {
  this.populate("product", "name").populate("orderId", "-lines -__v");
  next();
});

const PurchaseOrderLine = mongoose.model(
  "PurchaseOrderLine",
  PurchaseOrderLineSchema
);

module.exports = PurchaseOrderLine;
