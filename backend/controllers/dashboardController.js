const Brand = require("../model/Brand");
const Distributor = require("../model/Distributor");
const StockTransaction = require("../model/StockTransaction");

exports.getSummary = async (req, res) => {
  try {
    const salesRegister = await StockTransaction.find({ type: "SALE" })
      .populate("distributor", "name proprietorName phone location")
      .populate("brand", "name")
      .sort({ date: -1 });

    const totalSold = salesRegister.reduce((sum, t) => sum + t.quantity, 0);
    const distributorCount = await Distributor.countDocuments();
    const brandCount = await Brand.countDocuments();

    res.json({
      brandCount,
      distributorCount,
      totalSold,
      salesRegister
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};