const mongoose = require("mongoose");

const distributorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },        // Dealer name
    proprietorName: String,                          // Proprietor Name
    phone: String,                                    // Phone No
    location: {
      district: { type: String, required: true },
      municipality: String,                           // Local Address
      ward: String
    },
    contact: String,
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Distributor", distributorSchema);