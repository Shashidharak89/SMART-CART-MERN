import React from 'react';
import { Link } from 'react-router-dom';
import logoImg from '../assets/SmartCart-logo.png';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer-section">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <Link to="/" className="navbar-brand">
              <img src={logoImg} alt="SmartCart Logo" className="navbar-logo-img" />
              <span className="brand-text">SMART<span className="brand-highlight">CART</span></span>
            </Link>
            <p className="footer-desc">
              Your premier destination for high-performance gadgets, luxury fashion accessories, and minimalist home design.
            </p>
          </div>

          <div className="footer-links">
            <div className="link-column">
              <h4>Shop</h4>
              <ul>
                <li><Link to="/products?category=Electronics">Electronics</Link></li>
                <li><Link to="/products?category=Fashion">Fashion</Link></li>
                <li><Link to="/products?category=Home%20%26%20Living">Home & Living</Link></li>
                <li><Link to="/products">New Arrivals</Link></li>
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
