const mongoose = require("mongoose");

const currentStockSchema = new mongoose.Schema(
  {
    distributor: { type: mongoose.Schema.Types.ObjectId, ref: "Distributor", required: true },
    brand: { type: mongoose.Schema.Types.ObjectId, ref: "Brand", required: true },
    cylinderType: { type: mongoose.Schema.Types.ObjectId, ref: "CylinderType", required: true },
    quantity: { type: Number, required: true, default: 0 },
    lastUpdated: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

// prevent duplicate rows for same distributor+brand+type combo
currentStockSchema.index({ distributor: 1, brand: 1, cylinderType: 1 }, { unique: true });

module.exports = mongoose.model("CurrentStock", currentStockSchema);