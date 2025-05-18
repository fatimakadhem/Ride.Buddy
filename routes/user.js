const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const Trip = require("../models/Trip");
const User = require("../models/User");

// GET /user/history – Get structured trip history
router.get("/history", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select("name");

    const allTrips = await Trip.find({
      $or: [{ driver: userId }, { passengers: userId }],
    })
      .populate("driver", "name email")
      .populate("passengers", "name");

    const now = new Date();

    // Sortering
    const createdTrips = [];
    const upcoming = [];
    const previous = [];

    allTrips.forEach((trip) => {
      const isDriver = trip.driver._id.toString() === userId;
      const tripDate = new Date(trip.tripDate);

      if (isDriver) {
        createdTrips.push(trip);
      } else if (tripDate >= now) {
        upcoming.push(trip);
      } else {
        previous.push(trip);
      }
    });

    res.status(200).json({
      userId,
      userName: user.name,
      createdTrips,
      upcoming,
      previous,
    });
  } catch (err) {
    console.error("Error fetching trip history:", err);
    res.status(500).json({ message: "Something went wrong." });
  }
});

module.exports = router;
