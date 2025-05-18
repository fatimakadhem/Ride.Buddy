import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch trips");
        }

        if (!Array.isArray(data)) {
          throw new Error("Trips data is not a valid array");
        }

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
    } catch (err) {
      return null;
    }
  };

  const userId = getUserIdFromToken();

  const handleJoin = async (tripId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/trips/${tripId}/join`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

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
      const response = await fetch(
        `http://localhost:3000/api/trips/${tripId}/unjoin`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

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
      console.log("DELETE response:", data);

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
    <div
      style={{
        maxWidth: "700px",
        margin: "0 auto",
        padding: "2rem",
        fontFamily: "Arial",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "1.5rem" }}>All Trips</h1>

      {errorMessage && (
        <div style={{ color: "red", textAlign: "center" }}>{errorMessage}</div>
      )}

      {/* ✅ Buttons */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        <button onClick={() => navigate("/create-trip")}>Create Trip</button>
        <button onClick={() => navigate(-1)}>⬅️ Back</button>
      </div>

      {/* ✅ Trip List */}
      <ul style={{ listStyleType: "none", padding: 0 }}>
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
              <li
                key={trip._id}
                style={{
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  padding: "1rem",
                  marginBottom: "1rem",
                  backgroundColor: "#f9f9f9",
                }}
              >
                <p>
                  <strong>{trip.startLocation}</strong> to{" "}
                  <strong>{trip.endLocation}</strong> on{" "}
                  <strong>{tripDate.toLocaleDateString()}</strong>
                </p>
                <p>Capacity left: {capacityLeft}</p>
                <p>Passengers joined: {trip.passengers?.length || 0}</p>
                <p>Driver: {trip.driver?.name || "Unknown"}</p>

                {isDriver && <p>🚐 <strong style={{ color: "blue" }}>You are the driver</strong></p>}

                {isDriver ? (
                  <button
                    onClick={() => handleDelete(trip._id)}
                    style={{
                      backgroundColor: "red",
                      color: "white",
                      padding: "0.5rem 1rem",
                      marginTop: "0.5rem",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    🗑️ Delete Trip
                  </button>
                ) : trip.joined ? (
                  <button
                    onClick={() => handleUnjoin(trip._id)}
                    style={{
                      backgroundColor: "#ffe5e5",
                      color: "#d00",
                      fontWeight: "bold",
                    }}
                  >
                    Leave Trip
                  </button>
                ) : tripDate < today ? (
                  <p style={{ color: "gray", fontStyle: "italic" }}>
                    ❌ Trip has expired
                  </p>
                ) : noSeats ? (
                  <p style={{ color: "red", fontWeight: "bold" }}>
                    🚫 No seats available
                  </p>
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
