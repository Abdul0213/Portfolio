'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { EASINGS, DURATIONS, prefersReducedMotion } from '../lib/motion';
import { MagneticButton } from './MagneticButton';
import { PORTFOLIO_LINKS } from '../data/portfolio';
import { useSmoothScroll } from './SmoothScroll';
import { ArrowDownRight, Download } from 'lucide-react';
import heroKeyArt from '../../public/images/hero-key-art-clean.jpg';

gsap.registerPlugin(ScrollTrigger);

// Short words stacked so the headline fits the dark space left of the subject
const HEADLINE_LINES: { text: string; className?: string }[][] = [
  [{ text: 'BOLD' }],
  [{ text: 'VISUALS' }],
  [{ text: 'THAT', className: 'text-stroke' }],
  [{ text: 'WORK.', className: 'text-[#7B5CFF]' }],
];

// Halo position in the key art, as fractions of the image (centre) and of its width (radius)
const HALO = { cx: 0.5005, cy: 0.419, r: 0.1605 };
// Must match the image's object-position below
const ART_POSITION = { x: 0.5, y: 0.3 };
const HALO_WAVES = 5;
// Seconds per wave; keep in sync with the halo-wave animation duration in globals.css
const HALO_WAVE_DURATION = 11;

interface HeroProps {
  isLoaded: boolean;
}

/**
 * Full-bleed key-art hero. On desktop the copy sits in the dark space either side of
 * the centred subject (left: identity + headline, right: intro, quick facts + actions);
 * on smaller screens it stacks along the bottom over a stronger scrim.
 */
