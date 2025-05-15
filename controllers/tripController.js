const Trip = require("../models/Trip");
const mongoose = require("mongoose");

// POST /trips – skapa ny resa
// POST /trips – skapa ny resa
exports.createTrip = async (req, res) => {
  try {
    const { startLocation, endLocation, tripDate, capacity } = req.body;

    const driverId = req.user.id; // Comes from verifyToken middleware

    const newTrip = await Trip.create({
      startLocation,
      endLocation,
      tripDate,
      capacity,
      driver: new mongoose.Types.ObjectId(driverId), // ✅ required field
      passengers: [new mongoose.Types.ObjectId(driverId)], // ✅ consistent type
    });

    console.log("🧪 Created trip:", newTrip); // 👈 Add this

    res.status(201).json(newTrip);
  } catch (err) {
    console.error("Fel vid skapande av resa:", err);
    res
      .status(500)
      .json({ message: "Kunde inte skapa resa.", error: err.message });
  }
};

// GET /trips – hämta alla resor
// GET /trips – hämta alla resor
exports.getTrips = async (req, res) => {
  try {
    const userId = req.user.id; // <– den inloggade användaren

    const trips = await Trip.find()
      .populate("driver", "name")
      .populate("passengers", "name");

    // Lägg till "joined: true" på varje resa där användaren är passagerare
    const tripsWithJoinStatus = trips.map((trip) => {
      const isJoined = trip.passengers.some((p) => p._id.toString() === userId);

      return {
        ...trip.toObject(),
        joined: isJoined,
      };
    });

    res.status(200).json(tripsWithJoinStatus);
  } catch (err) {
    res.status(500).json({ message: "Kunde inte hämta resor." });
  }
};

// PATCH /trips/:id/join – gå med i en resa
exports.joinTrip = async (req, res) => {
  try {
    console.log("➡️ joinTrip called");

    const trip = await Trip.findById(req.params.id);
    console.log("🔍 trip.driver:", trip.driver);

    if (!trip) {
      return res.status(404).json({ message: "Resa hittades inte." });
    }

    const userId = req.user.id;

    // Check if already a passenger
    const alreadyJoined = trip.passengers.some(
      (passengerId) => passengerId.toString() === userId
    );

    if (alreadyJoined) {
      return res.status(400).json({ message: "Du är redan med i denna resa." });
    }

    // ✅ Do NOT reassign trip object or create new object!
    trip.passengers.push(new mongoose.Types.ObjectId(userId));
    // ✅ Make sure `trip.driver` still exists
    if (!trip.driver) {
      return res.status(500).json({ message: "Trip saknar förare." });
    }

    await trip.save();

    res.status(200).json({ success: true, trip });
  } catch (err) {
    console.error("❌ joinTrip error:", err);
    res
      .status(500)
      .json({ message: "Kunde inte gå med i resa.", error: err.message });
  }
};

exports.unjoinTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ message: "Resa hittades inte." });
    }

    const userId = req.user.id;

    // Don't allow the driver to unjoin their own trip
    if (trip.driver.toString() === userId) {
      return res
        .status(400)
        .json({ message: "Föraren kan inte lämna sin egen resa." });
    }

    // Remove user from passengers
    trip.passengers = trip.passengers.filter(
      (passengerId) => passengerId.toString() !== userId
    );

    await trip.save();

    res.status(200).json({ success: true, message: "Du har lämnat resan." });
  } catch (err) {
    console.error("❌ unjoinTrip error:", err);
    res.status(500).json({ message: "Kunde inte lämna resa." });
  }
};
