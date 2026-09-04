import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FiPackage, FiUsers, FiStar, FiClock } from 'react-icons/fi';
import './StatsBannerSection.css';

gsap.registerPlugin(ScrollTrigger);

const bannerStats = [
  { icon: <FiPackage />, value: 50000, suffix: '+', label: 'Products', sublabel: 'Across all categories' },
  { icon: <FiUsers />,   value: 15000, suffix: '+', label: 'Customers', sublabel: 'Active monthly shoppers' },
  { icon: <FiStar />,    value: 4.9,   suffix: '★', label: 'Rating',    sublabel: 'Verified reviews', isDecimal: true },
  { icon: <FiClock />,   value: 99,    suffix: '%', label: 'Uptime',    sublabel: 'Platform reliability' },
];

const StatsBannerSection = () => {
  const sectionRef = useRef(null);
  const itemsRef = useRef([]);
  const bgRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Background parallax
      gsap.fromTo(bgRef.current,
        { backgroundPositionY: '0%' },
        {
          backgroundPositionY: '30%',
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          }
        }
      );

      // Stats items pop in with stagger
      gsap.fromTo(itemsRef.current,
        { opacity: 0, y: 50, scale: 0.85 },
        {
          opacity: 1, y: 0, scale: 1,
          duration: 0.8, stagger: 0.15, ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
          }
        }
      );

      // Counter animations
      itemsRef.current.forEach((el, i) => {
        if (!el) return;
        const stat = bannerStats[i];
        const numEl = el.querySelector('.banner-stat-value');
        if (!numEl) return;
        let obj = { val: 0 };
        gsap.to(obj, {
          val: stat.value,
          duration: 2.5,
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

      // Divider lines grow
      const dividers = sectionRef.current?.querySelectorAll('.banner-divider');
      if (dividers) {
        gsap.fromTo(dividers,
          { scaleY: 0 },
          {
            scaleY: 1, duration: 1, stagger: 0.1, ease: 'power2.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 75%',
            }
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="stats-banner-section" ref={sectionRef}>
      <div className="stats-banner-bg" ref={bgRef} />
      <div className="stats-banner-overlay" />
      <div className="container stats-banner-inner">
        {bannerStats.map((s, i) => (
          <React.Fragment key={i}>
            <div className="banner-stat-item" ref={el => itemsRef.current[i] = el}>
              <div className="banner-stat-icon">{s.icon}</div>
              <span className="banner-stat-value">
                {s.isDecimal ? `0.0${s.suffix}` : `0${s.suffix}`}
              </span>
              <span className="banner-stat-label">{s.label}</span>
              <span className="banner-stat-sublabel">{s.sublabel}</span>
            </div>
            {i < bannerStats.length - 1 && (
              <div className="banner-divider" />
            )}
          </React.Fragment>
        ))}
      </div>
    </section>
  );
};

export default StatsBannerSection;
