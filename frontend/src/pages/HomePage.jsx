import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/Hero';
import TrendingSection from '../components/TrendingSection';
import './HomePage.css';

const HomePage = ({ onAddToCart, onOpenAuth }) => {
  const navigate = useNavigate();
  const trendingRef = useRef(null);

  const handleExploreClick = () => {
    navigate('/products');
  };

  const handleTrendingClick = () => {
    if (trendingRef.current) {
      trendingRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="home-page fade-in">
      {/* Home Screen CTA Banner */}
      <Hero
        onExploreClick={handleExploreClick}
        onTrendingClick={handleTrendingClick}
        onOpenAuth={onOpenAuth}
      />

      {/* Trending Section */}
      <TrendingSection
        onAddToCart={onAddToCart}
        trendingRef={trendingRef}
      />

      {/* Value Proposition Highlights */}
      <section className="features-section">
        <div className="container features-grid">
          <div className="feature-card">
            <div className="feature-icon">🚚</div>
            <h3>Free Express Delivery</h3>
            <p>On all orders over $50 with live tracking updates.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🛡️</div>
            <h3>Guaranteed Authenticity</h3>
            <p>100% verified premium products straight from makers.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔄</div>
            <h3>Hassle-Free Returns</h3>
            <p>30-day money-back guarantee with instant refunds.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
