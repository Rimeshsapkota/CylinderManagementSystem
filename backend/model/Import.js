const mongoose = require("mongoose");

const importSchema = new mongoose.Schema(
  {
    brand: { type: mongoose.Schema.Types.ObjectId, ref: "Brand", required: true },
    cylinderType: { type: mongoose.Schema.Types.ObjectId, ref: "CylinderType", required: true },
    quantity: { type: Number, required: true, min: 1 },
    sourceLocation: { type: String, required: true },
    destinationDistributor: { type: mongoose.Schema.Types.ObjectId, ref: "Distributor", required: true },
    importDate: { type: Date, required: true },
    vehicleNumber: String,
    invoiceNumber: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("Import", importSchema);