export const Hero: React.FC<HeroProps> = ({ isLoaded }) => {
  const containerRef = useRef<HTMLElement>(null);
  const artRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const haloRef = useRef<HTMLDivElement>(null);

  const { scrollTo } = useSmoothScroll();

  // Intro choreography when the preloader finishes
  useEffect(() => {
    if (!isLoaded || !containerRef.current) return;

    if (prefersReducedMotion()) {
      gsap.set([artRef.current, contentRef.current], { opacity: 1 });
      return;
    }

    const tl = gsap.timeline();

    // 1. Key art settles from a slow zoom while fading up out of black
    tl.fromTo(
      artRef.current,
      { scale: 1.15, opacity: 0 },
      { scale: 1, opacity: 1, duration: 2.2, ease: 'power3.out' },
      0
    );

    // 2. Headline characters rise out of their line masks
    const chars = headlineRef.current?.querySelectorAll('.hero-char');
    if (chars?.length) {
      tl.fromTo(
        chars,
        { yPercent: 120, rotate: 8, opacity: 0 },
        {
          yPercent: 0,
          rotate: 0,
          opacity: 1,
          duration: DURATIONS.hero,
          ease: EASINGS.expoOut,
          stagger: 0.025,
        },
        0.5
      );
    }

    // 3. Label, caption, copy and buttons fade up
    const items = contentRef.current?.querySelectorAll('.hero-fade-up');
    if (items?.length) {
      tl.fromTo(
        items,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: DURATIONS.base, ease: EASINGS.power4Out, stagger: 0.08 },
        0.8
      );
    }
  }, [isLoaded]);

  // Keep the halo waves centred on the halo: replicate object-cover + object-position
  // to find where the halo lands inside the art layer at the current size
  useEffect(() => {
    const halo = haloRef.current;
    const layer = halo?.parentElement;
    if (!halo || !layer) return;

    const place = () => {
      const W = layer.clientWidth;
      const H = layer.clientHeight;
      const scale = Math.max(W / heroKeyArt.width, H / heroKeyArt.height);
      const rw = heroKeyArt.width * scale;
      const rh = heroKeyArt.height * scale;
      const left = (W - rw) * ART_POSITION.x;
      const top = (H - rh) * ART_POSITION.y;
      // The container is 4× the halo so the fade mask covers the whole area the
      // waves expand into (up to 3.2×); each wave starts at the halo size, centred inside it
      const r = HALO.r * rw;
      const size = r * 8;
      halo.style.width = halo.style.height = `${size}px`;
      halo.style.left = `${left + HALO.cx * rw - size / 2}px`;
      halo.style.top = `${top + HALO.cy * rh - size / 2}px`;
    };

    place();
    const ro = new ResizeObserver(place);
    ro.observe(layer);
    return () => ro.disconnect();
  }, []);

  // Scroll parallax: art drifts slower than the page and zooms in slightly,
  // copy lifts away and fades as the hero scrolls out
  useEffect(() => {
    if (prefersReducedMotion() || !containerRef.current) return;

    const ctx = gsap.context(() => {
      const scrub = { trigger: containerRef.current, start: 'top top', end: 'bottom top' };
      gsap.to('.hero-art-inner', { yPercent: 12, scale: 1.08, ease: 'none', scrollTrigger: { ...scrub, scrub: 0.6 } });
      gsap.to(contentRef.current, { y: -80, opacity: 0, ease: 'none', scrollTrigger: { ...scrub, end: '70% top', scrub: 0.5 } });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="top"
      ref={containerRef}
      className="relative min-h-[100svh] lg:h-[100svh] lg:min-h-[40rem] w-full overflow-hidden bg-[#0B0D12]"
    >
      {/* Full-bleed key art */}
      <div ref={artRef} className="absolute inset-0 opacity-0">
        <div className="hero-art-inner absolute inset-0 will-change-transform">
          <Image
            src={heroKeyArt}
            alt="Key art by Abdul Rehman — a young man in an Argentina shirt before a glowing violet halo"
            fill
            priority
            placeholder="blur"
            sizes="100vw"
            className="object-cover object-[50%_30%]"
          />

          {/* Purple waves pulsing out of the halo. Faded towards the bottom so they read
              as light around the halo rather than crossing the subject's face. */}
          <div ref={haloRef} aria-hidden="true" className="halo-waves absolute pointer-events-none">
            {/* Soft breathing glow radiating from behind the halo's edge */}
            <span className="halo-glow" />
            {Array.from({ length: HALO_WAVES }).map((_, i) => (
              <span
                key={i}
                className="halo-wave"
                style={{ animationDelay: `${(i * HALO_WAVE_DURATION) / HALO_WAVES}s` }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Scrims: top for the nav, bottom band for the copy */}
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#0B0D12]/80 to-transparent pointer-events-none" />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[70%] lg:h-[30%] bg-gradient-to-t from-[#0E0E0E] via-[#0E0E0E]/75 lg:via-[#0E0E0E]/40 to-transparent pointer-events-none" />
      {/* Desktop side vignettes keep the copy columns readable */}
      <div aria-hidden="true" className="hidden lg:block absolute inset-0 bg-[linear-gradient(90deg,rgba(11,13,18,0.75)_0%,rgba(11,13,18,0)_32%,rgba(11,13,18,0)_68%,rgba(11,13,18,0.75)_100%)] pointer-events-none" />

      {/* Bottom band copy */}
      <div
        ref={contentRef}
        className="relative z-10 min-h-[100svh] lg:min-h-0 lg:h-full max-w-[90rem] mx-auto px-6 md:px-12 pt-28 pb-8 flex flex-col"
      >
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 content-end lg:content-center items-end lg:items-center">
          {/* Left: identity + headline */}
          <div className="lg:col-span-4 min-w-0 @container">
            <div className="hero-fade-up flex items-center gap-3 text-xs tracking-[0.2em] font-medium text-[#B8B3C9] uppercase mb-4">
              <span className="shrink-0 w-2 h-2 rounded-full bg-[#7B5CFF] shadow-[0_0_10px_#7B5CFF]" />
              <span>Graphic Designer · Lahore, Pakistan</span>
            </div>

            <h1
              ref={headlineRef}
              data-cursor="headline"
              aria-label="Bold visuals that work."
              className="font-display font-extrabold text-[#F5F5F5] uppercase tracking-[-0.03em] leading-[0.95] text-[clamp(2.5rem,14cqw,4.5rem)] lg:text-[clamp(2.5rem,14.5cqw,7rem)] select-none drop-shadow-[0_4px_30px_rgba(0,0,0,0.6)]"
            >
              {HEADLINE_LINES.map((line, lineIdx) => (
                <span key={lineIdx} aria-hidden="true" className="block overflow-hidden pb-[0.06em] -mb-[0.06em]">
                  {line.map((segment, segIdx) => (
                    <span key={segIdx} className={segment.className}>
                      {segment.text.split(' ').map((word, wordIdx, words) => (
                        <React.Fragment key={wordIdx}>
                          <span className="inline-block whitespace-nowrap">
                            {Array.from(word).map((c, i) => (
                              <span key={i} className="hero-char inline-block will-change-transform">
                                {c}
                              </span>
                            ))}
                          </span>
                          {wordIdx < words.length - 1 && ' '}
                        </React.Fragment>
                      ))}
                    </span>
                  ))}
                </span>
              ))}
            </h1>

            <div className="hero-fade-up mt-6 inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#0E0E0E]/70 backdrop-blur-sm border border-white/10 text-xs font-medium select-none">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <span className="text-[#C9C5D6]">Available for freelance &amp; full-time roles</span>
            </div>
          </div>

          {/* Right: featured-piece caption, intro and actions (centre left clear for the subject) */}
          <div className="lg:col-span-3 lg:col-start-10 lg:-ml-12 min-w-0 @container">
            <div className="hero-fade-up flex items-center gap-3 mb-2">
              <span className="text-xs font-mono tracking-widest text-[#7B5CFF] uppercase">(Hello, I&apos;m)</span>
              <span className="h-px flex-1 bg-white/15" />
            </div>
            <h2 className="hero-fade-up font-display font-extrabold text-3xl sm:text-4xl lg:text-[clamp(1rem,8.4cqw,2.25rem)] lg:whitespace-nowrap text-white tracking-tight leading-none">
              Abdul <span className="text-[#7B5CFF]">Rehman</span>
            </h2>
            <p className="hero-fade-up mt-2 font-display font-bold text-base sm:text-lg lg:text-base text-white leading-snug">
              Design that gets noticed — and gets results.
            </p>
            <p className="hero-fade-up mt-2.5 text-sm sm:text-base lg:text-sm text-white/90 leading-relaxed">
              A self-taught graphic designer with 3+ years of crafting brand identities,
              social media campaigns, ad creatives and 3D product mockups for brands across
              Pakistan and the UAE.
            </p>

            {/* Quick facts */}
            <div className="hero-fade-up mt-3.5 grid grid-cols-3 gap-px rounded-xl overflow-hidden border border-white/10 bg-white/10 text-center">
              {[
                { value: '3+', label: 'Years' },
                { value: 'PK & UAE', label: 'Clients' },
                { value: 'Lahore', label: 'Based in' },
              ].map((fact) => (
                <div key={fact.label} className="bg-[#0E0E0E]/70 backdrop-blur-sm px-2 py-2.5">
                  <div className="font-display font-bold text-sm sm:text-base lg:text-sm text-white leading-tight">{fact.value}</div>
                  <div className="mt-1 text-[0.625rem] font-mono tracking-widest text-white/70 uppercase">{fact.label}</div>
                </div>
              ))}
            </div>

            <div className="hero-fade-up flex flex-wrap items-center gap-2.5 sm:gap-3 pt-4">
              <MagneticButton
                href="#work"
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo('#work', -80);
                }}
                variant="primary"
                className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider"
              >
                <span>View My Work</span>
                <ArrowDownRight className="w-4 h-4 ml-1" />
              </MagneticButton>
              <MagneticButton
                href={PORTFOLIO_LINKS.cv}
                download="Abdul_Rehman_CV.pdf"
                variant="outline"
                className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider bg-[#0E0E0E]/60 backdrop-blur-sm"
              >
                <span>Download CV</span>
                <Download className="w-3.5 h-3.5 ml-1" />
              </MagneticButton>
            </div>
          </div>
        </div>

        {/* Bottom bar: scroll hint & heritage */}
        <div className="hero-fade-up mt-8 flex justify-between items-center pt-5 border-t border-white/10 text-xs tracking-[0.2em] uppercase font-mono text-[#6E6A7C]">
          <div className="flex items-center gap-3">
            <span className="text-[#9A9A9A]">SCROLL</span>
            <div className="w-8 h-[1px] bg-[#2A2A2A] relative overflow-hidden">
              <span className="absolute inset-0 bg-[#7B5CFF] -translate-x-full animate-[scroll-hint_1.8s_ease-in-out_infinite]" />
            </div>
          </div>
          <div>DESIGNING SINCE 2022</div>
        </div>
      </div>
    </section>
  );
};
