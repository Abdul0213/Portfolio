'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { EDUCATION_DATA } from '../data/portfolio';
import { GraduationCap, Award, BadgeCheck } from 'lucide-react';
import { prefersReducedMotion } from '../lib/motion';

gsap.registerPlugin(ScrollTrigger);

const HEADING_WORDS = ['ACADEMIC', '&', 'TRAINING'];

export const Education: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReducedMotion() || !sectionRef.current) return;

    // Every reveal plays on enter from either direction and reverses on leave,
    // so the section re-animates each time it scrolls into view
    const replay = { start: 'top 85%', end: 'bottom 15%', toggleActions: 'play reverse play reverse' };

    const ctx = gsap.context(() => {
      // Header: label slides in, heading words rise out of masks, quote un-blurs
      gsap
        .timeline({
          defaults: { ease: 'expo.out' },
          scrollTrigger: { trigger: '.edu-header', ...replay },
        })
        .fromTo('.edu-label', { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 0.8 })
        .fromTo('.edu-label-line', { scaleX: 0 }, { scaleX: 1, duration: 0.8, transformOrigin: 'left center' }, '<0.2')
        .fromTo(
          '.edu-word',
          { yPercent: 115, rotate: 8, opacity: 0 },
          { yPercent: 0, rotate: 0, opacity: 1, duration: 1.2, stagger: 0.12 },
          '<0.1'
        )
        .fromTo(
          '.edu-quote',
          { opacity: 0, y: 24, filter: 'blur(10px)' },
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1 },
          '-=0.8'
        );

      // Cards: alternate sides, swing in with 3D tilt + blur, a light sheen sweeps
      // across, then the icon spins in, text staggers up and the badge stamps down
      gsap.utils.toArray<HTMLElement>('.edu-card').forEach((card, i) => {
        const dir = i % 2 === 0 ? -1 : 1;
        const q = gsap.utils.selector(card);

        gsap
          .timeline({
            defaults: { ease: 'expo.out' },
            scrollTrigger: { trigger: card, ...replay },
          })
          .fromTo(
            card,
            {
              opacity: 0,
              x: 140 * dir,
              rotateY: 14 * dir,
              scale: 0.92,
              filter: 'blur(14px)',
              transformPerspective: 1200,
            },
            { opacity: 1, x: 0, rotateY: 0, scale: 1, filter: 'blur(0px)', duration: 1.2 }
          )
          .fromTo(q('.edu-sheen'), { xPercent: -120 }, { xPercent: 420, duration: 1.4, ease: 'power2.inOut' }, '<0.25')
          .fromTo(
            q('.edu-icon'),
            { scale: 0, rotate: -180, opacity: 0 },
            { scale: 1, rotate: 0, opacity: 1, duration: 0.9, ease: 'back.out(2)' },
            '<0.1'
          )
          .fromTo(
            q('.edu-text'),
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.8, stagger: 0.09 },
            '<0.1'
          )
          .fromTo(q('.edu-cred'), { opacity: 0, x: 20 * -dir }, { opacity: 1, x: 0, duration: 0.6 }, '<0.2')
          .fromTo(
            q('.edu-badge'),
            { scale: 2.4, rotate: -14, opacity: 0 },
            { scale: 1, rotate: 0, opacity: 1, duration: 0.7, ease: 'back.out(3)' },
            '<0.15'
          );

        // Gentle idle float on the icon
        gsap.to(q('.edu-icon-float'), {
          y: -6,
          duration: 2 + i * 0.3,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Cursor-following radial glow card
  const EducationCard: React.FC<{
    item: typeof EDUCATION_DATA[0];
    index: number;
  }> = ({ item, index }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [mousePos, setMousePos] = useState({ x: 50, y: 50, opacity: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (prefersReducedMotion() || !cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setMousePos({ x, y, opacity: 1 });
    };

    const handleMouseLeave = () => {
      setMousePos((prev) => ({ ...prev, opacity: 0 }));
    };

    return (
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="edu-card relative group rounded-3xl p-8 sm:p-12 bg-gradient-to-br from-[#2B1F55] via-[#1A1530] to-[#141414] border border-[#7B5CFF]/25 hover:border-[#7B5CFF]/70 hover:shadow-[0_0_60px_rgba(123,92,255,0.28)] overflow-hidden transition-[border-color,box-shadow] duration-300 shadow-xl"
      >
        {/* Drifting purple orbs */}
        <div
          aria-hidden="true"
          className="absolute -top-24 -right-16 w-96 h-96 rounded-full bg-[#7B5CFF]/25 blur-3xl pointer-events-none animate-edu-orb"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-32 left-1/4 w-80 h-80 rounded-full bg-[#5530A7]/30 blur-3xl pointer-events-none animate-edu-orb [animation-delay:-4s]"
        />

        {/* Dynamic Cursor-following Glow */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{
            opacity: mousePos.opacity,
            background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(155, 125, 255, 0.28), transparent 70%)`,
          }}
        />

        {/* Light sheen swept across on reveal */}
        <div
          aria-hidden="true"
          className="edu-sheen absolute inset-y-0 -left-1/4 w-1/4 -skew-x-12 bg-gradient-to-r from-transparent via-[#B49CFF]/25 to-transparent pointer-events-none"
        />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-start gap-5">
            <div className="edu-icon shrink-0">
              <div className="edu-icon-float">
                <div className="p-4 rounded-2xl bg-[#7B5CFF]/15 border border-[#7B5CFF]/40 text-[#B49CFF] shadow-[0_0_24px_rgba(123,92,255,0.3)] group-hover:scale-110 group-hover:bg-[#7B5CFF] group-hover:text-white transition-[scale,background-color,color] duration-300">
                  {index === 0 ? <Award className="w-8 h-8" /> : <GraduationCap className="w-8 h-8" />}
                </div>
              </div>
            </div>
            <div>
              <span className="edu-text text-xs font-mono text-[#B49CFF] tracking-wider uppercase block mb-1">
                {item.duration} · {item.period}
              </span>
              <h3 className="edu-text font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight mb-1">
                {item.institution}
              </h3>
              <p className="edu-text text-base text-[#B8B0D6] font-medium">{item.program}</p>
            </div>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-4 sm:pt-0 border-[#7B5CFF]/20">
            <span className="edu-cred text-xs font-mono tracking-widest text-[#7B5CFF]/80 uppercase">
              CREDENTIAL (0{index + 1})
            </span>
            <span className="edu-badge inline-flex items-center gap-1.5 text-xs font-bold text-white uppercase tracking-wider mt-1 px-3 py-1 rounded-full bg-[#7B5CFF]/25 border border-[#7B5CFF]/60 shadow-[0_0_16px_rgba(123,92,255,0.35)]">
              <BadgeCheck className="w-3.5 h-3.5 text-[#B49CFF]" />
              VERIFIED
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section
      id="education"
      ref={sectionRef}
      className="relative overflow-x-clip py-28 px-6 md:px-12 bg-[#0E0E0E] text-[#F5F5F5] border-t border-[#2A2A2A]"
    >
      <div className="max-w-[90rem] mx-auto">
        {/* Section Header */}
        <div className="edu-header flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="flex items-center gap-3 text-xs tracking-[0.2em] font-medium text-[#7B5CFF] uppercase mb-4">
              <span className="edu-label">(06) — EDUCATION</span>
              <div className="edu-label-line h-[1px] w-12 bg-[#7B5CFF]/40" />
            </div>
            <h2 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl uppercase tracking-tight text-[#F5F5F5]">
              {HEADING_WORDS.map((word, i) => (
                <React.Fragment key={word}>
                  <span className="inline-block overflow-hidden align-top pb-[0.08em]">
                    <span className="edu-word inline-block origin-bottom-left">{word}</span>
                  </span>
                  {i < HEADING_WORDS.length - 1 && ' '}
                </React.Fragment>
              ))}
            </h2>
          </div>
          <p className="edu-quote max-w-md text-sm sm:text-base text-[#9A9A9A] italic">
            &ldquo;Self-taught at heart — always learning new tools and techniques.&rdquo;
          </p>
        </div>

        {/* Education Cards Grid */}
        <div className="grid grid-cols-1 gap-6">
          {EDUCATION_DATA.map((item, idx) => (
            <EducationCard key={item.institution} item={item} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
};
