const mongoose = require("mongoose");
const { generateNumberPattern } = require("../utils/math");

const PurchaseOrderSchema = new mongoose.Schema(
  {
    orderDate: { type: Date, required: true, default: Date.now },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    partner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Partner",
      required: true,
    },
    location: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
      required: true,
    },
    lines: [
      {
        product: String,
        qty: Number,
        tax: Number,
        subTaxTotal: Number,
        unitPrice: Number,
        subTotal: Number,
        _id: false,
      },
    ],
    state: { type: String },
    note: { type: String },
    taxTotal: { type: Number },
    total: { type: Number, required: true },
    orderRef: { type: String, unique: true },
  },
  { timestamps: true }
);

PurchaseOrderSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

PurchaseOrderSchema.pre("save", function (next) {
  this.orderRef = generateNumberPattern();
  next();
});

PurchaseOrderSchema.pre(/^find/, function (next) {
  this.populate("user", "username")
    .populate("partner", "name")
    .populate("location", "name")

  next();
});

const PurchaseOrder = mongoose.model("PurchaseOrder", PurchaseOrderSchema);

module.exports = PurchaseOrder;
