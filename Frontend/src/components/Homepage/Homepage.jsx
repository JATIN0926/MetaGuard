import React from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar/Navbar";
import Footer from "./Footer/Footer";
import "./Homepage.css";

const Homepage = () => {
  return (
    <div className="homepage-container">
      <Navbar />

      <section className="hero-section">
        <div className="hero-content">
          <h1>Secure Your Metadata</h1>
          <p>Advanced solutions for metadata cleaning, organization, and protection</p>
          <Link to="/fileupload">
            <button className="cta-button">Sanitize your data</button>
          </Link>
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
            <strong>Meta Data Sanitization</strong> is the process of cleaning, organizing, and securing metadata to ensure accuracy, consistency, and privacy.
          </p>
          <p>
            It involves removing redundant, outdated, or sensitive information from metadata, making it more reliable and easier to manage. This process helps in improving data quality, ensuring compliance with data protection regulations, and reducing risks associated with data breaches.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Homepage;
