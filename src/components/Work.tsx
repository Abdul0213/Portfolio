'use client';

import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PROJECTS_DATA, WORK_CATEGORIES, Project, PORTFOLIO_LINKS } from '../data/portfolio';
import { ProjectModal } from './ProjectModal';
import { prefersReducedMotion } from '../lib/motion';
import { ArrowUpRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const Work: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [activeCardIndex, setActiveCardIndex] = useState<number>(0);

  const containerRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const parallaxBgRef = useRef<HTMLDivElement>(null);
  const behanceRef = useRef<HTMLDivElement>(null);

  // First three distinct project images for the Behance CTA preview stack
  const behancePreviews = Array.from(new Set(PROJECTS_DATA.map((p) => p.image))).slice(0, 3);

  // Behance CTA reveal: replays every time it scrolls into view
  useEffect(() => {
    if (prefersReducedMotion() || !behanceRef.current) return;

    const ctx = gsap.context(() => {
      gsap
        .timeline({
          defaults: { ease: 'expo.out' },
          scrollTrigger: {
            trigger: behanceRef.current,
            start: 'top 85%',
            end: 'bottom 10%',
            toggleActions: 'play reverse play reverse',
            // This trigger is created before the horizontal pin (and the pin is rebuilt on
            // filter changes), so refresh it last; otherwise its start/end are measured
            // without the pin spacer and the card never reveals
            refreshPriority: -1,
          },
        })
        .fromTo('.behance-cta', { opacity: 0, y: 80, scale: 0.94 }, { opacity: 1, y: 0, scale: 1, duration: 1.1 })
        .fromTo('.behance-reveal', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.1 }, '<0.2')
        .fromTo(
          '.behance-thumb',
          { opacity: 0, y: 120, rotate: (i: number) => (i - 1) * 25 },
          { opacity: 1, y: 0, rotate: 0, duration: 1.1, stagger: 0.12, ease: 'back.out(1.4)' },
          '<0.1'
        );
    }, behanceRef);

    return () => ctx.revert();
  }, []);

  const filteredProjects = selectedCategory === 'All'
    ? PROJECTS_DATA
    : PROJECTS_DATA.filter((p) => p.category === selectedCategory);

  // Desktop horizontal scroll pinning
  useEffect(() => {
    if (prefersReducedMotion() || !containerRef.current || !trackRef.current) return;

    const mm = gsap.matchMedia();

    mm.add('(min-width: 1024px)', () => {
      const track = trackRef.current;
      const section = containerRef.current;
      if (!track || !section) return;

      const getScrollAmount = () => -(track.scrollWidth - window.innerWidth + 120);

      const tween = gsap.to(track, {
        x: getScrollAmount,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          pin: true,
          scrub: 1,
          start: 'top top',
          end: () => `+=${Math.max(window.innerWidth * 1.8, track.scrollWidth - window.innerWidth + 200)}`,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const index = Math.min(
              filteredProjects.length - 1,
              Math.floor(self.progress * filteredProjects.length)
            );
            setActiveCardIndex(index);
          },
        },
      });

      // Background parallax outlined "WORK"
      if (parallaxBgRef.current) {
        gsap.to(parallaxBgRef.current, {
          x: -300,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => `+=${track.scrollWidth}`,
            scrub: 1.5,
          },
        });
      }

      return () => {
        tween.kill();
      };
    });

    return () => mm.revert();
  }, [filteredProjects.length, selectedCategory]);

  // Recalculate ScrollTrigger on filter change
  useEffect(() => {
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);
    return () => clearTimeout(timer);
  }, [selectedCategory]);

  const handleNextProject = () => {
    if (!activeProject) return;
    const currentIndex = filteredProjects.findIndex((p) => p.id === activeProject.id);
    const nextIndex = (currentIndex + 1) % filteredProjects.length;
    setActiveProject(filteredProjects[nextIndex]);
  };

  const handlePrevProject = () => {
    if (!activeProject) return;
    const currentIndex = filteredProjects.findIndex((p) => p.id === activeProject.id);
    const prevIndex = (currentIndex - 1 + filteredProjects.length) % filteredProjects.length;
    setActiveProject(filteredProjects[prevIndex]);
  };

  return (
    <>
    <section
      id="work"
      ref={containerRef}
      className="relative py-24 bg-[#0E0E0E] text-[#F5F5F5] border-t border-[#2A2A2A] overflow-hidden"
    >
      {/* Background Parallax Giant Outlined Word WORK */}
      <div
        ref={parallaxBgRef}
        aria-hidden="true"
        className="absolute top-1/2 -translate-y-1/2 left-0 whitespace-nowrap font-display font-black text-[22vw] text-stroke opacity-15 pointer-events-none select-none z-0"
      >
        SELECTED WORK ✦ CREATIVE ✦
      </div>

      <div className="relative z-10 max-w-[1536px] mx-auto px-6 md:px-12 mb-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-3 text-xs tracking-[0.2em] font-medium text-[#7B5CFF] uppercase mb-4">
              <span>(03) — SELECTED WORK</span>
              <div className="h-[1px] w-12 bg-[#7B5CFF]/40" />
            </div>
            <h2 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl uppercase tracking-tight text-[#F5F5F5]">
              FEATURED <br className="hidden md:block" />
              PROJECTS <span className="text-[#7B5CFF] whitespace-nowrap">({String(filteredProjects.length).padStart(2, '0')})</span>
            </h2>
          </div>

          {/* Desktop Progress Counter */}
          <div className="hidden lg:flex items-center gap-2 text-xs font-mono tracking-widest text-[#9A9A9A]">
            <span className="text-xl font-bold text-[#F5F5F5]">
              {String(activeCardIndex + 1).padStart(2, '0')}
            </span>
            <span>/</span>
            <span>{String(filteredProjects.length).padStart(2, '0')}</span>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none">
          {WORK_CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-xs font-medium tracking-wider whitespace-nowrap transition-all duration-300 select-none cursor-pointer ${
                selectedCategory === category
                  ? 'bg-[#7B5CFF] text-white shadow-[0_0_15px_rgba(123,92,255,0.4)]'
                  : 'bg-[#161616] text-[#9A9A9A] border border-[#2A2A2A] hover:text-white hover:border-[#7B5CFF]/50'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop Horizontal Track / Mobile Vertical Stack */}
      <div className="relative z-10 px-6 md:px-12">
        {/* DESKTOP VIEW: Horizontal Pinned Track */}
        <div className="hidden lg:block">
          <div
            ref={trackRef}
            className="flex items-center gap-8 pl-4 will-change-transform"
          >
            {filteredProjects.map((project, idx) => (
              <div
                key={project.id}
                onClick={() => setActiveProject(project)}
                data-cursor="project"
                data-cursor-label="VIEW ↗"
                className={`group relative shrink-0 rounded-3xl overflow-hidden bg-[#161616] border border-[#2A2A2A] hover:border-[#7B5CFF] transition-all duration-500 cursor-pointer ${
                  idx % 2 === 0
                    ? 'w-[42vw] max-w-[620px] aspect-[4/3]'
                    : 'w-[38vw] max-w-[560px] aspect-[16/10]'
                }`}
              >
                {/* Fallback & Image */}
                <div
                  className="w-full h-full relative overflow-hidden"
                  style={{ background: project.gradientFallback }}
                >
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />

                  {/* Fallback Monogram if image hidden */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                    <span className="font-display font-black text-9xl text-stroke">
                      {project.number}
                    </span>
                  </div>

                  {/* Violet Overlay Sweep on hover */}
                  <div className="absolute inset-0 bg-[#7B5CFF]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none" />

                  {/* Top Meta info */}
                  <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-10">
                    <span className="px-3.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs font-mono text-white">
                      {project.number}
                    </span>
                    <span className="px-3.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs font-mono text-[#9A9A9A]">
                      {project.year}
                    </span>
                  </div>

                  {/* Bottom Text Rollup Scrim */}
                  <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 bg-gradient-to-t from-[#0E0E0E] via-[#0E0E0E]/80 to-transparent flex flex-col justify-end z-10">
                    <div className="text-xs uppercase tracking-widest text-[#7B5CFF] font-semibold mb-2">
                      {project.category}
                    </div>
                    <h3 className="font-display font-bold text-2xl md:text-3xl text-white group-hover:text-[#7B5CFF] transition-colors leading-tight">
                      {project.title}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MOBILE VIEW: Vertical Stack with Clip-path reveal */}
        <div className="lg:hidden flex flex-col gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => setActiveProject(project)}
              className="group relative rounded-2xl overflow-hidden bg-[#161616] border border-[#2A2A2A] active:scale-[0.98] transition-all duration-300"
            >
              <div
                className="w-full aspect-[4/3] relative"
                style={{ background: project.gradientFallback }}
              >
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />

                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-xs font-mono text-white">
                    {project.number}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-xs font-mono text-[#7B5CFF]">
                    {project.category}
                  </span>
                </div>

                <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-black via-black/70 to-transparent">
                  <h3 className="font-display font-bold text-xl text-white">
                    {project.title}
                  </h3>
                  <div className="text-xs text-[#9A9A9A] mt-1">{project.year}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Full-Screen Project Modal */}
      <ProjectModal
        project={activeProject}
        onClose={() => setActiveProject(null)}
        onNext={handleNextProject}
        onPrev={handlePrevProject}
        currentIndex={
          activeProject
            ? filteredProjects.findIndex((p) => p.id === activeProject.id)
            : 0
        }
        totalProjects={filteredProjects.length}
      />
    </section>

      {/* Behance CTA card: spinning glow border, marquee backdrop, fanned project previews */}
      <div ref={behanceRef} className="relative z-10 px-6 md:px-12 pb-24 bg-[#0E0E0E] overflow-x-clip">
        <div className="max-w-[1440px] mx-auto">
          <a
            href={PORTFOLIO_LINKS.behance}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="pointer"
            aria-label="See more of my work on Behance (opens in a new tab)"
            className="behance-cta behance-card group relative block rounded-[2rem] overflow-hidden select-none shadow-[0_30px_80px_-20px_rgba(123,92,255,0.45)] hover:shadow-[0_40px_120px_-20px_rgba(123,92,255,0.7)] transition-shadow duration-500"
          >
            {/* Outlined marquee rows in the background */}
            <div aria-hidden="true" className="absolute inset-0 flex flex-col justify-center gap-4 opacity-[0.07] group-hover:opacity-[0.14] transition-opacity duration-500 pointer-events-none">
              {['animate-behance-marquee', 'animate-behance-marquee-reverse'].map((anim) => (
                <div key={anim} className={`flex w-max whitespace-nowrap ${anim}`}>
                  {Array.from({ length: 2 }).map((_, half) => (
                    <span key={half} className="font-display font-black text-[clamp(4rem,9vw,9rem)] leading-none uppercase text-stroke text-white pr-8">
                      SEE MORE ON BEHANCE ✦ SEE MORE ON BEHANCE ✦ 
                    </span>
                  ))}
                </div>
              ))}
            </div>

            {/* Violet glow that brightens on hover */}
            <div aria-hidden="true" className="absolute -right-20 top-1/2 -translate-y-1/2 w-[32rem] h-[32rem] rounded-full bg-[#7B5CFF]/30 blur-[90px] opacity-60 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <div className="relative grid lg:grid-cols-12 gap-10 items-center p-8 sm:p-12 lg:p-16">
              {/* Copy + CTA */}
              <div className="lg:col-span-7">
                <div className="behance-reveal flex items-center gap-3 text-xs tracking-[0.2em] font-medium text-[#B49CFF] uppercase mb-5">
                  <span className="w-2 h-2 rounded-full bg-[#B49CFF] animate-pulse" />
                  <span>More work · Behance</span>
                </div>
                <h3 className="behance-reveal font-display font-black uppercase leading-[0.95] tracking-tight text-[clamp(2.25rem,5vw,4.75rem)] text-white">
                  Want the{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B49CFF] via-white to-[#7B5CFF]">full story?</span>
                </h3>
                <p className="behance-reveal mt-5 max-w-xl text-base sm:text-lg text-[#C9C2E3] leading-relaxed">
                  Complete case studies, process shots and every project that didn&apos;t fit on this page.
                </p>

                <div className="behance-reveal mt-9 flex flex-wrap items-center gap-5">
                  <span className="relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-white text-[#0E0E0E] pl-7 pr-2 py-2 font-bold uppercase tracking-wider text-sm shadow-[0_0_40px_rgba(255,255,255,0.25)] group-hover:shadow-[0_0_60px_rgba(180,156,255,0.6)] transition-shadow duration-300">
                    <span aria-hidden="true" className="animate-behance-shine absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-[#B49CFF]/60 to-transparent pointer-events-none" />
                    <span className="relative">Open Behance</span>
                    <span className="relative flex items-center justify-center w-11 h-11 rounded-full bg-[#7B5CFF] text-white group-hover:rotate-45 transition-[rotate] duration-300">
                      <ArrowUpRight className="w-5 h-5" />
                    </span>
                  </span>
                  <span className="text-xs font-mono tracking-widest text-[#9A93B8] uppercase">behance.net/abdullife</span>
                </div>
              </div>

              {/* Fanned project previews: spread apart on hover */}
              <div aria-hidden="true" className="lg:col-span-5 relative h-64 sm:h-80 hidden sm:block">
                {behancePreviews.map((src, i) => (
                  <div key={src} className="behance-thumb absolute left-1/2 top-1/2 w-44 sm:w-56 aspect-[4/5] -ml-22 sm:-ml-28 -mt-[6.9rem] sm:-mt-[8.75rem]" style={{ zIndex: i === 1 ? 3 : 2 - i }}>
                    <div
                      className={`w-full h-full rounded-2xl overflow-hidden border border-white/15 shadow-2xl transition-[rotate,translate,scale] duration-500 ease-out ${
                        i === 0
                          ? '-rotate-12 -translate-x-16 group-hover:-rotate-[18deg] group-hover:-translate-x-32 group-hover:-translate-y-3'
                          : i === 1
                          ? 'rotate-0 group-hover:-translate-y-6 group-hover:scale-105'
                          : 'rotate-12 translate-x-16 group-hover:rotate-[18deg] group-hover:translate-x-32 group-hover:-translate-y-3'
                      }`}
                    >
                      <img src={src} alt="" loading="lazy" className="w-full h-full object-cover" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </a>
        </div>
      </div>
    </>
  );
};
