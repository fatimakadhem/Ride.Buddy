import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // To navigate after login

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // To handle error messages
  const navigate = useNavigate(); // To navigate to another page after login

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the page from reloading

    const userData = { email, password };

    try {
const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (data.token) {
        // If login is successful and a token is returned
        localStorage.setItem("token", data.token); // Store the token in localStorage

        alert("Login successful!");
        // Navigate to the /trips page after successful login
        navigate("/trips");
      } else {
        setErrorMessage("Login failed: " + data.message); // Show error message if login fails
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("Error during login.");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
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

        <button type="submit">Login</button>
      </form>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}{" "}
      {/* Show error message if any */}
      <p>
        Don't have an account? <a href="/register">Register here</a>
      </p>
    </div>
  );
}

export default LoginPage;
