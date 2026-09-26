const express = require("express");
const router = express.Router();
const {
  createDistributor,
  getAllDistributors,
  getDistributorById,
  updateDistributor,
  deleteDistributor
} = require("../controllers/distributorController");

router.post("/", createDistributor);
router.get("/", getAllDistributors);
router.get("/:id", getDistributorById);
router.put("/:id", updateDistributor);
router.delete("/:id", deleteDistributor);

module.exports = router;