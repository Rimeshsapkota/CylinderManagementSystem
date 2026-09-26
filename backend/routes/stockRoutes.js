const express = require("express");
const router = express.Router();
const { createTransaction, getAll } = require("../controllers/stockTransactionController");

router.post("/", createTransaction);
router.get("/", getAll);

module.exports = router;