const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Missing Product"],
    },
    onHand: {
      type: Number,
      min: 0,
      required: [true, "Missing OnHand Qantity"],
    },
    description: { type: String },
    comment: { type: String },
  },
  { timestamps: true }
);

schema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id.toString();
  return object;
});

schema.pre(/^find/, function (next) {
  this.populate("product", "name").sort({ name: 1 });
  next();
});

const Stock = mongoose.model("Stock", schema);

module.exports = Stock;
