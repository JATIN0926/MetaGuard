import React from "react";
import { Link } from "react-router-dom";
import "../Homepage.css";

const Navbar = () => {
  return (
    <header className="header">
      <div className="logo">
        <h1>Meta Data Sanitization</h1>
      </div>
      <nav className="nav">
        <ul>
          <li><a href="#features">Features</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#contact">Contact</a></li>
          <li><Link to="/login" className="login-btn">Login</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
