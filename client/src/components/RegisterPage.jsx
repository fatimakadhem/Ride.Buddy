
import BASE_URL from "../config"; // justera vägen om filen ligger i annan mapp

import React, { useState } from "react";
import { Link } from "react-router-dom"; // Använd React Router för att länka mellan sidorna

function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // För att hantera felmeddelanden

  const handleSubmit = async (e) => {
    e.preventDefault(); // Förhindrar att sidan laddas om

    const userData = { name, email, password };

    try {
const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (data.token) {
        alert("Registration successful!");
        // Här kan du navigera till login-sidan om du vill
      } else {
        setErrorMessage("Registration failed: " + data.message); // Visa felmeddelande om registrering misslyckas
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("Error during registration.");
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <br />
        <br />

        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <br />
        <br />

        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <br />
        <br />

        <button type="submit">Register</button>
      </form>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}{" "}
      {/* Visa felmeddelanden om det finns något */}
      <p>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
}

export default RegisterPage;
