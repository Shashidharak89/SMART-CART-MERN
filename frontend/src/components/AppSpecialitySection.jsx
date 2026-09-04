import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  FiSearch, FiCreditCard, FiTruck, FiGift,
  FiCamera, FiLock, FiSmartphone, FiRefreshCw
} from 'react-icons/fi';
import './AppSpecialitySection.css';

gsap.registerPlugin(ScrollTrigger);

const specialities = [
  {
    icon: <FiSearch />,
    title: 'AI Smart Search',
    desc: 'Find exactly what you need with intelligent voice and image-based search.',
    span: 'wide',
    accent: '#a3c585',
  },
  {
    icon: <FiCreditCard />,
    title: '1-Click Checkout',
    desc: 'Saved addresses, cards, and UPI — buy in seconds.',
    span: 'normal',
    accent: '#7eb8d4',
  },
  {
    icon: <FiTruck />,
    title: 'Live Order Tracking',
    desc: 'Watch your parcel move in real time on an interactive map.',
    span: 'normal',
    accent: '#f0a070',
  },
  {
    icon: <FiCamera />,
    title: 'AR Try-Before-Buy',
    desc: 'Virtually place furniture or try on accessories using your camera.',
    span: 'normal',
    accent: '#d4a3c5',
  },
  {
    icon: <FiGift />,
    title: 'SmartCoins Loyalty',
    desc: 'Earn coins on every rupee spent and redeem on future orders.',
    span: 'normal',
    accent: '#f5c842',
  },
  {
    icon: <FiLock />,
    title: 'Bank-Grade Security',
    desc: '256-bit SSL, 3D Secure, and biometric authentication built in.',
    span: 'wide',
    accent: '#588157',
  },
];

const AppSpecialitySection = () => {
  const sectionRef = useRef(null);
  const headRef = useRef(null);
  const gridRef = useRef(null);

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

      // Cards clip-path wipe reveal
      const cards = gridRef.current?.querySelectorAll('.spec-card');
      if (cards) {
        gsap.fromTo(cards,
          {
            clipPath: 'inset(100% 0% 0% 0%)',
            opacity: 0,
          },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            opacity: 1,
            duration: 0.85,
            stagger: { amount: 0.8, from: 'start' },
            ease: 'power3.out',
            scrollTrigger: {
              trigger: gridRef.current,
              start: 'top 78%',
            }
          }
        );
      }

      // Hover 3D tilt for cards
      cards?.forEach(card => {
        card.addEventListener('mousemove', (e) => {
          const rect = card.getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
          const y = ((e.clientY - rect.top) / rect.height - 0.5) * -20;
          gsap.to(card, { rotateY: x, rotateX: y, duration: 0.3, ease: 'power1.out', transformPerspective: 600 });
        });
        card.addEventListener('mouseleave', () => {
          gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.5, ease: 'power2.out' });
        });
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="spec-section" ref={sectionRef} id="section-app-speciality">
      <div className="spec-noise" />
      <div className="container">
        <div className="spec-head" ref={headRef}>
          <span className="spec-badge">
            <FiSmartphone style={{ marginRight: 6 }} /> App Specialities
          </span>
          <h2 className="spec-title">
            Built Different.<br />
            <span className="spec-title-accent">Designed to Delight.</span>
          </h2>
          <p className="spec-subtitle">
            Every feature in SmartCart was obsessed over — from the first tap to the final unboxing.
          </p>
        </div>

        <div className="spec-grid" ref={gridRef}>
          {specialities.map((s, i) => (
            <div
              key={i}
              className={`spec-card ${s.span === 'wide' ? 'spec-card--wide' : ''}`}
            >
              <div
                className="spec-card-icon"
                style={{ color: s.accent, background: s.accent + '22' }}
              >
                {s.icon}
              </div>
              <h3 className="spec-card-title">{s.title}</h3>
              <p className="spec-card-desc">{s.desc}</p>
              <div className="spec-card-glow" style={{ background: s.accent + '15' }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AppSpecialitySection;
