import React from "react";
import "../Homepage.css";

const Footer = () => {
  return (
    <footer className="footer" id="contact">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Contact Us</h3>
          <p>Email: info@metadatasanitization.com</p>
          <p>Phone: +1 (555) 123-4567</p>
        </div>
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="#features">Features</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#privacy">Privacy Policy</a></li>
            <li><a href="#terms">Terms of Service</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Subscribe</h3>
          <div className="subscribe-form">
            <input type="email" placeholder="Your email address" />
            <button>Subscribe</button>
          </div>
        </div>
      </div>
      <div className="copyright">
        <p>&copy; 2025 Meta Data Sanitization. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
