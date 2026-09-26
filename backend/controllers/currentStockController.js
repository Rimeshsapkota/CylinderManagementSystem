const CurrentStock = require("../model/CurrentStock");

exports.getAll = async (req, res) => {
  const stock = await CurrentStock.find()
    .populate("distributor brand cylinderType");
  res.json(stock);
};