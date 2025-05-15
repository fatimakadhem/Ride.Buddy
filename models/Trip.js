const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema({
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Referens till User-modellen (förare)
    required: true,
  },
  passengers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Referens till User-modellen (passagerare)
    },
  ],
  startLocation: {
    type: String,
    required: true,
  },
  endLocation: {
    type: String,
    required: true,
  },
  tripDate: {
    type: Date,
    required: true,
  },
  capacity: {
    type: Number,
    required: true,
  },
});

// Skapa Trip-modellen
const Trip = mongoose.model("Trip", tripSchema);

module.exports = Trip;
