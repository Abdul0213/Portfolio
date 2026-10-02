import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HeroShader } from './HeroShader';
import { SERVICES_DATA } from '../data/portfolio';
import { prefersReducedMotion } from '../lib/motion';
import {
  Palette,
  LayoutGrid,
  Flame,
  Box,
  MonitorSmartphone,
  Film,
  Printer,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const Services: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);

  const getServiceIcon = (iconName: string) => {
    const props = { className: 'w-16 h-16 text-white/80 group-hover:text-white transition-colors duration-500 service-icon' };
    switch (iconName) {
      case 'Palette':
        return <Palette {...props} />;
      case 'LayoutGrid':
        return <LayoutGrid {...props} />;
      case 'Flame':
        return <Flame {...props} />;
      case 'Box':
        return <Box {...props} />;
      case 'MonitorSmartphone':
        return <MonitorSmartphone {...props} />;
      case 'Film':
        return <Film {...props} />;
      case 'Printer':
        return <Printer {...props} />;
      default:
        return <Palette {...props} />;
    }
  };

  useEffect(() => {
    if (prefersReducedMotion() || !containerRef.current || !cardsContainerRef.current) return;

    const mm = gsap.matchMedia();

    // Stacking cards: each card sticks, and shrinks slightly as the next one slides over it
    mm.add('(min-width: 0px)', () => {
      const cards = gsap.utils.toArray<HTMLElement>('.service-card');

      // Cards keep full brightness while stacked — clear any dimming left on them
      gsap.set(cards, { clearProps: 'filter,opacity' });

      cards.forEach((card, index) => {
        const next = cards[index + 1];
        if (next) {
          const depth = cards.length - 1 - index;
          gsap.to(card, {
            scale: 1 - Math.min(depth, 3) * 0.035,
            ease: 'none',
            scrollTrigger: {
              trigger: next,
              start: 'top bottom',
              // finish exactly when the next card reaches its own sticky offset
              end: () => `top ${parseFloat(getComputedStyle(next).top) || 0}px`,
              scrub: true,
              invalidateOnRefresh: true,
            },
          });
        }

        // Slight rotation on icon
        const icon = card.querySelector('.service-icon');
        if (icon) {
          gsap.to(icon, {
            rotate: 20,
            ease: 'none',
            scrollTrigger: {
              trigger: card,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          });
        }
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      id="services"
      ref={containerRef}
      className="relative py-28 px-6 md:px-12 bg-[#0E0E0E] text-[#F5F5F5] border-t border-[#2A2A2A]"
    >
      <div className="max-w-[1440px] mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="flex items-center gap-3 text-xs tracking-[0.2em] font-medium text-[#7B5CFF] uppercase mb-4">
              <span>(02) — WHAT I DO</span>
              <div className="h-[1px] w-12 bg-[#7B5CFF]/40" />
            </div>
            <h2 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl uppercase tracking-tight text-[#F5F5F5]">
              SERVICES
            </h2>
          </div>
          <p className="max-w-md text-sm md:text-base text-[#9A9A9A] leading-relaxed">
            High-caliber creative services designed to elevate brands, increase conversion rates, and build lasting impressions.
          </p>
        </div>

        {/* Stacking Cards Container — the large gap is reading time before the next card slides over */}
        <div
          ref={cardsContainerRef}
          className="relative flex flex-col gap-[30vh] lg:gap-[40vh] pb-16"
        >
          {SERVICES_DATA.map((service, index) => (
            <div
              key={service.number}
              className="service-card group sticky top-[calc(5.5rem+var(--i)*0.75rem)] lg:top-[calc(7rem+var(--i)*1.5rem)] rounded-3xl p-8 sm:p-12 md:p-16 bg-[#0E0E0E] border-2 border-white/90 shadow-[0_-10px_30px_-12px_rgba(14,14,14,0.6)] transition-[border-color,box-shadow] duration-300 hover:border-white hover:shadow-[0_0_40px_rgba(123,92,255,0.55)] origin-top overflow-hidden will-change-transform"
              // Each card sticks a little lower than the previous one so the stack edges stay visible
              style={{ '--i': index } as React.CSSProperties}
            >
              {/* Liquid violet background (same shader as the hero), offset per card */}
              <HeroShader timeOffset={index * 11} maxDpr={0.75} className="opacity-90" />

              <div className="relative z-10 flex flex-col justify-between h-full min-h-[260px] md:min-h-[300px]">
                {/* Card Top: Number & Icon */}
                <div className="flex items-start justify-between">
                  <span className="text-stroke text-white font-display font-black text-5xl sm:text-7xl md:text-8xl transition-transform duration-500 origin-left group-hover:scale-105 group-hover-fill">
                    {service.number}
                  </span>
                  <div className="p-4 rounded-2xl bg-white/10 border border-white/30 group-hover:bg-white/20 group-hover:border-white/60 transition-colors">
                    {getServiceIcon(service.iconName)}
                  </div>
                </div>

                {/* Card Middle: Title & Description */}
                <div className="my-8 max-w-3xl">
                  <h3 className="font-display font-extrabold text-2xl sm:text-4xl md:text-5xl text-white mb-4 tracking-tight">
                    {service.title}
                  </h3>
                  <p className="text-base sm:text-lg md:text-xl text-white/80 leading-relaxed">
                    {service.description}
                  </p>
                </div>

                {/* Card Bottom: Tags */}
                <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-white/25">
                  {service.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-4 py-1.5 rounded-full bg-white/10 border border-white/40 text-xs font-mono tracking-wider text-white uppercase"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
