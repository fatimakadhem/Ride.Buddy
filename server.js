const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

const tripRoutes = require("./routes/trips");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user"); // flytta upp

dotenv.config();

const app = express();

// ✅ Aktivera CORS för att tillåta anrop från localhost:5000
app.use(cors({ origin: "http://localhost:5000", credentials: true }));

// ✅ Middleware för att läsa JSON i request-body
app.use(express.json());

connectDB()
  .then(() => {
    // ✅ Alla routes här inne
    app.use("/api/trips", tripRoutes);
    app.use("/api/auth", authRoutes);
    app.use("/api/user", userRoutes);

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`✅ Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });
