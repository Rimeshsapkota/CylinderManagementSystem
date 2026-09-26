const mongoose = require("mongoose");

const stockTransactionSchema = new mongoose.Schema(
  {
    distributor: { type: mongoose.Schema.Types.ObjectId, ref: "Distributor", required: true },
    brand: { type: mongoose.Schema.Types.ObjectId, ref: "Brand", required: true },
    cylinderType: { type: mongoose.Schema.Types.ObjectId, ref: "CylinderType", required: true },
    type: { type: String, enum: ["IMPORT", "SALE", "RETURN", "TRANSFER"], required: true },
    quantity: { type: Number, required: true },
    remarks: String,                           
    refImport: { type: mongoose.Schema.Types.ObjectId, ref: "Import" },
    date: { type: Date, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("StockTransaction", stockTransactionSchema);