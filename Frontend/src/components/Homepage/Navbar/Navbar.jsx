import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../../context/UserContext";
import "../Homepage.css";

const Navbar = () => {
  const { user, logout } = useContext(UserContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const handleLogout = async () => {
    await logout(); // Call logout function from context
    navigate("/login"); // Redirect to login page after logout
  };

  return (
    <header className="header">
      <div className="logo">
        <h1>Meta Data Sanitization</h1>
      </div>
      <nav className="nav">
        <ul>
          <li>
            <a href="#features">Features</a>
          </li>
          <li>
            <a href="#about">About</a>
          </li>
          <li>
            <a href="#contact">Contact</a>
          </li>
          {user ? (
            <li
              className="profile-wrapper"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <img
                src={user.profilePicture || "/icons/default-profile.png"}
                alt="Profile"
                className="profile-icon"
              />
              {isDropdownOpen && (
                <ul className="dropdown-menu">
                  <li>
                    <Link to="/profile">Profile</Link>
                  </li>
                  <li onClick={handleLogout}>Logout</li>
                </ul>
              )}
            </li>
          ) : (
            <li>
              <Link to="/login" className="login-btn">
                Login
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
