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
    const types = await CylinderType.find();
    res.json(types);
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