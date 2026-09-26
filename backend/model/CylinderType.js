const mongoose = require("mongoose");

const cylinderTypeSchema = new mongoose.Schema(
  {
    size: { type: String, required: true, unique: true }, // "4kg", "14.2kg"
    unit: { type: String, default: "kg" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("CylinderType", cylinderTypeSchema);