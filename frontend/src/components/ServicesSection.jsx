import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  FiTruck, FiBox, FiGift, FiHeadphones, FiRefreshCw, FiTag
} from 'react-icons/fi';
import './ServicesSection.css';

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    icon: <FiTruck />,
    title: 'Express Delivery',
    desc: 'Same-day and next-day delivery across 500+ cities in India.',
    color: '#588157',
    bg: '#e8f0e6',
    step: '01',
  },
  {
    icon: <FiBox />,
    title: 'Premium Packaging',
    desc: 'Luxury gift-ready packaging that makes every order feel special.',
    color: '#d97706',
    bg: '#fef3c7',
    step: '02',
  },
  {
    icon: <FiGift />,
    title: 'Gift Wrapping',
    desc: 'Handcrafted gift wraps with personal message cards at ₹49.',
    color: '#d946ef',
    bg: '#fdf4ff',
    step: '03',
  },
  {
    icon: <FiHeadphones />,
    title: 'Live Expert Support',
    desc: 'Chat with a human expert, not a bot, available around the clock.',
    color: '#3b82f6',
    bg: '#eff6ff',
    step: '04',
  },
  {
    icon: <FiRefreshCw />,
    title: 'Easy 30-Day Returns',
    desc: 'Instant pickup and same-day refund on every eligible product.',
    color: '#ef4444',
    bg: '#fef2f2',
    step: '05',
  },
  {
    icon: <FiTag />,
    title: 'Price Match Guarantee',
    desc: 'Found it cheaper? We\'ll match the price — no questions asked.',
    color: '#0891b2',
    bg: '#ecfeff',
    step: '06',
  },
];

const ServicesSection = () => {
  const sectionRef = useRef(null);
  const headRef = useRef(null);
  const cardsRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading reveal
      gsap.fromTo(headRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
          scrollTrigger: {
            trigger: headRef.current,
            start: 'top 80%',
          }
        }
      );

      // Cards alternate: even from left, odd from right
      const cards = cardsRef.current?.children;
      if (cards) {
        Array.from(cards).forEach((card, i) => {
          const fromX = i % 2 === 0 ? -80 : 80;
          gsap.fromTo(card,
            { opacity: 0, x: fromX, scale: 0.9 },
            {
              opacity: 1, x: 0, scale: 1,
              duration: 0.75, ease: 'power3.out',
              scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none reverse',
              }
            }
          );
        });
      }

      // Step number count-up effect (visual only)
      const steps = sectionRef.current?.querySelectorAll('.service-step');
      if (steps) {
        gsap.fromTo(steps,
          { opacity: 0, scale: 0 },
          {
            opacity: 1, scale: 1,
            duration: 0.5, stagger: 0.1, ease: 'back.out(2)',
            scrollTrigger: {
              trigger: cardsRef.current,
              start: 'top 80%',
            }
          }
        );
      }

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="services-section" ref={sectionRef}>
      <div className="container">
        <div className="services-head" ref={headRef}>
          <span className="services-badge">Our Services</span>
          <h2 className="services-title">
            Everything You Need,<br />
            <span className="services-title-accent">Handled with Care.</span>
          </h2>
          <p className="services-subtitle">
            We don't stop at delivering products — we deliver peace of mind, every single time.
          </p>
        </div>

        <div className="services-grid" ref={cardsRef}>
          {services.map((s, i) => (
            <div
              className="service-card"
              key={i}
              style={{ '--card-accent': s.color, '--card-bg': s.bg }}
            >
              <div className="service-top-row">
                <div className="service-icon-wrap">
                  {s.icon}
                </div>
                <span className="service-step">{s.step}</span>
              </div>
              <h3 className="service-title">{s.title}</h3>
              <p className="service-desc">{s.desc}</p>
              <div className="service-bar" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
