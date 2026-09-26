const StockTransaction = require("../model/StockTransaction");
const updateCurrentStock = require("../utils/updateStock");

exports.createTransaction = async (req, res) => {
  try {
    const txn = await StockTransaction.create(req.body);
    await updateCurrentStock(txn);
    res.status(201).json(txn);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const txns = await StockTransaction.find()
      .populate("distributor", "name")
      .populate("brand", "name")
      .populate("cylinderType", "size")
      .sort({ date: -1 });
    res.json(txns);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};