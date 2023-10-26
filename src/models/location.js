const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Missing Location Name"] },
    description: { type: String },
    comment: { type: String },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

schema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id.toString();
  return object;
});

const Location = mongoose.model("Location", schema);

module.exports = Location;
