'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { EXPERIENCE_DATA } from '../data/portfolio';
import { prefersReducedMotion } from '../lib/motion';
import { MapPin, Calendar, Briefcase } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const Experience: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);
  const timelineBarRef = useRef<HTMLDivElement>(null);
  const timelineDotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion() || !containerRef.current) return;

    const bar = timelineBarRef.current;
    const dot = timelineDotRef.current;
    const section = containerRef.current;

    if (bar && dot) {
      // Timeline line self-drawing
      gsap.fromTo(
        bar,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top 60%',
            end: 'bottom 80%',
            scrub: 0.5,
            onUpdate: (self) => {
              // Move glowing tip dot along the line
              if (dot) {
                const height = bar.parentElement?.clientHeight || 0;
                dot.style.transform = `translateY(${self.progress * height}px)`;
              }
            },
          },
        }
      );
    }

    // Nodes and content reveals
    const items = gsap.utils.toArray<HTMLElement>('.experience-entry');
    items.forEach((item) => {
      const node = item.querySelector<HTMLElement>('.timeline-node');
      const content = item.querySelector<HTMLElement>('.experience-card');
      if (!node || !content) return;

      const header = content.querySelector<HTMLElement>('.experience-header');
      const bullets = content.querySelectorAll<HTMLElement>('li');

      // Plays on enter from either direction and reverses on leave,
      // so the reveal repeats every time the card scrolls into view
      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        scrollTrigger: {
          trigger: item,
          start: 'top 85%',
          end: 'bottom 15%',
          toggleActions: 'play reverse play reverse',
        },
      });

      tl.fromTo(
        node,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.45, ease: 'back.out(2.5)' }
      )
        .fromTo(
          content,
          {
            opacity: 0,
            x: -60,
            scale: 0.96,
            filter: 'blur(12px)',
            transformOrigin: 'left center',
          },
          { opacity: 1, x: 0, scale: 1, filter: 'blur(0px)', duration: 0.9 },
          '-=0.2'
        )
        .fromTo(
          header,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6 },
          '-=0.55'
        )
        .fromTo(
          bullets,
          { opacity: 0, x: -20 },
          { opacity: 1, x: 0, duration: 0.5, stagger: 0.07 },
          '-=0.4'
        );
    });
  }, []);

  return (
    <section
      id="experience"
      ref={containerRef}
      className="relative overflow-x-clip py-28 px-6 md:px-12 bg-[#161616] text-[#F5F5F5] border-t border-[#2A2A2A]"
    >
      <div className="max-w-[1440px] mx-auto">
        {/* Section Header */}
        <div className="mb-20">
          <div className="flex items-center gap-3 text-xs tracking-[0.2em] font-medium text-[#7B5CFF] uppercase mb-4">
            <span>(04) — EXPERIENCE</span>
            <div className="h-[1px] w-12 bg-[#7B5CFF]/40" />
          </div>
          <h2 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl uppercase tracking-tight text-[#F5F5F5]">
            WHERE I&apos;VE WORKED
          </h2>
        </div>

        {/* Timeline Container */}
        <div className="relative pl-6 sm:pl-12 md:pl-20">
          {/* Vertical Timeline Track Line */}
          <div className="absolute left-2 sm:left-6 md:left-8 top-4 bottom-8 w-[2px] bg-[#2A2A2A]">
            <div
              ref={timelineBarRef}
              className="w-full h-full bg-gradient-to-b from-[#7B5CFF] via-[#5530A7] to-[#7B5CFF] origin-top scale-y-0"
            />
            {/* Glowing Traveling Dot at tip */}
            <div
              ref={timelineDotRef}
              className="absolute -left-[5px] -top-1.5 w-3 h-3 rounded-full bg-[#7B5CFF] shadow-[0_0_12px_#7B5CFF] pointer-events-none"
            />
          </div>

          {/* Timeline Entries */}
          <div className="flex flex-col gap-12 sm:gap-16">
            {EXPERIENCE_DATA.map((exp) => (
              <div key={exp.id} className="experience-entry relative group">
                {/* Node on line */}
                <div className="timeline-node absolute -left-[25px] sm:-left-[33px] md:-left-[57px] top-6 w-5 h-5 rounded-full bg-[#0E0E0E] border-2 border-[#7B5CFF] group-hover:bg-[#7B5CFF] transition-colors duration-300 z-10 flex items-center justify-center shadow-[0_0_10px_rgba(123,92,255,0.4)]">
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                </div>

                {/* Entry Card */}
                <div className="experience-card relative rounded-3xl p-8 sm:p-10 bg-[#1F1F1F] border border-[#2A2A2A] hover:border-[#7B5CFF]/50 transition-colors duration-300 overflow-hidden will-change-transform shadow-xl">
                  {/* Faded Large Initial in Background on Hover */}
                  <span
                    aria-hidden="true"
                    className="absolute -right-4 -bottom-10 font-display font-black text-9xl text-white/[0.03] group-hover:text-[#7B5CFF]/[0.08] transition-colors duration-500 pointer-events-none select-none"
                  >
                    {exp.initial}
                  </span>

                  {/* Header Row */}
                  <div className="experience-header flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#2A2A2A] mb-6">
                    <div>
                      <div className="flex items-center gap-3 flex-wrap mb-1">
                        <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
                          {exp.company}
                        </h3>
                        {exp.isCurrent && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E3242B]/15 border border-[#E3242B]/40 text-[#E3242B] text-xs font-mono font-bold tracking-wider uppercase">
                            <span className="w-2 h-2 rounded-full bg-[#E3242B] animate-ping" />
                            CURRENT
                          </span>
                        )}
                      </div>
                      <div className="text-base sm:text-lg text-[#7B5CFF] font-medium flex items-center gap-2">
                        <Briefcase className="w-4 h-4" />
                        <span>{exp.role}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#9A9A9A]">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#7B5CFF]" />
                        <span>{exp.period}</span>
                      </div>
                      <span className="hidden sm:inline">·</span>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#7B5CFF]" />
                        <span>{exp.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Bullets List */}
                  <ul className="flex flex-col gap-3">
                    {exp.bullets.map((bullet, bIdx) => (
                      <li
                        key={bIdx}
                        className="flex items-start gap-3 text-sm sm:text-base text-[#9A9A9A] leading-relaxed group-hover:text-[#D1D1D1] transition-colors"
                      >
                        <span className="text-[#7B5CFF] mt-1 shrink-0">✦</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
