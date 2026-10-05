'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ABOUT_DATA } from '../data/portfolio';
import { EASINGS, prefersReducedMotion } from '../lib/motion';
import {
  Gamepad2,
  Sparkles,
  BookOpen,
  Headphones,
  Quote,
  UtensilsCrossed,
  Cloud,
  Building2,
  Factory,
  ArrowUpRight,
  Languages,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface StatCardProps {
  value: string; // e.g. "3+" or "3"
  label: string;
}

/**
 * Stat tile: counts up from 0 every time it scrolls into view (down or up),
 * and on hover turns violet, lifts, re-runs the count and lights its progress bar.
 */
const StatCard: React.FC<StatCardProps> = ({ value, label }) => {
  const target = parseInt(value, 10) || 0;
  const suffix = value.replace(/^\d+/, '');

  const cardRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const [display, setDisplay] = useState(0);
  const [inView, setInView] = useState(false);

  // Counting digits isn't spatial motion, so it runs even with reduced motion enabled
  const runCount = (duration: number) => {
    tweenRef.current?.kill();
    const counter = { val: 0 };
    setDisplay(0);
    tweenRef.current = gsap.to(counter, {
      val: target,
      duration,
      ease: EASINGS.power3Out,
      onUpdate: () => setDisplay(Math.round(counter.val)),
    });
  };

  const reset = () => {
    tweenRef.current?.kill();
    setDisplay(0);
    setInView(false);
  };

  // Replay the count on every entry; reset once the card fully leaves the viewport
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const enter = () => {
      setInView(true);
      runCount(1.6);
    };

    const trigger = ScrollTrigger.create({
      trigger: card,
      start: 'top 90%',
      end: 'bottom 10%',
      onEnter: enter,
      onEnterBack: enter,
      onLeave: reset,
      onLeaveBack: reset,
    });

    return () => {
      trigger.kill();
      tweenRef.current?.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  const handleMouseEnter = () => runCount(0.9);

  // Spotlight that follows the cursor inside the card
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    card.style.setProperty('--my', `${e.clientY - rect.top}px`);
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      className="stat-item group relative overflow-hidden p-8 rounded-2xl bg-[#1F1F1F] border border-[#2A2A2A] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:border-[#7B5CFF]/70 hover:bg-[#211D2E] hover:shadow-[0_20px_50px_-15px_rgba(123,92,255,0.45)]"
    >
      {/* Cursor-following violet spotlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background:
            'radial-gradient(260px circle at var(--mx, 50%) var(--my, 50%), rgba(123,92,255,0.22), transparent 70%)',
        }}
      />

      <div className="relative">
        <div
          aria-label={value}
          className="font-display font-black text-6xl md:text-7xl mb-2 tracking-tight tabular-nums text-[#F5F5F5] transition-[color,text-shadow,transform] duration-500 origin-left group-hover:text-[#7B5CFF] group-hover:scale-105 group-hover:[text-shadow:0_0_30px_rgba(123,92,255,0.55)]"
        >
          <span aria-hidden="true">{display}</span>
          {suffix && (
            <span
              aria-hidden="true"
              className="inline-block transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:-translate-y-2 group-hover:rotate-90"
            >
              {suffix}
            </span>
          )}
        </div>
        <div className="text-xs uppercase tracking-[0.2em] text-[#9A9A9A] font-medium transition-colors duration-500 group-hover:text-[#C9BCFF]">
          {label}
        </div>
      </div>

      {/* Progress bar: fills while the card is in view, brightens on hover */}
      <div className="absolute inset-x-0 bottom-0 h-[3px] bg-[#2A2A2A]/60">
        <div
          className={`h-full bg-gradient-to-r from-[#5530A7] to-[#7B5CFF] origin-left transition-transform duration-[1600ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
            inView ? 'scale-x-100' : 'scale-x-0'
          } opacity-40 group-hover:opacity-100`}
        />
      </div>
    </div>
  );
};

// Where each card flies in from as it scrolls into view
type RevealFrom = 'left' | 'right' | 'top' | 'bottom' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

const REVEAL_OFFSETS: Record<RevealFrom, gsap.TweenVars> = {
  left: { x: -160, rotate: -4 },
  right: { x: 160, rotate: 4 },
  top: { y: -110, rotate: -3 },
  bottom: { y: 130, rotate: 3 },
  'top-left': { x: -130, y: -90, rotate: -6 },
  'top-right': { x: 130, y: -90, rotate: 6 },
  'bottom-left': { x: -130, y: 110, rotate: -6 },
  'bottom-right': { x: 130, y: 110, rotate: 6 },
};

// 2×2 grids: each corner card comes from its own corner
const GRID_FROM: RevealFrom[] = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
// Industries: left column from the left, right column from the right, staggered vertically
const INDUSTRY_FROM: RevealFrom[] = ['left', 'top', 'bottom', 'right'];

const INDUSTRY_META: Record<string, { icon: React.ElementType; blurb: string }> = {
  'Food & Beverage': { icon: UtensilsCrossed, blurb: 'Menus, social campaigns & promos' },
  SaaS: { icon: Cloud, blurb: 'Ad creatives & product visuals' },
  'Real Estate': { icon: Building2, blurb: 'Brochures, listings & launches' },
  'Mechanical & Industrial': { icon: Factory, blurb: 'Company profiles & catalogs' },
};

// Moves a CSS spotlight (--mx / --my) to follow the cursor inside a card
const trackSpotlight = (e: React.MouseEvent<HTMLElement>) => {
  const el = e.currentTarget;
  const rect = el.getBoundingClientRect();
  el.style.setProperty('--mx', `${e.clientX - rect.left}px`);
  el.style.setProperty('--my', `${e.clientY - rect.top}px`);
};

const Spotlight: React.FC = () => (
  <div
    aria-hidden="true"
    className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
    style={{
      background:
        'radial-gradient(240px circle at var(--mx, 50%) var(--my, 50%), rgba(123,92,255,0.2), transparent 70%)',
    }}
  />
);

const SubHeading: React.FC<{ index: string; children: React.ReactNode }> = ({ index, children }) => (
  <div className="flex items-center gap-3 mb-6">
    <span className="text-[10px] font-mono text-[#5C5C5C]">{index}</span>
    <h3 data-subheading className="text-xs uppercase tracking-[0.25em] text-[#7B5CFF] font-semibold">{children}</h3>
    <span data-line className="h-px flex-1 max-w-24 bg-gradient-to-r from-[#7B5CFF]/60 to-transparent origin-left" />
  </div>
);

export const About: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const statementRef = useRef<HTMLParagraphElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion() || !statementRef.current) return;

    const ctx = gsap.context(() => {
      // Word by word scroll scrub reveal
      const statementEl = statementRef.current!;
      const words = statementEl.querySelectorAll('.scrub-word');

      gsap.fromTo(
        words,
        { opacity: 0.15, color: '#5C5C5C' },
        {
          opacity: 1,
          color: '#F5F5F5',
          stagger: 0.05,
          ease: 'none',
          scrollTrigger: {
            trigger: statementEl,
            start: 'top 80%',
            end: 'bottom 50%',
            scrub: 0.5,
          },
        }
      );

      // Replays when scrolling back into view from above
      const replay = { toggleActions: 'play none none reverse' as const };

      // Cards fly in from their own direction, staggered per group
      gsap.utils.toArray<HTMLElement>('[data-reveal-group]').forEach((group) => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: group, start: 'top 85%', ...replay },
        });
        group.querySelectorAll<HTMLElement>('[data-reveal]').forEach((card, i) => {
          const from = REVEAL_OFFSETS[(card.dataset.from as RevealFrom) || 'bottom'];
          tl.fromTo(
            card,
            { ...from, opacity: 0, scale: 0.85, filter: 'blur(8px)' },
            {
              x: 0,
              y: 0,
              rotate: 0,
              scale: 1,
              opacity: 1,
              filter: 'blur(0px)',
              duration: 1.1,
              ease: EASINGS.expoOut,
            },
            i * 0.12
          );
        });
      });

      // Sub-heading labels slide in from the left
      gsap.utils.toArray<HTMLElement>('[data-subheading]').forEach((heading) => {
        gsap.fromTo(
          heading,
          { x: -60, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.9,
            ease: EASINGS.expoOut,
            scrollTrigger: { trigger: heading, start: 'top 90%', ...replay },
          }
        );
      });

      // Heading rules draw in
      gsap.utils.toArray<HTMLElement>('[data-line]').forEach((line) => {
        gsap.fromTo(
          line,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1,
            ease: EASINGS.expoOut,
            scrollTrigger: { trigger: line, start: 'top 90%', ...replay },
          }
        );
      });

      // Proficiency meters fill
      gsap.utils.toArray<HTMLElement>('[data-bar]').forEach((bar) => {
        gsap.fromTo(
          bar,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.4,
            delay: 0.2,
            ease: EASINGS.expoOut,
            scrollTrigger: { trigger: bar, start: 'top 90%', ...replay },
          }
        );
      });

      // Quote card rises, then its words reveal one by one
      if (quoteRef.current) {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: quoteRef.current, start: 'top 85%', ...replay },
        });
        tl.fromTo(
          quoteRef.current,
          { x: 180, y: 60, rotate: 6, scale: 0.85, opacity: 0, filter: 'blur(8px)' },
          { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1, filter: 'blur(0px)', duration: 1.2, ease: EASINGS.expoOut }
        );
        tl.fromTo(
          quoteRef.current.querySelectorAll('.quote-word'),
          { yPercent: 60, opacity: 0, filter: 'blur(6px)' },
          { yPercent: 0, opacity: 1, filter: 'blur(0px)', duration: 0.6, ease: EASINGS.power3Out, stagger: 0.07 },
          '-=0.5'
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const getHobbyIcon = (iconName: string) => {
    switch (iconName) {
      case 'Gamepad2':
        return <Gamepad2 className="w-5 h-5 text-[#7B5CFF]" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-[#7B5CFF]" />;
      case 'BookOpen':
        return <BookOpen className="w-5 h-5 text-[#7B5CFF]" />;
      case 'Headphones':
        return <Headphones className="w-5 h-5 text-[#7B5CFF]" />;
      default:
        return <Sparkles className="w-5 h-5 text-[#7B5CFF]" />;
    }
  };

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative py-28 px-6 md:px-12 bg-[#161616] text-[#F5F5F5] border-t border-[#2A2A2A] overflow-x-clip"
    >
      <div className="max-w-[1440px] mx-auto">
        {/* Label */}
        <div className="flex items-center gap-3 text-xs tracking-[0.2em] font-medium text-[#7B5CFF] uppercase mb-10">
          <span>{ABOUT_DATA.label}</span>
          <div className="h-[1px] w-12 bg-[#7B5CFF]/40" />
        </div>

        {/* Large Statement Paragraph (Scrubbed Word by Word) */}
        <div className="max-w-5xl mb-24">
          <p
            ref={statementRef}
            className="font-display font-bold text-2xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight leading-[1.25] select-none"
          >
            {ABOUT_DATA.statement.split(' ').map((word, i) => (
              <span key={i} className="scrub-word inline-block mr-[0.28em] transition-colors">
                {word}
              </span>
            ))}
          </p>
        </div>

        {/* Stats Grid: 3+, 3, 4+ */}
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-20 border-b border-[#2A2A2A]"
        >
          {ABOUT_DATA.stats.map((stat) => (
            <StatCard key={stat.label} value={stat.value} label={stat.label} />
          ))}
        </div>

        {/* Industries & Languages Row */}
        <div className="py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 border-b border-[#2A2A2A]">
          {/* Industries (7 cols) */}
          <div className="lg:col-span-7">
            <SubHeading index="A">INDUSTRIES SERVED</SubHeading>
            <div data-reveal-group className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {ABOUT_DATA.industries.map((ind, idx) => {
                const meta = INDUSTRY_META[ind];
                const Icon = meta?.icon ?? Sparkles;
                return (
                  <div key={ind} data-reveal data-from={INDUSTRY_FROM[idx % INDUSTRY_FROM.length]}>
                    <div
                      onMouseMove={trackSpotlight}
                      className="group relative h-full overflow-hidden p-5 rounded-2xl bg-[#1F1F1F] border border-[#2A2A2A] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-[#7B5CFF]/70 hover:shadow-[0_18px_40px_-18px_rgba(123,92,255,0.55)]"
                    >
                      {/* Violet fill rising from the bottom */}
                      <div
                        aria-hidden="true"
                        className="absolute inset-0 bg-gradient-to-t from-[#7B5CFF]/25 via-[#7B5CFF]/5 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                      />
                      <Spotlight />
                      <div className="relative flex items-start gap-4">
                        <div className="shrink-0 w-11 h-11 rounded-xl grid place-items-center bg-[#161616] border border-[#2A2A2A] text-[#7B5CFF] transition-colors duration-500 group-hover:bg-[#7B5CFF] group-hover:border-[#7B5CFF] group-hover:text-white">
                          <Icon className="w-5 h-5 group-hover-wiggle" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-display font-bold text-base text-[#F5F5F5]">{ind}</span>
                            <ArrowUpRight className="w-4 h-4 shrink-0 text-[#7B5CFF] opacity-0 -translate-x-2 translate-y-2 transition-all duration-500 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0" />
                          </div>
                          <p className="text-sm text-[#9A9A9A] mt-1 pr-6 transition-colors duration-500 group-hover:text-[#C9BCFF]">
                            {meta?.blurb}
                          </p>
                        </div>
                      </div>
                      <span className="absolute right-4 bottom-3 font-mono text-[10px] text-[#3A3A3A] transition-colors duration-500 group-hover:text-[#7B5CFF]">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Languages (5 cols) */}
          <div className="lg:col-span-5">
            <SubHeading index="B">LANGUAGES</SubHeading>
            <div data-reveal-group className="flex flex-col gap-4">
              {ABOUT_DATA.languages.map((lang, idx) => (
                <div key={lang.name} data-reveal data-from={idx % 2 === 0 ? 'right' : 'bottom-right'}>
                  <div
                    onMouseMove={trackSpotlight}
                    className="group relative overflow-hidden p-5 rounded-2xl bg-[#1F1F1F] border border-[#2A2A2A] transition-all duration-500 hover:border-[#7B5CFF]/70 hover:shadow-[0_18px_40px_-18px_rgba(123,92,255,0.55)]"
                  >
                    <Spotlight />
                    {/* Outlined language code, fills violet on hover */}
                    <span
                      aria-hidden="true"
                      className="absolute right-4 top-1/2 -translate-y-1/2 font-display font-black text-6xl leading-none text-stroke text-[#2E2E2E] transition-all duration-500 group-hover:text-[#7B5CFF] group-hover-fill group-hover:opacity-25 group-hover:-translate-x-2"
                    >
                      {lang.code}
                    </span>
                    <div className="relative flex items-center gap-3 mb-1">
                      <Languages className="w-4 h-4 text-[#7B5CFF]" />
                      <span className="font-display font-bold text-lg text-[#F5F5F5]">{lang.name}</span>
                    </div>
                    <div className="relative text-xs text-[#9A9A9A] font-mono tracking-wider mb-4">{lang.level}</div>
                    {/* Proficiency meter */}
                    <div className="relative flex items-center gap-3 pr-24">
                      <div className="flex-1 h-1.5 rounded-full bg-[#2A2A2A] overflow-hidden">
                        <div
                          data-bar
                          className="h-full rounded-full bg-gradient-to-r from-[#5530A7] to-[#7B5CFF] origin-left transition-[filter,box-shadow] duration-500 group-hover:brightness-125 group-hover:shadow-[0_0_12px_#7B5CFF]"
                          style={{ width: `${lang.proficiency}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-mono text-[#5C5C5C] transition-colors group-hover:text-[#C9BCFF]">
                        {lang.proficiency}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Off The Clock Row & Quote */}
        <div className="pt-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          {/* Off The Clock (7 cols) */}
          <div className="lg:col-span-7">
            <SubHeading index="C">OFF THE CLOCK</SubHeading>
            <div data-reveal-group className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {ABOUT_DATA.offTheClock.map((item, idx) => (
                <div key={item.title} data-reveal data-from={GRID_FROM[idx % GRID_FROM.length]}>
                  <div
                    onMouseMove={trackSpotlight}
                    className="group relative h-full overflow-hidden flex items-center gap-4 p-5 rounded-2xl bg-[#1F1F1F] border border-[#2A2A2A] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-[#7B5CFF]/70 hover:shadow-[0_18px_40px_-18px_rgba(123,92,255,0.55)]"
                  >
                    <Spotlight />
                    <div className="relative shrink-0 w-12 h-12 rounded-xl grid place-items-center bg-[#161616] border border-[#2A2A2A] transition-colors duration-500 group-hover:bg-[#7B5CFF] group-hover:border-[#7B5CFF] [&_svg]:transition-colors [&_svg]:duration-500 group-hover:[&_svg]:text-white">
                      <span className="group-hover-wiggle inline-flex">{getHobbyIcon(item.icon)}</span>
                    </div>
                    <div className="relative min-w-0">
                      <div className="text-[10px] font-mono text-[#5C5C5C] mb-0.5 transition-colors group-hover:text-[#7B5CFF]">
                        {String(idx + 1).padStart(2, '0')}
                      </div>
                      <span className="block text-sm sm:text-base font-medium text-[#F5F5F5] transition-transform duration-500 group-hover:translate-x-1">
                        {item.title}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quote Block (5 cols) */}
          <div ref={quoteRef} className="lg:col-span-5 flex">
            <div className="animated-border group relative w-full flex flex-col justify-center p-8 sm:p-10 rounded-3xl overflow-hidden">
              {/* Ambient glow */}
              <div
                aria-hidden="true"
                className="absolute -top-16 -left-16 w-56 h-56 rounded-full bg-[#7B5CFF]/20 blur-[80px] pointer-events-none opacity-60 transition-opacity duration-700 group-hover:opacity-100"
              />
              {/* Giant floating quotation mark */}
              <Quote
                aria-hidden="true"
                className="animate-float absolute right-5 bottom-5 w-28 h-28 text-[#7B5CFF]/15 pointer-events-none"
                strokeWidth={1}
              />
              <Quote aria-hidden="true" className="relative w-8 h-8 text-[#7B5CFF] fill-[#7B5CFF] mb-5 rotate-180" />
              <blockquote className="relative font-display font-bold text-2xl sm:text-3xl text-[#F5F5F5] leading-snug mb-6">
                {ABOUT_DATA.quote.text.split(' ').map((word, i) => (
                  <React.Fragment key={i}>
                    <span className="quote-word inline-block">{word}</span>{' '}
                  </React.Fragment>
                ))}
              </blockquote>
              <div className="relative flex items-center gap-3 text-xs font-mono tracking-widest uppercase text-[#9A9A9A]">
                <span data-line className="h-px w-10 bg-[#7B5CFF] origin-left" />
                {ABOUT_DATA.quote.author}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
