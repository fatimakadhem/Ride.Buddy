import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css"; // så du får med .page-content m.m.

export default function Trips() {
  const [trips, setTrips] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/trips", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (!response.ok) throw new Error(data.message || "Failed to fetch trips");
        if (!Array.isArray(data)) throw new Error("Trips data is not a valid array");

        setTrips(data);
      } catch (error) {
        console.error("Error fetching trips:", error.message);
        setErrorMessage(error.message);
      }
    };

    fetchTrips();
  }, []);

  const getUserIdFromToken = () => {
    try {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      return decoded.id;
    } catch {
      return null;
    }
  };

  const userId = getUserIdFromToken();

  const handleJoin = async (tripId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/trips/${tripId}/join`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (data.success) {
        alert("Successfully joined the trip!");
        setTrips((prevTrips) =>
          prevTrips.map((trip) =>
            trip._id === tripId ? { ...trip, joined: true } : trip
          )
        );
      } else {
        alert(data.message || "Failed to join the trip.");
      }
    } catch (error) {
      console.error("Join trip error:", error);
      alert("An error occurred while joining the trip.");
    }
  };

  const handleUnjoin = async (tripId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/trips/${tripId}/unjoin`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (data.success) {
        alert("You left the trip.");
        setTrips((prevTrips) =>
          prevTrips.map((trip) =>
            trip._id === tripId ? { ...trip, joined: false } : trip
          )
        );
      } else {
        alert(data.message || "Failed to unjoin the trip.");
      }
    } catch (error) {
      console.error("Unjoin trip error:", error);
      alert("An error occurred while leaving the trip.");
    }
  };

  const handleDelete = async (tripId) => {
    if (!window.confirm("Are you sure you want to delete this trip?")) return;

    try {
      const res = await fetch(`http://localhost:3000/api/trips/${tripId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok && data.success) {
        alert("Trip deleted successfully.");
        setTrips((prev) => prev.filter((trip) => trip._id !== tripId));
      } else {
        alert(data.message || "Failed to delete trip.");
      }
    } catch (err) {
      console.error("Delete trip error:", err);
      alert("An error occurred.");
    }
  };

  return (
    <div className="page-content">
      <h1 className="page-title">All Trips</h1>

      {errorMessage && (
        <div className="error-message">{errorMessage}</div>
      )}

      <div className="trip-controls">
        <button onClick={() => navigate("/create-trip")}>Create Trip</button>
        <button onClick={() => navigate(-1)}>⬅️ Back</button>
      </div>

      <ul className="trip-list">
        {trips.length === 0 ? (
          <p>No trips available.</p>
        ) : (
          trips.map((trip) => {
            const tripDate = new Date(trip.tripDate);
            const today = new Date();
            const isDriver = trip.driver?._id === userId;
            const capacityLeft = trip.capacity - trip.passengers.length;
            const noSeats = capacityLeft <= 0;

            return (
              <li key={trip._id} className="trip-card">
                <p>
                  <strong>{trip.startLocation}</strong> to{" "}
                  <strong>{trip.endLocation}</strong> on{" "}
                  <strong>{tripDate.toLocaleDateString()}</strong>
                </p>
                <p>Capacity left: {capacityLeft}</p>
                <p>Passengers joined: {trip.passengers?.length || 0}</p>
                <p>Driver: {trip.driver?.name || "Unknown"}</p>

                {isDriver && (
                  <p>🚐 <strong style={{ color: "blue" }}>You are the driver</strong></p>
                )}

                {isDriver ? (
                  <button className="delete-btn" onClick={() => handleDelete(trip._id)}>
                    🗑️ Delete Trip
                  </button>
                ) : trip.joined ? (
                  <button className="leave-btn" onClick={() => handleUnjoin(trip._id)}>
                    Leave Trip
                  </button>
                ) : tripDate < today ? (
                  <p className="expired">❌ Trip has expired</p>
                ) : noSeats ? (
                  <p className="no-seats">🚫 No seats available</p>
                ) : (
                  <button onClick={() => handleJoin(trip._id)}>Join Trip</button>
                )}
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}
