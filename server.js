const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const tripRoutes = require("./routes/trips");
const authRoutes = require("./routes/auth");

dotenv.config(); // Load environment variables from .env file

const app = express(); // Create Express app

// Connect to MongoDB
connectDB().then(() => {
  app.use(express.json()); // Middleware for parsing JSON
  app.use(cors()); // Middleware for handling CORS

  // Set up API routes
  app.use("/api/trips", tripRoutes); // Routes for trip-related operations
  app.use("/api/auth", authRoutes); // Routes for authentication

  const PORT = process.env.PORT || 3000; // Use environment variable or default to port 3000
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch((err) => {
  console.error("MongoDB connection error:", err);
});
