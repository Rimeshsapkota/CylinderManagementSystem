const express = require("express");
const router = express.Router();
const { createImport, getAllImports, updateImport } = require("../controllers/importController");

router.post("/", createImport);
router.get("/", getAllImports);
router.put("/:id", updateImport);

module.exports = router;