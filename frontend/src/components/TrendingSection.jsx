import React, { useEffect, useRef } from 'react';
import { FaFire } from 'react-icons/fa';
import ProductCard from './ProductCard';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './TrendingSection.css';

gsap.registerPlugin(ScrollTrigger);

const TrendingSection = ({ onAddToCart, trendingRef }) => {
  const sectionRef = useRef(null);
  const cardsRef = useRef(null);

  const trendingProducts = [
    {
      id: '1',
      name: 'Aura Wireless Noise-Canceling Headphones',
      category: 'Electronics',
      price: 2499,
      originalPrice: 2999,
      rating: 4.8,
      reviewsCount: 128,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
      description: 'Immersive sound experience with active noise cancellation.',
      tag: 'Best Seller',
      inStock: true,
    },
    {
      id: '3',
      name: 'Minimalist Leather Daypack',
      category: 'Fashion',
      price: 1199,
      originalPrice: 1499,
      rating: 4.9,
      reviewsCount: 210,
      image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&auto=format&fit=crop&q=80',
      description: 'Handcrafted full-grain leather backpack.',
      tag: 'Trending',
      inStock: true,
    },
    {
      id: '6',
      name: 'Zenith Ergonomic Mechanical Keyboard',
      category: 'Electronics',
      price: 1599,
      originalPrice: 1899,
      rating: 4.8,
      reviewsCount: 142,
      image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80',
      description: 'Custom hot-swappable RGB keyboard with tactile switches.',
      tag: 'Featured',
      inStock: true,
    },
  ];

  useEffect(() => {
    if (cardsRef.current) {
      const cards = cardsRef.current.children;
      gsap.fromTo(
        cards,
        { opacity: 0, y: 50, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }
  }, []);

  return (
    <section className="trending-section" ref={(el) => { sectionRef.current = el; if (trendingRef) trendingRef.current = el; }} id="trending">
      <div className="container">
        <div className="trending-header">
          <span className="badge badge-brand"><FaFire style={{ marginRight: '4px' }} /> Hot This Week</span>
          <h2 className="trending-title">Trending Products</h2>
          <p className="trending-subtitle">Handpicked top performers loved by thousands of shoppers.</p>
        </div>

        <div className="trending-grid" ref={cardsRef}>
          {trendingProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingSection;
