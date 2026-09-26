const CurrentStock = require("../model/CurrentStock");

const sign = { IMPORT: 1, RETURN: 1, SALE: -1, TRANSFER: -1 };

async function updateCurrentStock({ distributor, brand, cylinderType, type, quantity }) {
  const delta = quantity * sign[type];

  await CurrentStock.findOneAndUpdate(
    { distributor, brand, cylinderType },
    { $inc: { quantity: delta }, $set: { lastUpdated: new Date() } },
    { upsert: true, new: true }
  );
}

module.exports = updateCurrentStock;