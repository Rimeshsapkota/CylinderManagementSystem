const express = require("express");
const router = express.Router();
const { getAll } = require("../controllers/currentStockController");

router.get("/", getAll);

module.exports = router;