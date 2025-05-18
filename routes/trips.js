const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");

const {
  createTrip,
  getTrips,
  joinTrip,
  unjoinTrip,
  deleteTrip, // 🆕 Importera
} = require("../controllers/tripController");

// Routes
router.post("/", verifyToken, createTrip);
router.get("/", verifyToken, getTrips);
router.patch("/:id/join", verifyToken, joinTrip);
router.patch("/:id/unjoin", verifyToken, unjoinTrip);
router.delete("/:id", verifyToken, deleteTrip); // 🆕 Delete route

module.exports = router;
