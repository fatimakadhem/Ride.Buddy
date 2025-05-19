import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../App.css"; // Eller separat CSS om du har det

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");

  const hideNavbarOn = ["/", "/login", "/register"];
  if (!token || hideNavbarOn.includes(location.pathname)) {
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="top-navbar">
      <Link to="/profile" className="nav-link">My Profile</Link>
      <Link to="/trips" className="nav-link">View Trips</Link>
      <button onClick={handleLogout} className="logout-btn">Logout</button>
    </nav>
  );
}

export default Navbar;

