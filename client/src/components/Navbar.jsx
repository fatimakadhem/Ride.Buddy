import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");

  // List of paths where navbar should be hidden
  const hideNavbarOn = ["/", "/login", "/register"];

  // ❌ Don't render Navbar on these pages
  if (!token || hideNavbarOn.includes(location.pathname)) {
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/profile" className="nav-link">My Profile</Link>
      <Link to="/trips" className="nav-link">View Trips</Link>
      <button onClick={handleLogout} className="nav-button">Logout</button>
    </nav>
  );
}

export default Navbar;
