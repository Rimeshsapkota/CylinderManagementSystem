const Import = require("../model/Import");
const StockTransaction = require("../model/StockTransaction");
const updateCurrentStock = require("../utils/updateStock");

exports.createImport = async (req, res) => {
  try {
    const importRecord = await Import.create(req.body);

    const txn = await StockTransaction.create({
      distributor: importRecord.destinationDistributor,
      brand: importRecord.brand,
      cylinderType: importRecord.cylinderType,
      type: "IMPORT",
      quantity: importRecord.quantity,
      refImport: importRecord._id,
      date: importRecord.importDate
    });

    await updateCurrentStock(txn);

    res.status(201).json(importRecord);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAllImports = async (req, res) => {
  try {
    const imports = await Import.find()
      .populate("brand", "name code")
      .populate("cylinderType", "size unit")
      .populate("destinationDistributor", "name")
      .sort({ importDate: -1 });
    res.json(imports);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};