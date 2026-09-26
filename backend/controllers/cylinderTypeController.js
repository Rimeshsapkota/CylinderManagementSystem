const CylinderType = require("../model/CylinderType");

exports.createCylinderType = async (req, res) => {
  try {
    const type = await CylinderType.create(req.body);
    res.status(201).json(type);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAllCylinderTypes = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [types, total] = await Promise.all([
      CylinderType.find().skip(skip).limit(limit).sort({ createdAt: -1 }),
      CylinderType.countDocuments()
    ]);

    res.json({
      data: types,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getCylinderTypeById = async (req, res) => {
  try {
    const type = await CylinderType.findById(req.params.id);
    if (!type) return res.status(404).json({ error: "CylinderType not found" });
    res.json(type);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateCylinderType = async (req, res) => {
  try {
    const type = await CylinderType.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!type) return res.status(404).json({ error: "CylinderType not found" });
    res.json(type);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteCylinderType = async (req, res) => {
  try {
    const type = await CylinderType.findByIdAndDelete(req.params.id);
    if (!type) return res.status(404).json({ error: "CylinderType not found" });
    res.json({ message: "CylinderType deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};