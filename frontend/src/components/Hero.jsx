import React from 'react';
import { useAuth } from '../context/AuthContext';
import './Hero.css';

const Hero = ({ onExploreClick, onOpenAuth }) => {
  const { user } = useAuth();

  return (
    <section className="hero-section">
      <div className="container hero-container">
        {/* Left Text Content */}
        <div className="hero-content fade-in">
          <div className="badge badge-brand hero-badge">
            <span className="badge-pulse"></span> Summer Collection 2026
          </div>
          <h1 className="hero-title">
            Discover Next-Gen <br />
            <span className="text-gradient">Innovations</span> for Living.
          </h1>
          <p className="hero-description">
            Experience curated tech essentials, premium fashion, and modern home accessories with express delivery and guaranteed satisfaction.
          </p>

          <div className="hero-cta">
            <button className="btn btn-primary hero-btn" onClick={onExploreClick}>
              Explore Collection
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
            {!user && (
              <button className="btn btn-secondary hero-btn" onClick={() => onOpenAuth('register')}>
                Create Account
              </button>
            )}
          </div>

          {/* Stats Bar */}
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">15K+</span>
              <span className="stat-label">Happy Clients</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">4.9★</span>
              <span className="stat-label">User Rating</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">24/7</span>
              <span className="stat-label">Instant Support</span>
            </div>
          </div>
        </div>

        {/* Right Visual Graphic */}
        <div className="hero-visual fade-in">
          <div className="visual-card-wrapper">
            <img
              src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80"
              alt="Featured Hero Product"
              className="hero-image"
            />
            <div className="floating-card floating-top-left">
              <div className="floating-icon">⚡</div>
              <div>
                <p className="floating-title">Top Choice</p>
                <p className="floating-subtitle">Aura Headphones</p>
              </div>
            </div>
            <div className="floating-card floating-bottom-right">
              <div className="floating-icon">🔥</div>
              <div>
                <p className="floating-title">Save Up To</p>
                <p className="floating-subtitle">30% OFF Today</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
