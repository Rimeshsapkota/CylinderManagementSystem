require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const brandRoutes = require("./routes/brandRoutes");
const cylinderTypeRoutes = require("./routes/cylinderTypeRoutes");
const distributorRoutes = require("./routes/distributorRoutes");
const importRoutes = require("./routes/importRoutes");
const stockRoutes = require("./routes/stockRoutes");
const currentStockRoutes = require("./routes/currentStockRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/brands", brandRoutes);

app.get("/", (req, res) => res.send("API running"));


app.use("/api/cylinder-types", cylinderTypeRoutes);


app.use("/api/distributors", distributorRoutes);


app.use("/api/imports", importRoutes);

app.use("/api/stock-transactions", stockRoutes);

app.use("/api/current-stock", currentStockRoutes);

app.use("/api/dashboard", dashboardRoutes);
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});