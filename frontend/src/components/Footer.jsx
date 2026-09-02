import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer-section">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <a href="#" className="navbar-brand">
              <div className="brand-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
              </div>
              <span className="brand-text">SMART<span className="brand-highlight">CART</span></span>
            </a>
            <p className="footer-desc">
              Your premier destination for high-performance gadgets, luxury fashion accessories, and minimalist home design.
            </p>
          </div>

          <div className="footer-links">
            <div className="link-column">
              <h4>Shop</h4>
              <ul>
                <li><a href="#catalog">Electronics</a></li>
                <li><a href="#catalog">Fashion</a></li>
                <li><a href="#catalog">Home & Living</a></li>
                <li><a href="#catalog">New Arrivals</a></li>
              </ul>
            </div>

            <div className="link-column">
              <h4>Support</h4>
              <ul>
                <li><a href="#">Help Center</a></li>
                <li><a href="#">Shipping & Returns</a></li>
                <li><a href="#">Order Tracking</a></li>
                <li><a href="#">Contact Us</a></li>
              </ul>
            </div>

            <div className="link-column newsletter-col">
              <h4>Stay Connected</h4>
              <p>Subscribe for exclusive product launches and discount alerts.</p>
              <div className="newsletter-form">
                <input type="email" placeholder="Enter email address" className="form-input" />
                <button className="btn btn-primary">Join</button>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 SmartCart Inc. All rights reserved.</p>
          <div className="legal-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookies Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
