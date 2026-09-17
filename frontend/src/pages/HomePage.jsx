import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
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

gsap.registerPlugin(ScrollTrigger);

const HomePage = ({ onAddToCart, onOpenAuth }) => {
  const navigate = useNavigate();
  const trendingRef = useRef(null);
  const lenisRef = useRef(null);

  useEffect(() => {
    // Initialize Lenis smooth scroll specifically for Home Screen
    const lenis = new Lenis({
      duration: 1.8, // Slower, silky smooth inertia scroll
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.85, // Slower, weighted wheel scroll for premium feel
      touchMultiplier: 1.5,
    });

    lenisRef.current = lenis;

    // Synchronize Lenis scroll with GSAP ScrollTrigger updates
    lenis.on('scroll', ScrollTrigger.update);

    // Sync GSAP's ticker with Lenis requestAnimationFrame
    const updateGsapTicker = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateGsapTicker);
    gsap.ticker.lagSmoothing(0);

    // Refresh ScrollTrigger calculations after layout mount
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);

    // Clean up smooth scroll when navigating away from Home Page
    return () => {
      clearTimeout(timer);
      gsap.ticker.remove(updateGsapTicker);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const handleExploreClick = () => {
    navigate('/products');
  };

  const handleTrendingClick = () => {
    if (lenisRef.current && trendingRef.current) {
      lenisRef.current.scrollTo(trendingRef.current, { offset: -60, duration: 1.5 });
    } else if (trendingRef.current) {
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
        onOpenAuth={onOpenAuth}
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
