const express = require("express");
const router = express.Router();
const { createTransaction, getAll, updateTransaction } = require("../controllers/stockTransactionController");

router.post("/", createTransaction);
router.get("/", getAll);
router.put("/:id", updateTransaction);

module.exports = router;