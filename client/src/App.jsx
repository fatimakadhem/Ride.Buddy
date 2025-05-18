import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages/components
import HomePage from "./components/HomePage.jsx";
import LoginPage from "./components/LoginPage.jsx";
import RegisterPage from "./components/RegisterPage.jsx";
import CreateTrip from "./components/CreateTrip";
import Trips from "./components/Trips";
import UserProfile from "./components/UserProfile";
import Navbar from "./components/Navbar";

import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        {/* Navigation bar - only shown if user is logged in */}
        <Navbar />

        {/* Page routes */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/create-trip" element={<CreateTrip />} />
          <Route path="/trips" element={<Trips />} />
          <Route path="/profile" element={<UserProfile />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
