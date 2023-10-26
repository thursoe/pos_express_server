const mongoose = require("mongoose");
const { randomUUID } = require("crypto");

const schema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Expected String"] },
    address: { type: String },
    city: { type: String },
    phone: { type: String },
    image: String,
    code: {
      type: String,
      default: () => randomUUID(),
    },
    isCustomer: { type: Boolean, default: false },
    isCompany: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

schema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id.toString();
  return object;
});

const Partner = mongoose.model("Partner", schema);

module.exports = Partner;
