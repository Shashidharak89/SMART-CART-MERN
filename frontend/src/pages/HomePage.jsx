import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/Hero';
import TrendingSection from '../components/TrendingSection';
import WhyUsSection from '../components/WhyUsSection';
import AppSpecialitySection from '../components/AppSpecialitySection';
import ServicesSection from '../components/ServicesSection';
import TestimonialsSection from '../components/TestimonialsSection';
import StatsBannerSection from '../components/StatsBannerSection';
import CategoryShowcase from '../components/CategoryShowcase';
import NewsletterCTA from '../components/NewsletterCTA';
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
      {/* 1 ─ Hero Banner */}
      <Hero
        onExploreClick={handleExploreClick}
        onTrendingClick={handleTrendingClick}
        onOpenAuth={onOpenAuth}
      />

      {/* 2 ─ Trending Products */}
      <TrendingSection
        onAddToCart={onAddToCart}
        trendingRef={trendingRef}
      />

      {/* 3 ─ Stats Banner (dark full-width) */}
      <StatsBannerSection />

      {/* 4 ─ Why Choose Us */}
      <WhyUsSection />

      {/* 5 ─ App Speciality Bento Grid (dark) */}
      <AppSpecialitySection />

      {/* 6 ─ Services */}
      <ServicesSection />

      {/* 7 ─ Category Showcase Mosaic */}
      <CategoryShowcase />

      {/* 8 ─ Testimonials Infinite Marquee */}
      <TestimonialsSection />

      {/* 9 ─ Newsletter CTA (dark) */}
      <NewsletterCTA />
    </div>
  );
};

export default HomePage;
