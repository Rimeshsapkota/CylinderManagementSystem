const express = require("express");
const router = express.Router();
const {
  createBrand,
  getAllBrands,
  getBrandById,
  updateBrand,
  deleteBrand
} = require("../controllers/brandController");

router.post("/", createBrand);
router.get("/", getAllBrands);
router.get("/:id", getBrandById);
router.put("/:id", updateBrand);
router.delete("/:id", deleteBrand);

module.exports = router;