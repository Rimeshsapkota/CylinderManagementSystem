const Distributor = require("../model/Distributor");
const Brand = require("../model/Brand");
const StockTransaction = require("../model/StockTransaction");

exports.createDistributor = async (req, res) => {
  try {
    const distributor = await Distributor.create(req.body);
    res.status(201).json(distributor);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAllDistributors = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;
  
      const [distributors, total] = await Promise.all([
        Distributor.find().skip(skip).limit(limit).sort({ createdAt: -1 }),
        Distributor.countDocuments()
      ]);
  
      res.json({
        data: distributors,
        total,
        page,
        totalPages: Math.ceil(total / limit)
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

exports.getDistributorById = async (req, res) => {
  try {
    const distributor = await Distributor.findById(req.params.id);
    if (!distributor) return res.status(404).json({ error: "Distributor not found" });
    res.json(distributor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateDistributor = async (req, res) => {
  try {
    const distributor = await Distributor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!distributor) return res.status(404).json({ error: "Distributor not found" });
    res.json(distributor);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteDistributor = async (req, res) => {
  try {
    const distributor = await Distributor.findByIdAndDelete(req.params.id);
    if (!distributor) return res.status(404).json({ error: "Distributor not found" });
    res.json({ message: "Distributor deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



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