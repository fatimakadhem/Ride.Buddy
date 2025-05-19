const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

const tripRoutes = require("./routes/trips");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user"); // ✅ Added user routes

// Load environment variables in development
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// API Routes
app.use("/api/trips", tripRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

// Serve frontend in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client", "build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

// ✅ Safe async server start
const startServer = async () => {
  try {
    await connectDB();
    console.log("✅ MongoDB connected");

    const PORT = process.env.PORT;

    if (!PORT) {
      console.error("❌ No PORT provided. Make sure you're using a Render Web Service.");
      process.exit(1);
    }

    console.log("🌐 Using Render PORT:", PORT);
    app.listen(PORT, () => {
      console.log(`✅ Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1); // Exit if DB fails
  }
};

console.log("🚀 Starting server...");
startServer();
