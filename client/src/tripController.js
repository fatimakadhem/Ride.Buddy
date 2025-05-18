const Trip = require("../models/Trip");
const mongoose = require("mongoose");

// POST /trips – skapa ny resa
// POST /trips – skapa ny resa
exports.createTrip = async (req, res) => {
  try {
    const { startLocation, endLocation, tripDate, capacity } = req.body;

    const driverId = req.user.id;

    const newTrip = await Trip.create({
      startLocation,
      endLocation,
      tripDate,
      capacity, // ex: 2 = två passagerare får plats
      driver: new mongoose.Types.ObjectId(driverId),
      passengers: [], // ✅ FÖRAREN ÄR INTE PASSAGERARE!
    });

    console.log("🚗 Trip created:", newTrip);

    res.status(201).json(newTrip);
  } catch (err) {
    console.error("❌ Error creating trip:", err);
    res
      .status(500)
      .json({ message: "Kunde inte skapa resa.", error: err.message });
  }
};



// GET /trips – hämta alla resor
exports.getTrips = async (req, res) => {
  try {
    const userId = req.user.id;

    const trips = await Trip.find()
      .populate("driver", "name _id") // ✅ _id MÅSTE inkluderas
      .populate("passengers", "name");

    const tripsWithStatus = trips.map((trip) => {
      const isJoined = trip.passengers.some(
        (p) => p._id.toString() === userId
      );

      return {
        ...trip.toObject(),
        joined: isJoined,
        passengerCount: trip.passengers.length,
      };
    });

    res.status(200).json(tripsWithStatus);
  } catch (err) {
    console.error("Error fetching trips:", err);
    res.status(500).json({ message: "Could not fetch trips." });
  }
};

// PATCH /trips/:id/join – gå med i en resa
exports.joinTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) return res.status(404).json({ message: "Resa hittades inte." });

    const userId = req.user.id;

    // Förhindra att förare joinar sin egen resa
    if (trip.driver.toString() === userId) {
      return res.status(400).json({ message: "Förare kan inte gå med i sin egen resa." });
    }

    // Redan med?
    const alreadyJoined = trip.passengers.includes(userId);
    if (alreadyJoined) {
      return res.status(400).json({ message: "Redan med i resan." });
    }

    // Fullt?
    if (trip.passengers.length >= trip.capacity) {
      return res.status(400).json({ message: "Resan är full." });
    }

    // Lägg till passagerare
    trip.passengers.push(new mongoose.Types.ObjectId(userId));
    await trip.save();

    res.status(200).json({ success: true, trip });
  } catch (err) {
    console.error("joinTrip error:", err);
    res.status(500).json({ message: "Kunde inte gå med i resan." });
  }
};


// PATCH /trips/:id/unjoin – lämna en resa
exports.unjoinTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: "Trip not found." });

    const userId = req.user.id;

    if (trip.driver.toString() === userId) {
      return res.status(400).json({ message: "Driver can't leave their own trip." });
    }

    const isPassenger = trip.passengers.some(
      (p) => p.toString() === userId
    );
    if (!isPassenger) {
      return res.status(400).json({ message: "You are not a passenger in this trip." });
    }

    trip.passengers = trip.passengers.filter(
      (p) => p.toString() !== userId
    );
    trip.capacity += 1;

   await trip.save();

// hämta trip på nytt med fullständig info
  const updatedTrip = await Trip.findById(trip._id)
    .populate("driver", "name")
    .populate("passengers", "name");

  res.status(200).json({ success: true, trip: updatedTrip });

  } catch (err) {
    console.error("unjoinTrip error:", err);
    res.status(500).json({ message: "Could not leave trip.", error: err.message });
  }
};

// DELETE /trips/:id – Ta bort en resa (endast föraren får)
exports.deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ message: "Resa hittades inte." });
    }

    const userId = req.user.id;

    // ❌ Förhindra att andra än föraren raderar
    if (trip.driver.toString() !== userId) {
      return res.status(403).json({ message: "Endast föraren kan ta bort resan." });
    }

    await trip.deleteOne();

    res.status(200).json({ success: true, message: "Resan togs bort." });
  } catch (err) {
    console.error("❌ deleteTrip error:", err);
    res.status(500).json({ message: "Något gick fel vid borttagning." });
  }
};
