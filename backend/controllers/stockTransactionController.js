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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [txns, total] = await Promise.all([
      StockTransaction.find()
        .populate("distributor", "name")
        .populate("brand", "name")
        .populate("cylinderType", "size unit")
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit),
      StockTransaction.countDocuments()
    ]);

    res.json({
      data: txns,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateTransaction = async (req, res) => {
  try {
    const txn = await StockTransaction.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!txn) return res.status(404).json({ error: "Transaction not found" });
    res.json(txn);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};