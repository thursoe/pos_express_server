const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Missing Category Name"],
      unique: true,
    },
    description: { type: String },
    active: { type: Boolean, default: false },
  },
  { timestamps: true }
);

schema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id.toString();
  return object;
});

const Category = mongoose.model("Category", schema);

module.exports = Category;