import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage.jsx";
import LoginPage from "./components/LoginPage.jsx";
import RegisterPage from "./components/RegisterPage.jsx";
import CreateTrip from "./components/CreateTrip";
import Trips from "./components/Trips";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Main Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Trips Routes */}
          <Route path="/create-trip" element={<CreateTrip />} />
          <Route path="/trips" element={<Trips />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
