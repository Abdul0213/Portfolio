'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MagneticButton } from './MagneticButton';
import { useSmoothScroll } from './SmoothScroll';
import { prefersReducedMotion } from '../lib/motion';
import { ArrowUp } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

/**
 * Compact signature footer. Links and contact details live in the Contact
 * section directly above, so the footer only carries the name, availability
 * and a way back to the top.
 */
export const Footer: React.FC = () => {
  const { scrollTo } = useSmoothScroll();
  const footerRef = useRef<HTMLElement>(null);
  const nameString = 'ABDUL REHMAN';

  const handleBackToTop = () => {
    scrollTo('#top', 0);
  };

  useEffect(() => {
    if (prefersReducedMotion() || !footerRef.current) return;

    // Replays every time the footer scrolls into view
    const ctx = gsap.context(() => {
      gsap
        .timeline({
          defaults: { ease: 'expo.out' },
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 90%',
            toggleActions: 'play none none reverse',
          },
        })
        .fromTo('.footer-top', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8 })
        .fromTo(
          '.footer-char',
          { yPercent: 110, rotate: 6 },
          { yPercent: 0, rotate: 0, duration: 1.1, stagger: { each: 0.04, from: 'center' } },
          '<0.1'
        )
        .fromTo('.footer-bottom', { opacity: 0 }, { opacity: 1, duration: 0.8 }, '-=0.6');
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer
      id="footer"
      ref={footerRef}
      className="relative z-10 w-full bg-[#0E0E0E] text-[#F5F5F5] border-t border-[#2A2A2A] pt-16 pb-10 px-6 md:px-12 select-none overflow-hidden"
    >
      {/* Soft purple glow behind the name */}
      <div
        aria-hidden="true"
        className="absolute left-1/2 bottom-0 -translate-x-1/2 w-[70%] h-64 rounded-full bg-[#7B5CFF]/15 blur-[100px] pointer-events-none"
      />

      <div className="relative max-w-[1440px] mx-auto">
        {/* Top row: monogram + availability, back to top */}
        <div className="footer-top flex items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="font-display font-black text-3xl tracking-tighter">
              AR<span className="text-[#7B5CFF]">.</span>
            </div>
            <div className="hidden sm:flex items-center gap-2.5 px-4 py-2 rounded-full border border-[#2A2A2A] bg-[#161616]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono tracking-wider text-[#9A9A9A] uppercase">
                Available for Q4 2026 Projects
              </span>
            </div>
          </div>

          <MagneticButton
            onClick={handleBackToTop}
            variant="outline"
            className="w-14 h-14 rounded-full flex flex-col items-center justify-center p-0 border border-[#2A2A2A] hover:border-[#7B5CFF]"
            aria-label="Back to top"
          >
            <ArrowUp className="w-5 h-5 text-[#7B5CFF]" />
          </MagneticButton>
        </div>

        {/* Giant hoverable name, letters rise out of a mask */}
        <div className="pt-14 pb-10 text-center @container">
          <div
            aria-label={nameString}
            className="font-display font-black text-[clamp(2.25rem,7.2cqw,9.5rem)] tracking-tighter leading-none text-[#F5F5F5] flex justify-center items-center flex-wrap gap-x-[0.3em]"
          >
            {nameString.split(' ').map((word, wordIndex) => (
              <span key={wordIndex} aria-hidden="true" className="inline-flex whitespace-nowrap overflow-hidden pt-[0.2em] -mt-[0.2em] pb-[0.05em]">
                {Array.from(word).map((char, index) => (
                  <span key={index} className="footer-char inline-block">
                    <span className="inline-block transition-[translate,color] duration-300 hover:-translate-y-3 hover:text-[#7B5CFF] cursor-default">
                      {char}
                    </span>
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom pt-6 border-t border-[#2A2A2A] flex flex-col sm:flex-row justify-between items-center gap-3 text-xs font-mono text-[#5C5C5C]">
          <div>© 2026 Abdul Rehman — Designed &amp; built in Lahore.</div>
          <div>All Rights Reserved</div>
        </div>
      </div>
    </footer>
  );
};
