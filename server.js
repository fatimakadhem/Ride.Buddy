const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const tripRoutes = require("./routes/trips");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");

// Load environment variables in development
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/trips", tripRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

// Serve static files in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client", "build")));

  // Fallback to index.html for SPA routing
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

// Connect to MongoDB and start server
connectDB()
  .then(() => {
    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
      console.log(`✅ Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1); // Exit if database connection fails
  });
