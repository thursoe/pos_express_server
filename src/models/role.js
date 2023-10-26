const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    name: { type: String, required: true},
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Role = mongoose.model("Role", schema);

module.exports = Role;
