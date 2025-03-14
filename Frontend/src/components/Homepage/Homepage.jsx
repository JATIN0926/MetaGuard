import React from 'react';
import './Homepage.css';
import { Link } from 'react-router-dom';

const Homepage = () => {
  return (
    <div className="homepage-container">
      <header className="header">
        <div className="logo">
          <h1>Meta Data Sanitization</h1>
        </div>
        <nav className="nav">
          <ul>
            <li><a href="#features">Features</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li>
            <li><a href="/login" className="login-btn">Login</a></li>
          </ul>
        </nav>
      </header>

      <section className="hero-section">
        <div className="hero-content">
          <h1>Secure Your Metadata</h1>
          <p>Advanced solutions for metadata cleaning, organization, and protection</p>
         <Link to={`/fileupload`}> <button className="cta-button">Sanitize your data</button></Link>
        </div>
      </section>

      <section className="features-section" id="features">
        <h2>Key Benefits</h2>
        <div className="cards-container">
          <div className="feature-card secure-card">
            <div className="card-content">
              <h3>Secure</h3>
              <p>Enterprise-grade encryption and protection for your sensitive metadata</p>
            </div>
          </div>
          
          <div className="feature-card fast-card">
            <div className="card-content">
              <h3>Fast</h3>
              <p>High-performance processing optimized for large-scale metadata operations</p>
            </div>
          </div>
          
          <div className="feature-card private-card">
            <div className="card-content">
              <h3>Private</h3>
              <p>Complete control over your data with advanced privacy-preserving techniques</p>
            </div>
          </div>
        </div>
        </section>

      <section className="description-section" id="about">
        <h2>About Our Service</h2>
        <div className="description-content">
          <p>
            <strong>Meta Data Sanitization</strong> is the process of cleaning, organizing, and securing metadata to ensure accuracy, consistency, and privacy. It involves removing redundant, outdated, or sensitive information from metadata, making it more reliable and easier to manage. This process helps in improving data quality, ensuring compliance with data protection regulations, and reducing risks associated with data breaches.
          </p>
          <p>
            Meta Data Sanitization is crucial for businesses that handle large volumes of data, as it enhances data usability and supports better decision-making. It is commonly used in industries like healthcare, finance, and retail to maintain data integrity and protect sensitive information. By sanitizing metadata, organizations can streamline data workflows, improve data governance, and enhance overall data security.
          </p>
        </div>
      </section>

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
    </div>
  );
};

export default Homepage;