require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const auth = require("./middleware/auth");
const authRoutes = require("./routes/authRoutes");

const brandRoutes = require("./routes/brandRoutes");
const cylinderTypeRoutes = require("./routes/cylinderTypeRoutes");
const distributorRoutes = require("./routes/distributorRoutes");
const importRoutes = require("./routes/importRoutes");
const stockRoutes = require("./routes/stockRoutes");
const currentStockRoutes = require("./routes/currentStockRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();

connectDB();

app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());

app.get("/", (req, res) => res.send("API running"));

// Public routes
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Owner-only routes (JWT required)
app.use("/api/brands", auth, brandRoutes);
app.use("/api/cylinder-types", auth, cylinderTypeRoutes);
app.use("/api/distributors", auth, distributorRoutes);
app.use("/api/imports", auth, importRoutes);
app.use("/api/stock-transactions", auth, stockRoutes);
app.use("/api/current-stock", auth, currentStockRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});