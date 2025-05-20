import BASE_URL from "../config"; // lägg detta högst upp
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateTrip() {
  const [startLocation, setStartLocation] = useState("");
  const [endLocation, setEndLocation] = useState("");
  const [tripDate, setTripDate] = useState("");
  const [capacity, setCapacity] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!startLocation || !endLocation || !tripDate || !capacity) {
      setErrorMessage("Please fill out all the fields.");
      return;
    }

    const tripData = {
      startLocation,
      endLocation,
      tripDate,
      capacity,
    };

    try {
      const response = await fetch(`${BASE_URL}/api/trips`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
  body: JSON.stringify(tripData),
});

      const result = await response.json();
      if (response.ok) {
        alert("Trip created successfully!");
        navigate("/trips");
      } else {
        setErrorMessage(result.message || "Failed to create trip.");
      }
    } catch (error) {
      console.error("Error creating trip:", error);
      setErrorMessage("Error creating trip.");
    }
  };

  return (
    <div
      style={{
        maxWidth: "500px",
        margin: "0 auto",
        padding: "2rem",
        fontFamily: "Arial",
      }}
    >
      <button onClick={() => navigate(-1)} style={{ marginBottom: "1rem" }}>
        ⬅️ Back
      </button>

      <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        Create a New Trip
      </h2>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        <label>
          Start Location:
          <input
            type="text"
            value={startLocation}
            onChange={(e) => setStartLocation(e.target.value)}
            required
            style={{ width: "100%", padding: "0.5rem", marginTop: "0.3rem" }}
          />
        </label>

        <label>
          End Location:
          <input
            type="text"
            value={endLocation}
            onChange={(e) => setEndLocation(e.target.value)}
            required
            style={{ width: "100%", padding: "0.5rem", marginTop: "0.3rem" }}
          />
        </label>

        <label>
          Trip Date:
          <input
            type="date"
            value={tripDate}
            onChange={(e) => setTripDate(e.target.value)}
            required
            style={{ width: "100%", padding: "0.5rem", marginTop: "0.3rem" }}
          />
        </label>

        <label>
          Capacity:
          <input
            type="number"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            required
            style={{ width: "100%", padding: "0.5rem", marginTop: "0.3rem" }}
          />
        </label>

        <button
          type="submit"
          style={{
            padding: "0.7rem",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Create Trip
        </button>
      </form>
    </div>
  );
}
