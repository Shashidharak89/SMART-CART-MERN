import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FiStar } from 'react-icons/fi';
import './TestimonialsSection.css';

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    name: 'Aarav Mehta',
    role: 'Tech Enthusiast',
    avatar: 'AM',
    color: '#588157',
    review: 'Ordered a mechanical keyboard — arrived next day, beautifully packaged. SmartCart is on another level!',
    stars: 5,
  },
  {
    name: 'Priya Nair',
    role: 'Fashion Blogger',
    avatar: 'PN',
    color: '#d946ef',
    review: 'The leather daypack is stunning. SmartCoins got me 15% off my next order too. Totally hooked.',
    stars: 5,
  },
  {
    name: 'Rohit Sharma',
    role: 'Home Décor Lover',
    avatar: 'RS',
    color: '#3b82f6',
    review: 'AR try-before-buy is GENIUS. Placed the coffee table virtually in my room before ordering. Loved it.',
    stars: 5,
  },
  {
    name: 'Sneha Kulkarni',
    role: 'Freelance Designer',
    avatar: 'SK',
    color: '#f59e0b',
    review: 'Support team resolved my return in 4 minutes over chat. Refund hit my account the same evening!',
    stars: 5,
  },
  {
    name: 'Karan Bose',
    role: 'Fitness Coach',
    avatar: 'KB',
    color: '#ef4444',
    review: 'Authentic products, great prices, and the express delivery is no joke. My go-to shop now.',
    stars: 5,
  },
  {
    name: 'Divya Reddy',
    role: 'College Student',
    avatar: 'DR',
    color: '#0891b2',
    review: 'Price match guarantee saved me ₹800 on headphones. Literally the best thing ever.',
    stars: 5,
  },
  {
    name: 'Aditya Joshi',
    role: 'Product Manager',
    avatar: 'AJ',
    color: '#10b981',
    review: 'The app UX is so clean and fast. 1-click checkout actually works and I use it every week.',
    stars: 5,
  },
  {
    name: 'Meera Iyer',
    role: 'Interior Stylist',
    avatar: 'MI',
    color: '#8b5cf6',
    review: 'Got a beautiful lamp for my studio — packaged like a gift! SmartCart elevated the whole experience.',
    stars: 5,
  },
];

const TestimonialsSection = () => {
  const sectionRef = useRef(null);
  const headRef = useRef(null);
  const row1Ref = useRef(null);
  const row2Ref = useRef(null);
  const anim1Ref = useRef(null);
  const anim2Ref = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading fade
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

      // Infinite horizontal scroll row 1 → left
      const setupMarquee = (row, ref, direction) => {
        if (!row) return;
        const totalWidth = row.scrollWidth / 2;
        const anim = gsap.to(row, {
          x: direction === 'left' ? -totalWidth : totalWidth,
          duration: direction === 'left' ? 40 : 35,
          ease: 'none',
          repeat: -1,
          modifiers: {
            x: gsap.utils.unitize(x => parseFloat(x) % totalWidth),
          }
        });
        ref.current = anim;

        row.addEventListener('mouseenter', () => anim.timeScale(0.2));
        row.addEventListener('mouseleave', () => anim.timeScale(1));
      };

      setupMarquee(row1Ref.current, anim1Ref, 'left');
      setupMarquee(row2Ref.current, anim2Ref, 'right');

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const renderRow = (items) =>
    [...items, ...items].map((t, i) => (
      <div className="testi-card" key={i}>
        <div className="testi-stars">
          {Array.from({ length: t.stars }).map((_, si) => (
            <FiStar key={si} className="testi-star" />
          ))}
        </div>
        <p className="testi-review">"{t.review}"</p>
        <div className="testi-author">
          <div
            className="testi-avatar"
            style={{ background: t.color + '22', color: t.color }}
          >
            {t.avatar}
          </div>
          <div>
            <p className="testi-name">{t.name}</p>
            <p className="testi-role">{t.role}</p>
          </div>
        </div>
      </div>
    ));

  return (
    <section className="testi-section" ref={sectionRef}>
      <div className="container">
        <div className="testi-head" ref={headRef}>
          <span className="testi-badge">
            <FiStar style={{ marginRight: 6 }} /> Trusted by Thousands
          </span>
          <h2 className="testi-title">
            People Love<br />
            <span className="testi-title-accent">SmartCart.</span>
          </h2>
          <p className="testi-subtitle">
            Real stories from real shoppers across India.
          </p>
        </div>
      </div>

      {/* Row 1 — scrolls left */}
      <div className="testi-track-wrapper">
        <div className="testi-track" ref={row1Ref}>
          {renderRow(testimonials)}
        </div>
      </div>

      {/* Row 2 — scrolls right */}
      <div className="testi-track-wrapper">
        <div className="testi-track" ref={row2Ref}>
          {renderRow([...testimonials].reverse())}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
