import React, { useEffect, useState } from "react";
import BASE_URL from "../config"; // se till att sökvägen är rätt beroende på var du är

const UserProfile = () => {
  const [createdTrips, setCreatedTrips] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [previous, setPrevious] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
const res = await fetch(`${BASE_URL}/api/user/history`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();

        // Spara sektioner
        setCreatedTrips(data.createdTrips || []);
        setUpcoming(data.upcoming || []);
        setPrevious(data.previous || []);
      } catch (err) {
        console.error("Error loading trips:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem" }}>
   

      {loading ? (
        <p>Loading your trips...</p>
      ) : (
        <>
          {/* Created Trips */}
          <section style={{ marginTop: "2rem" }}>
            <h2>My Created Trips</h2>
            {createdTrips.length === 0 ? (
              <p>You haven’t created any trips.</p>
            ) : (
              createdTrips.map((trip) => (
                <TripCard key={trip._id} trip={trip} />
              ))
            )}
          </section>

          {/* Upcoming Trips */}
          <section style={{ marginTop: "2rem" }}>
            <h2>Upcoming Trips</h2>
            {upcoming.length === 0 ? (
              <p>You have no upcoming trips.</p>
            ) : (
              upcoming.map((trip) => (
                <TripCard key={trip._id} trip={trip} />
              ))
            )}
          </section>

          {/* Previous Trips */}
          <section style={{ marginTop: "2rem" }}>
            <h2>Previous Trips</h2>
            {previous.length === 0 ? (
              <p>You have no previous trips.</p>
            ) : (
              previous.map((trip) => (
                <TripCard key={trip._id} trip={trip} />
              ))
            )}
          </section>
        </>
      )}
    </div>
  );
};

const TripCard = ({ trip }) => (
  <div
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
      <strong>{new Date(trip.tripDate).toLocaleDateString()}</strong>
    </p>
    <p>Capacity: {trip.capacity}</p>
    <p>Driver: {trip.driver?.name || "Unknown"}</p>
    <p>Passengers joined: {trip.passengers?.length || 0}</p>
  </div>
);

export default UserProfile;
