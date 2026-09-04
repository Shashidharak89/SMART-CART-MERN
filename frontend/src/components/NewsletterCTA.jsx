import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FiMail, FiArrowRight } from 'react-icons/fi';
import './NewsletterCTA.css';

gsap.registerPlugin(ScrollTrigger);

const headlineChars = 'Join the'.split('');
const headlineChars2 = 'SmartCart'.split('');
const headlineChars3 = 'Revolution.'.split('');

const NewsletterCTA = () => {
  const sectionRef = useRef(null);
  const bgRef = useRef(null);
  const textRef = useRef(null);
  const formRef = useRef(null);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Clip-path background expand
      gsap.fromTo(bgRef.current,
        { clipPath: 'inset(30% 10% 30% 10% round 24px)' },
        {
          clipPath: 'inset(0% 0% 0% 0% round 0px)',
          duration: 1.2, ease: 'power3.inOut',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          }
        }
      );

      // Chars stagger reveal
      const chars = textRef.current?.querySelectorAll('.nl-char');
      if (chars) {
        gsap.fromTo(chars,
          { opacity: 0, y: 50, rotateX: -90 },
          {
            opacity: 1, y: 0, rotateX: 0,
            duration: 0.6, stagger: 0.03, ease: 'back.out(1.5)',
            delay: 0.5,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 80%',
            }
          }
        );
      }

      // Form slide up
      gsap.fromTo(formRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', delay: 0.8,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          }
        }
      );

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    gsap.to(formRef.current, {
      scale: 0.95, duration: 0.1, yoyo: true, repeat: 1,
      onComplete: () => setSubmitted(true)
    });
  };

  const renderChars = (word, spaceAfter = false) => (
    <>
      {word.split('').map((ch, i) => (
        <span key={i} className="nl-char">{ch}</span>
      ))}
      {spaceAfter && <span className="nl-char nl-space">&nbsp;</span>}
    </>
  );

  return (
    <section className="nl-section" ref={sectionRef} id="section-newsletter">
      <div className="nl-bg" ref={bgRef} />
      <div className="nl-noise" />
      <div className="container nl-inner">
        <div className="nl-text" ref={textRef}>
          <p className="nl-overline">
            {Array.from('✦ Stay in the Loop ✦').map((ch, i) => (
              <span key={i} className="nl-char">{ch}</span>
            ))}
          </p>
          <h2 className="nl-headline">
            <div className="nl-headline-row">
              {renderChars('Join', true)}{renderChars('the')}
            </div>
            <div className="nl-headline-row nl-headline-accent">
              {renderChars('SmartCart')}
            </div>
            <div className="nl-headline-row">
              {renderChars('Revolution.')}
            </div>
          </h2>
          <p className="nl-sub">
            {Array.from('Get exclusive deals, early access, and curated picks — straight to your inbox.').map((ch, i) => (
              <span key={i} className="nl-char">{ch === ' ' ? '\u00a0' : ch}</span>
            ))}
          </p>
        </div>

        {!submitted ? (
          <form className="nl-form" ref={formRef} onSubmit={handleSubmit}>
            <div className="nl-input-wrap">
              <FiMail className="nl-input-icon" />
              <input
                type="email"
                placeholder="yourname@email.com"
                className="nl-input"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="nl-btn">
              Subscribe <FiArrowRight />
            </button>
          </form>
        ) : (
          <div className="nl-success" ref={formRef}>
            🎉 You're in! Watch your inbox for SmartCart magic.
          </div>
        )}

        <p className="nl-privacy">No spam. Unsubscribe anytime. We respect your inbox.</p>

        <div className="nl-perks">
          <span className="nl-perk">✦ Exclusive Deals</span>
          <span className="nl-perk">✦ Early Access</span>
          <span className="nl-perk">✦ Curated Picks</span>
          <span className="nl-perk">✦ Members-only Discounts</span>
        </div>
      </div>
    </section>
  );
};

export default NewsletterCTA;
