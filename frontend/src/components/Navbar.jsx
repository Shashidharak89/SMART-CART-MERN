import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logoImg from '../assets/SmartCart-logo.png';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Navbar.css';

gsap.registerPlugin(ScrollTrigger);

// IDs of sections that have a dark background
const DARK_SECTION_IDS = [
  'section-stats-banner',
  'section-app-speciality',
  'section-newsletter',
];

const Navbar = ({ cartCount, onOpenCart, onOpenAuth, onOpenSidebar, searchQuery, setSearchQuery }) => {
  const { user } = useAuth();
  const headerRef = useRef(null);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const triggers = [];

    DARK_SECTION_IDS.forEach(id => {
      const section = document.getElementById(id);
      if (!section) return;

      const st = ScrollTrigger.create({
        trigger: section,
        start: 'top top',      // section top hits the very top of viewport (= bottom of fixed navbar)
        end: 'bottom top',     // section bottom clears the navbar
        onEnter: () => header.classList.add('navbar--dark'),
        onLeave: () => header.classList.remove('navbar--dark'),
        onEnterBack: () => header.classList.add('navbar--dark'),
        onLeaveBack: () => header.classList.remove('navbar--dark'),
      });

      triggers.push(st);
    });

    return () => triggers.forEach(t => t.kill());
  }, []);

  return (
    <header className="navbar-header" ref={headerRef}>
      <div className="container navbar-container">
        {/* Brand Logo */}
        <Link to="/" className="navbar-brand">
          <img src={logoImg} alt="SmartCart Logo" className="navbar-logo-img" />
          <span className="brand-text">SMART<span className="brand-highlight">CART</span></span>
        </Link>

        {/* Search Bar */}
        <div className="navbar-search">
          <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            placeholder="Search premium products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          {searchQuery && (
            <button className="clear-search" onClick={() => setSearchQuery('')}>×</button>
          )}
        </div>

        {/* Right Actions */}
        <div className="navbar-actions">
          {/* Explore Link */}
          <Link to="/products" className="nav-page-link">
            Explore
          </Link>

          {/* Cart Icon Button */}
          <button className="cart-btn" onClick={onOpenCart} title="View Shopping Cart">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>

          {/* Profile Avatar / Menu Icon triggers Sidebar */}
          {user ? (
            <button className="user-avatar-btn" onClick={onOpenSidebar} title="Open Navigation Menu">
              <div className="avatar-circle">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <span className="user-name-display">{user.name.split(' ')[0]}</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
          ) : (
            <div className="nav-guest-group">
              <button className="btn btn-primary nav-auth-btn" onClick={() => onOpenAuth('login')}>
                Sign In
              </button>
              <button className="sidebar-trigger-btn" onClick={onOpenSidebar} title="Open Menu">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
