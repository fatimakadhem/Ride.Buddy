import React from "react";
import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Welcome to</h1>

      <img
        src="/ridebuddy.png" 
        alt="RideBuddy logo"
        style={styles.image}
      />

      <p style={styles.subtext}>Choose an option to get started:</p>

      <div style={styles.buttonContainer}>
        <Link to="/login">
          <button style={styles.button}>Login</button>
        </Link>
        <Link to="/register">
          <button style={styles.button}>Register</button>
        </Link>
      </div>
    </div>
  );
}

const styles = {
  container: {
    textAlign: "center",
    padding: "2rem",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f9f9f9",
    minHeight: "100vh",
  },
  heading: {
    fontSize: "2.5rem",
    marginBottom: "1rem",
  },
  subtext: {
    fontSize: "1.2rem",
    marginBottom: "2rem",
  },
  image: {
    maxWidth: "300px",
    marginBottom: "2rem",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "1rem",
  },
  button: {
    padding: "0.7rem 1.5rem",
    fontSize: "1rem",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default HomePage;
