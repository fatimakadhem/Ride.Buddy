const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const tripRoutes = require("./routes/trips");
const authRoutes = require("./routes/auth");

// ✅ Load environment variables (only in dev)
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

const app = express();

// ✅ Connect to MongoDB
connectDB().then(() => {
  app.use(express.json());
  app.use(cors());

  // ✅ API routes
  app.use("/api/trips", tripRoutes);
  app.use("/api/auth", authRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/build")));

  // ✅ CORRECT wildcard route for React and Express 5+
  app.get("/:path*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}


  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch((err) => {
  console.error("MongoDB connection error:", err);
});
