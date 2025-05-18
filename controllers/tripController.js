const Trip = require("../models/Trip");
const mongoose = require("mongoose");

// POST /api/trips
exports.createTrip = async (req, res) => {
  try {
    const { startLocation, endLocation, tripDate, capacity } = req.body;
    const driverId = req.user.id;

    const newTrip = await Trip.create({
      startLocation,
      endLocation,
      tripDate,
      capacity,
      driver: new mongoose.Types.ObjectId(driverId),
      passengers: [], // förare räknas inte som passagerare
    });

    res.status(201).json(newTrip);
  } catch (err) {
    console.error("Fel vid skapande av resa:", err);
    res.status(500).json({ message: "Kunde inte skapa resa.", error: err.message });
  }
};

// GET /api/trips
exports.getTrips = async (req, res) => {
  try {
    const userId = req.user.id;

    const trips = await Trip.find()
      .populate("driver", "name")
      .populate("passengers", "name");

    const tripsWithJoinStatus = trips.map((trip) => {
      const isJoined = trip.passengers.some((p) => p._id.toString() === userId);
      return {
        ...trip.toObject(),
        joined: isJoined,
      };
    });

    res.status(200).json(tripsWithJoinStatus);
  } catch (err) {
    console.error("Fel vid hämtning av resor:", err);
    res.status(500).json({ message: "Kunde inte hämta resor." });
  }
};

// PATCH /api/trips/:id/join
exports.joinTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) return res.status(404).json({ message: "Resa hittades inte." });

    const userId = req.user.id;

    if (trip.driver.toString() === userId) {
      return res.status(400).json({ message: "Du är föraren av resan." });
    }

    const alreadyJoined = trip.passengers.some(
      (passengerId) => passengerId.toString() === userId
    );
    if (alreadyJoined) {
      return res.status(400).json({ message: "Du är redan med i resan." });
    }

    if (trip.passengers.length >= trip.capacity) {
      return res.status(400).json({ message: "Inga lediga platser." });
    }

    trip.passengers.push(new mongoose.Types.ObjectId(userId));
    await trip.save();

    res.status(200).json({ success: true, trip });
  } catch (err) {
    console.error("❌ joinTrip error:", err);
    res.status(500).json({ message: "Kunde inte gå med i resa.", error: err.message });
  }
};

// PATCH /api/trips/:id/unjoin
exports.unjoinTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) return res.status(404).json({ message: "Resa hittades inte." });

    const userId = req.user.id;

    if (trip.driver.toString() === userId) {
      return res.status(400).json({ message: "Föraren kan inte lämna sin egen resa." });
    }

    trip.passengers = trip.passengers.filter(
      (p) => p.toString() !== userId
    );

    await trip.save();

    res.status(200).json({ success: true, message: "Du har lämnat resan." });
  } catch (err) {
    console.error("❌ unjoinTrip error:", err);
    res.status(500).json({ message: "Kunde inte lämna resan." });
  }
};

// DELETE /api/trips/:id
exports.deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: "Resa hittades inte." });

    const userId = req.user.id;
    if (trip.driver.toString() !== userId) {
      return res.status(403).json({ message: "Du har inte behörighet att ta bort denna resa." });
    }

    await trip.deleteOne();
    res.status(200).json({ success: true, message: "Resan togs bort." });
  } catch (err) {
    console.error("❌ deleteTrip error:", err);
    res.status(500).json({ message: "Kunde inte ta bort resan." });
  }
};
