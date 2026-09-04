import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logoImg from '../assets/SmartCart-logo.png';
import { API_BASE_URL } from '../config/api';
import './Footer.css';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email || loading) return;

    setLoading(true);
    setStatusMsg('');

    try {
      const res = await fetch(`${API_BASE_URL}/api/subscribers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setIsSuccess(true);
        setStatusMsg(data.message || 'Successfully subscribed!');
        setEmail('');
      } else {
        setIsSuccess(false);
        setStatusMsg(data.message || 'Subscription failed');
      }
    } catch (err) {
      console.error('Footer subscription error:', err);
      setIsSuccess(false);
      setStatusMsg('Failed to subscribe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
              <form className="newsletter-form" onSubmit={handleSubscribe}>
                <input
                  type="email"
                  placeholder="Enter email address"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? '...' : 'Join'}
                </button>
              </form>
              {statusMsg && (
                <p className="newsletter-feedback" style={{ color: isSuccess ? '#4cd964' : '#ff6b6b', fontSize: '0.85rem', marginTop: '6px' }}>
                  {statusMsg}
                </p>
              )}
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
