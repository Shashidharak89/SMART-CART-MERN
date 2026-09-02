import React, { useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import gsap from 'gsap';
import './Hero.css';

const Hero = ({ onExploreClick, onTrendingClick, onOpenAuth }) => {
  const { user } = useAuth();
  const heroRef = useRef(null);
  const badgeRef = useRef(null);
  const titleRef = useRef(null);
  const descRef = useRef(null);
  const ctaRef = useRef(null);
  const statsRef = useRef(null);
  const visualRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(badgeRef.current, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.6 })
        .fromTo(titleRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8 }, '-=0.3')
        .fromTo(descRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.4')
        .fromTo(ctaRef.current?.children || [], { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.5, stagger: 0.15 }, '-=0.3')
        .fromTo(statsRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.3')
        .fromTo(visualRef.current, { opacity: 0, x: 40, scale: 0.95 }, { opacity: 1, x: 0, scale: 1, duration: 1 }, '-=0.8');
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="hero-section" ref={heroRef}>
      <div className="container hero-container">
        {/* Home Screen CTA Text Content */}
        <div className="hero-content">
          <div className="badge badge-brand hero-badge" ref={badgeRef}>
            <span className="badge-pulse"></span> Exclusive Deals 2026
          </div>
          <h1 className="hero-title" ref={titleRef}>
            Elevate Your Lifestyle with <br />
            <span className="text-gradient">Premium Essentials</span>.
          </h1>
          <p className="hero-description" ref={descRef}>
            Discover handcrafted quality, tech innovations, and luxury accessories curated for modern living. Explore products below or shop trending picks.
          </p>

          {/* CTA Buttons */}
          <div className="hero-cta" ref={ctaRef}>
            <button className="btn btn-primary hero-btn" onClick={onExploreClick}>
              Explore Products
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>

            <button className="btn btn-secondary hero-btn" onClick={onTrendingClick}>
              🔥 Trending Items
            </button>

            {!user && (
              <button className="btn btn-secondary hero-btn" onClick={() => onOpenAuth('register')}>
                Sign Up
              </button>
            )}
          </div>

          {/* Stats Bar */}
          <div className="hero-stats" ref={statsRef}>
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

        {/* Right Visual Banner */}
        <div className="hero-visual" ref={visualRef}>
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
              <div className="floating-icon">🎁</div>
              <div>
                <p className="floating-title">Free Express</p>
                <p className="floating-subtitle">Shipping Available</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
