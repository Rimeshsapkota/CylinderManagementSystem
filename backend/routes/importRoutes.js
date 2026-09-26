const express = require("express");
const router = express.Router();
const { createImport, getAllImports } = require("../controllers/importController");

router.post("/", createImport);
router.get("/", getAllImports);

module.exports = router;