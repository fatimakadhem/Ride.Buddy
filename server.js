const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

const tripRoutes = require("./routes/trips");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");

dotenv.config();

const app = express();

// ✅ CORS – tillåt både localhost och produktion
const allowedOrigins = [
  "http://localhost:5000",           // local React dev
  "http://localhost:3000",           // local backend
  "https://din-render-url.onrender.com" // <-- byt ut till din riktiga URL sen
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

// ✅ Middleware
app.use(express.json());

// ✅ Routes
app.use("/api/trips", tripRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

// ✅ Anslut till databas och kör servern
connectDB()
  .then(() => {
    const PORT = process.env.PORT || 3000;

    // ✅ Om i produktion – serva React frontend
    if (process.env.NODE_ENV === "production") {
      const buildPath = path.join(__dirname, "client", "build");
      app.use(express.static(buildPath));

      app.get("*", (req, res) => {
        res.sendFile(path.join(buildPath, "index.html"));
      });
    }

    app.listen(PORT, () => {
      console.log(`✅ Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });
