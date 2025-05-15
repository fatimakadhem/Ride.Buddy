const express = require("express");
const router = express.Router();
const {
  createTrip,
  getTrips,
  joinTrip,
  unjoinTrip,
} = require("../controllers/tripController");
const verifyToken = require("../middleware/verifyToken");

// All routes below require the user to be logged in
router.post("/", verifyToken, createTrip); // Create trip route
router.get("/", verifyToken, getTrips); // Get all trips route
router.patch("/:id/join", verifyToken, joinTrip); // Join trip route
router.patch("/:id/unjoin", verifyToken, unjoinTrip);

module.exports = router;
