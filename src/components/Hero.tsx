import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { EASINGS, DURATIONS, prefersReducedMotion } from '../lib/motion';
import { HeroShader } from './HeroShader';
import { MagneticButton } from './MagneticButton';
import { PORTFOLIO_LINKS, HERO_PROFILE_IMAGE } from '../data/portfolio';
import { useSmoothScroll } from './SmoothScroll';
import { ArrowDownRight, Download } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// Headline split into display lines; each segment can carry its own styling.
const HEADLINE_LINES: { text: string; className?: string }[][] = [
  [{ text: 'BOLD VISUALS' }],
  [{ text: "THAT DON'T JUST" }],
  [{ text: 'LOOK GOOD', className: 'text-stroke' }, { text: ' —' }],
  [{ text: 'THEY ' }, { text: 'WORK.', className: 'text-[#7B5CFF]' }],
];

interface HeroProps {
  isLoaded: boolean;
}

export const Hero: React.FC<HeroProps> = ({ isLoaded }) => {
  const containerRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const photoFrameRef = useRef<HTMLDivElement>(null);
  const photoImgRef = useRef<HTMLImageElement>(null);
  const metaElementsRef = useRef<HTMLDivElement>(null);
  const [photoFailed, setPhotoFailed] = useState(false);

  const { scrollTo } = useSmoothScroll();

  // Intro choreography when preloader finishes
  useEffect(() => {
    if (!isLoaded || !containerRef.current) return;

    if (prefersReducedMotion()) {
      gsap.to([headlineRef.current, photoFrameRef.current, metaElementsRef.current], {
        opacity: 1,
        duration: 0.5,
      });
      return;
    }

    const tl = gsap.timeline();

    // 1. Split headline chars
    const headline = headlineRef.current;
    if (headline) {
      const charElements = headline.querySelectorAll('.hero-char');
      tl.fromTo(
        charElements,
        {
          yPercent: 120,
          rotate: 8,
          opacity: 0,
        },
        {
          yPercent: 0,
          rotate: 0,
          opacity: 1,
          duration: DURATIONS.hero,
          ease: EASINGS.expoOut,
          stagger: 0.02,
        },
        0
      );
    }

    // 2. Photo frame reveal via clip-path inset at 0.4s
    if (photoFrameRef.current && photoImgRef.current) {
      tl.fromTo(
        photoFrameRef.current,
        {
          clipPath: 'inset(100% 0% 0% 0%)',
          opacity: 0,
        },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          opacity: 1,
          duration: 1.2,
          ease: EASINGS.power4Out,
        },
        0.4
      );

      tl.fromTo(
        photoImgRef.current,
        { scale: 1.4 },
        { scale: 1.0, duration: 1.2, ease: EASINGS.power4Out },
        0.4
      );
    }

    // 3. Meta elements (label, subtext, buttons, status) fade up at 0.7s
    if (metaElementsRef.current) {
      const items = metaElementsRef.current.querySelectorAll('.hero-fade-up');
      tl.fromTo(
        items,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: DURATIONS.base,
          ease: EASINGS.power4Out,
          stagger: 0.08,
        },
        0.7
      );
    }
  }, [isLoaded]);

  // Scroll scrub parallax (desktop only) & 3D tilt
  useEffect(() => {
    if (prefersReducedMotion() || !containerRef.current) return;

    const mm = gsap.matchMedia();

    mm.add('(min-width: 1024px)', () => {
      // Parallax scrub as user scrolls past hero
      gsap.to(headlineRef.current, {
        y: -120,
        opacity: 0.2,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.5,
        },
      });

      gsap.to(photoFrameRef.current, {
        y: -60,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.8,
        },
      });
    });

    return () => mm.revert();
  }, [isLoaded]);

  // 3D Photo tilt following mouse
  const handlePhotoMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion() || !photoFrameRef.current) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const frame = photoFrameRef.current;
    const rect = frame.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const rotX = (y / (rect.height / 2)) * -8;
    const rotY = (x / (rect.width / 2)) * 8;

    gsap.to(frame, {
      rotateX: rotX,
      rotateY: rotY,
      duration: 0.5,
      ease: 'power2.out',
      transformPerspective: 1000,
    });
  };

  const handlePhotoMouseLeave = () => {
    if (prefersReducedMotion() || !photoFrameRef.current) return;
    gsap.to(photoFrameRef.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.8,
      ease: EASINGS.elasticOut,
    });
  };

  return (
    <section
      id="top"
      ref={containerRef}
      className="relative min-h-screen w-full flex flex-col justify-between pt-28 pb-12 px-6 md:px-12 overflow-hidden"
    >
      {/* Liquid WebGL Background Shader */}
      <HeroShader />

      {/* Top Main Grid */}
      <div className="relative z-10 max-w-[1440px] w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center my-auto">
        {/* Left Column: Headlines & Copy (7 cols) */}
        <div className="lg:col-span-8 xl:col-span-9 flex flex-col justify-center @container min-w-0">
          {/* Top Label */}
          <div ref={metaElementsRef} className="flex flex-col gap-4">
            <div className="hero-fade-up flex items-start sm:items-center gap-3 text-xs leading-relaxed tracking-[0.2em] font-medium text-[#9A9A9A] uppercase">
              <span className="shrink-0 mt-[0.45em] sm:mt-0 w-2 h-2 rounded-full bg-[#7B5CFF] shadow-[0_0_10px_#7B5CFF]" />
              <span>(PORTFOLIO 2026) — GRAPHIC DESIGNER BASED IN LAHORE, PAKISTAN</span>
            </div>

            {/* Giant Display Headline — sized to its column so each line stays intact */}
            <h1
              ref={headlineRef}
              data-cursor="headline"
              aria-label="Bold visuals that don't just look good — they work."
              className="font-display font-extrabold text-[#F5F5F5] uppercase tracking-[-0.03em] leading-[0.95] text-[clamp(2.25rem,6.6cqw,7.5rem)] my-4 select-none"
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

            {/* Subtext */}
            <p className="hero-fade-up max-w-2xl text-base md:text-lg text-[#9A9A9A] leading-relaxed font-body mt-2">
              Self-taught graphic designer with 3+ years of experience crafting brand
              identities, social media campaigns, ad creatives, UI/UX presentations and 3D
              product mockups for brands across Pakistan and the UAE.
            </p>

            {/* Action Buttons & Status */}
            <div className="hero-fade-up flex flex-wrap items-center gap-4 sm:gap-6 pt-4">
              <MagneticButton
                href="#work"
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo('#work', -80);
                }}
                variant="primary"
                className="px-7 py-3.5 text-xs font-semibold uppercase tracking-wider"
              >
                <span>View My Work</span>
                <ArrowDownRight className="w-4 h-4 ml-1" />
              </MagneticButton>

              {/* CV Download button */}
              <MagneticButton
                href={PORTFOLIO_LINKS.cv}
                download="Abdul_Rehman_CV.pdf"
                variant="outline"
                className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider"
              >
                <span>Download CV</span>
                <Download className="w-3.5 h-3.5 ml-1" />
              </MagneticButton>

              {/* Status Pill */}
              <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#161616]/90 border border-[#2A2A2A] text-xs font-medium text-[#F5F5F5] select-none">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                </span>
                <span className="text-[#9A9A9A]">Available for freelance &amp; full-time roles</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Tall Profile Frame (4 cols) */}
        <div
          className="lg:col-span-4 xl:col-span-3 flex justify-center lg:justify-end"
          onMouseMove={handlePhotoMouseMove}
          onMouseLeave={handlePhotoMouseLeave}
        >
          <div
            ref={photoFrameRef}
            className="relative w-[260px] sm:w-[300px] lg:w-full lg:max-w-[320px] aspect-[3/4] rounded-2xl p-[1.5px] bg-gradient-to-b from-[#7B5CFF] via-[#5530A7]/40 to-transparent shadow-[0_0_50px_rgba(123,92,255,0.25)] overflow-hidden group select-none"
          >
            <div className="w-full h-full rounded-[15px] overflow-hidden bg-[#161616] relative">
              {!photoFailed ? (
                <img
                  ref={photoImgRef}
                  src={HERO_PROFILE_IMAGE}
                  alt="Abdul Rehman Graphic Designer"
                  onError={() => setPhotoFailed(true)}
                  className="w-full h-full object-cover object-top grayscale contrast-110 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                />
              ) : (
                /* Fallback giant outlined AR monogram */
                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-[#1F1F1F] to-[#0E0E0E] text-stroke font-display text-8xl font-black">
                  <span>AR</span>
                  <span className="text-xs uppercase tracking-widest text-[#7B5CFF] mt-4 font-mono font-medium">
                    Creative Engine
                  </span>
                </div>
              )}

              {/* Bottom Scrim with Location */}
              <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-[#0E0E0E] via-[#0E0E0E]/80 to-transparent flex justify-between items-end">
                <div>
                  <div className="font-display font-bold text-sm text-white">Abdul Rehman</div>
                  <div className="text-[11px] text-[#9A9A9A] tracking-wider uppercase">Graphic Designer</div>
                </div>
                <div className="w-2 h-2 rounded-full bg-[#7B5CFF]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar: SCROLL Loop Indicator & Heritage */}
      <div className="relative z-10 max-w-[1440px] w-full mx-auto flex justify-between items-center pt-8 border-t border-[#2A2A2A]/50 text-xs tracking-[0.2em] uppercase font-mono text-[#5C5C5C]">
        <div className="flex items-center gap-3">
          <span className="text-[#9A9A9A]">SCROLL</span>
          <div className="w-8 h-[1px] bg-[#2A2A2A] relative overflow-hidden">
            <span className="absolute inset-0 bg-[#7B5CFF] -translate-x-full animate-[scroll-hint_1.8s_ease-in-out_infinite]" />
          </div>
        </div>
        <div>DESIGNING SINCE 2022</div>
      </div>
    </section>
  );
};
