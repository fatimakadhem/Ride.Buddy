const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const tripRoutes = require("./routes/trips");
const authRoutes = require("./routes/auth");

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

const app = express();

connectDB().then(() => {
  app.use(express.json());
  app.use(cors());

  app.use("/api/trips", tripRoutes);
  app.use("/api/auth", authRoutes);

  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "client/build")));

    // ✅ FIXED wildcard route
    app.get("*", (req, res) => {
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
