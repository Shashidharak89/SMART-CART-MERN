import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './CategoryShowcase.css';

gsap.registerPlugin(ScrollTrigger);

const categories = [
  {
    label: 'Electronics',
    sublabel: '2,400+ items',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&auto=format&fit=crop&q=80',
    span: 'tall',
  },
  {
    label: 'Fashion',
    sublabel: '5,100+ items',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&auto=format&fit=crop&q=80',
    span: 'normal',
  },
  {
    label: 'Home & Living',
    sublabel: '3,200+ items',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&auto=format&fit=crop&q=80',
    span: 'normal',
  },
  {
    label: 'Wellness',
    sublabel: '1,800+ items',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop&q=80',
    span: 'normal',
  },
  {
    label: 'Sports & Outdoors',
    sublabel: '900+ items',
    image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&auto=format&fit=crop&q=80',
    span: 'normal',
  },
];

// Alternating directions for stagger
const directions = [
  { x: -60, y: 0 },
  { x: 0,   y: -60 },
  { x: 60,  y: 0 },
  { x: 0,   y: 60 },
  { x: -60, y: 0 },
];

const CategoryShowcase = () => {
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const headRef = useRef(null);
  const gridRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading
      gsap.fromTo(headRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
          scrollTrigger: {
            trigger: headRef.current,
            start: 'top 82%',
          }
        }
      );

      // Each category cell from a different direction
      const cells = gridRef.current?.querySelectorAll('.cat-cell');
      cells?.forEach((cell, i) => {
        const dir = directions[i % directions.length];
        gsap.fromTo(cell,
          { opacity: 0, x: dir.x, y: dir.y, scale: 0.88 },
          {
            opacity: 1, x: 0, y: 0, scale: 1,
            duration: 0.9, ease: 'power3.out',
            scrollTrigger: {
              trigger: cell,
              start: 'top 88%',
              toggleActions: 'play none none reverse',
            }
          }
        );

        // Image scale on hover
        const img = cell.querySelector('.cat-img');
        cell.addEventListener('mouseenter', () => {
          gsap.to(img, { scale: 1.08, duration: 0.6, ease: 'power2.out' });
        });
        cell.addEventListener('mouseleave', () => {
          gsap.to(img, { scale: 1, duration: 0.6, ease: 'power2.inOut' });
        });
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleCategoryClick = (categoryLabel) => {
    navigate(`/products?category=${encodeURIComponent(categoryLabel)}`);
  };

  return (
    <section className="cat-section" ref={sectionRef}>
      <div className="container">
        <div className="cat-head" ref={headRef}>
          <span className="cat-badge">Browse by Category</span>
          <h2 className="cat-title">
            Find Your<br />
            <span className="cat-title-accent">Perfect Pick.</span>
          </h2>
        </div>

        <div className="cat-grid" ref={gridRef}>
          {categories.map((c, i) => (
            <div
              key={i}
              className={`cat-cell ${c.span === 'tall' ? 'cat-cell--tall' : ''}`}
              onClick={() => handleCategoryClick(c.label)}
              style={{ cursor: 'pointer' }}
            >
              <img src={c.image} alt={c.label} className="cat-img" />
              <div className="cat-overlay">
                <h3 className="cat-label">{c.label}</h3>
                <p className="cat-sublabel">{c.sublabel}</p>
                <span className="cat-explore-btn">Explore →</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryShowcase;
