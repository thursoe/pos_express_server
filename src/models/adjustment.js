const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    product: mongoose.Schema.Types.ObjectId,
    productName: { type: String },
    productRef: { type: String },
    productBarcode: { type: String, required: true },
    quantity: {
      type: Number,
      required: true,
    },
    adjustmentReason: String,
  },
  { timestamps: true }
);

schema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id.toString();
  return object;
});

const Adjustment = mongoose.model("Adjustment", schema);

module.exports = Adjustment;
