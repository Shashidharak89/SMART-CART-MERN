import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  FiZap, FiShield, FiTrendingUp, FiHeadphones,
  FiAward, FiPackage, FiUsers, FiStar
} from 'react-icons/fi';
import './WhyUsSection.css';

gsap.registerPlugin(ScrollTrigger);

const reasons = [
  {
    icon: <FiZap />,
    title: 'Lightning Fast Delivery',
    desc: 'Same-day dispatch on 10,000+ products with real-time GPS tracking at every step.',
    color: '#f59e0b',
  },
  {
    icon: <FiShield />,
    title: '100% Authentic Products',
    desc: 'Every item is verified directly from brands. Zero counterfeits, ever.',
    color: '#588157',
  },
  {
    icon: <FiHeadphones />,
    title: '24/7 Expert Support',
    desc: 'Our dedicated team is always on standby to resolve any issue within minutes.',
    color: '#3b82f6',
  },
  {
    icon: <FiAward />,
    title: 'Loyalty Rewards',
    desc: 'Earn SmartCoins on every purchase and redeem them for exclusive discounts.',
    color: '#d946ef',
  },
];

const stats = [
  { value: 50000, suffix: '+', label: 'Products Listed' },
  { value: 15000, suffix: '+', label: 'Happy Customers' },
  { value: 4.9, suffix: '★', label: 'Average Rating', isDecimal: true },
  { value: 99, suffix: '%', label: 'On-time Delivery' },
];

const WhyUsSection = () => {
  const sectionRef = useRef(null);
  const leftRef = useRef(null);
  const cardsRef = useRef(null);
  const statsRef = useRef([]);
  const lineRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Left content slide in from left
      gsap.fromTo(leftRef.current,
        { opacity: 0, x: -60 },
        {
          opacity: 1, x: 0, duration: 1, ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
          }
        }
      );

      // Line expand animation
      gsap.fromTo(lineRef.current,
        { scaleX: 0, transformOrigin: 'left center' },
        {
          scaleX: 1, duration: 1.2, ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
          }
        }
      );

      // Cards stagger from right
      const cards = cardsRef.current?.children;
      if (cards) {
        gsap.fromTo(cards,
          { opacity: 0, x: 60, scale: 0.92 },
          {
            opacity: 1, x: 0, scale: 1,
            duration: 0.7, stagger: 0.15, ease: 'power3.out',
            scrollTrigger: {
              trigger: cardsRef.current,
              start: 'top 80%',
            }
          }
        );
      }

      // Counter animation
      statsRef.current.forEach((el, i) => {
        if (!el) return;
        const stat = stats[i];
        const numEl = el.querySelector('.why-stat-number');
        if (!numEl) return;

        let obj = { val: 0 };
        gsap.to(obj, {
          val: stat.value,
          duration: 2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            once: true,
          },
          onUpdate: () => {
            numEl.textContent = stat.isDecimal
              ? obj.val.toFixed(1) + stat.suffix
              : Math.round(obj.val).toLocaleString() + stat.suffix;
          }
        });
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="whyus-section" ref={sectionRef}>
      <div className="container">
        {/* Top Stats Row */}
        <div className="whyus-stats-row">
          {stats.map((s, i) => (
            <div
              className="whyus-stat-item"
              key={i}
              ref={el => statsRef.current[i] = el}
            >
              <span className="why-stat-number">
                {s.isDecimal ? `0.0${s.suffix}` : `0${s.suffix}`}
              </span>
              <span className="why-stat-label">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Main 2-col content */}
        <div className="whyus-main">
          {/* Left */}
          <div className="whyus-left" ref={leftRef}>
            <span className="whyus-badge">
              <FiUsers style={{ marginRight: 6 }} /> Why SmartCart?
            </span>
            <h2 className="whyus-title">
              Shopping,<br />
              <span className="whyus-accent">Reimagined</span><br />
              for You.
            </h2>
            <div className="whyus-line" ref={lineRef} />
            <p className="whyus-desc">
              We don't just sell products — we craft experiences. Every order, every interaction, every pixel of SmartCart is built around making your life better.
            </p>
            <div className="whyus-trust-badges">
              <div className="trust-badge"><FiPackage /> Eco Packaging</div>
              <div className="trust-badge"><FiStar /> Premium Quality</div>
              <div className="trust-badge"><FiShield /> Secure Payments</div>
            </div>
          </div>

          {/* Right — Reason Cards */}
          <div className="whyus-cards" ref={cardsRef}>
            {reasons.map((r, i) => (
              <div className="whyus-card" key={i}>
                <div className="whyus-card-icon" style={{ color: r.color, background: r.color + '18' }}>
                  {r.icon}
                </div>
                <div>
                  <h4 className="whyus-card-title">{r.title}</h4>
                  <p className="whyus-card-desc">{r.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyUsSection;
