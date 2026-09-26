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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [imports, total] = await Promise.all([
      Import.find()
        .populate("brand", "name")
        .populate("cylinderType", "size unit")
        .populate("destinationDistributor", "name")
        .sort({ importDate: -1 })
        .skip(skip)
        .limit(limit),
      Import.countDocuments()
    ]);

    res.json({
      data: imports,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateImport = async (req, res) => {
  try {
    const importRecord = await Import.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!importRecord) return res.status(404).json({ error: "Import not found" });
    res.json(importRecord);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};