import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Trips() {
  const [trips, setTrips] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3000/api/trips", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setTrips(data);
      })
      .catch((error) => {
        console.error("Error fetching trips:", error);
        setErrorMessage("Error fetching trips.");
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  const handleJoin = async (tripId) => {
    const response = await fetch(
      `http://localhost:3000/api/trips/${tripId}/join`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
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
      alert("Failed to join the trip.");
    }
  };

  const handleUnjoin = async (tripId) => {
    const response = await fetch(
      `http://localhost:3000/api/trips/${tripId}/unjoin`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();
    if (data.success) {
      alert("Du har lämnat resan.");
      setTrips((prevTrips) =>
        prevTrips.map((trip) =>
          trip._id === tripId ? { ...trip, joined: false } : trip
        )
      );
    } else {
      alert("Kunde inte lämna resan.");
    }
  };

  if (errorMessage) {
    return <div>{errorMessage}</div>;
  }

  const joinedTrips = trips.filter((trip) => trip.joined);

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

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        <button onClick={() => navigate("/create-trip")}>Create Trip</button>
        <button onClick={handleLogout}>Logout</button>
        <button onClick={() => navigate(-1)} style={{ marginBottom: "1rem" }}>
          ⬅️ Back
        </button>
      </div>

      {/* Joined Trips Section */}
      {joinedTrips.length > 0 && (
        <div style={{ marginBottom: "2rem" }}>
          <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>
            My Joined Trips
          </h2>
          <ul style={{ listStyleType: "none", padding: 0 }}>
            {joinedTrips.map((trip) => (
              <li
                key={`joined-${trip._id}`}
                style={{
                  border: "2px solid green",
                  borderRadius: "8px",
                  padding: "1rem",
                  marginBottom: "1rem",
                  backgroundColor: "#eaffea",
                }}
              >
                <p>
                  <strong>{trip.startLocation}</strong> to{" "}
                  <strong>{trip.endLocation}</strong> on{" "}
                  <strong>{trip.tripDate?.slice(0, 10)}</strong>
                </p>
                <p>Capacity: {trip.capacity}</p>
                <p>Driver: {trip.driver?.name || "Unknown"}</p>
                <button
                  style={{
                    backgroundColor: "#ffdddd",
                    border: "1px solid red",
                    color: "red",
                    padding: "0.4rem 1rem",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                  onClick={() => handleUnjoin(trip._id)}
                >
                  ✅ Leave Trip
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* All Trips List */}
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {trips.length === 0 ? (
          <p>No trips available.</p>
        ) : (
          trips.map((trip) => (
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
                <strong>{trip.tripDate?.slice(0, 10)}</strong>
              </p>
              <p>Capacity: {trip.capacity}</p>
              <p>Driver: {trip.driver?.name || "Unknown"}</p>
              {trip.joined ? (
                <button
                  style={{
                    backgroundColor: "#ffdddd",
                    border: "1px solid red",
                    color: "red",
                    padding: "0.4rem 1rem",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                  onClick={() => handleUnjoin(trip._id)}
                >
                  ✅ Leave Trip
                </button>
              ) : (
                <button onClick={() => handleJoin(trip._id)}>Join Trip</button>
              )}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
