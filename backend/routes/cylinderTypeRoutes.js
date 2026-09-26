const express = require("express");
const router = express.Router();
const {
  createCylinderType,
  getAllCylinderTypes,
  getCylinderTypeById,
  updateCylinderType,
  deleteCylinderType
} = require("../controllers/cylinderTypeController");

router.post("/", createCylinderType);
router.get("/", getAllCylinderTypes);
router.get("/:id", getCylinderTypeById);
router.put("/:id", updateCylinderType);
router.delete("/:id", deleteCylinderType);

module.exports = router;