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

      {/* Giant CTA Line: SEE MORE ON BEHANCE ↗ */}
      <div className="relative z-10 px-6 md:px-12 mt-24">
      <div className="max-w-[1440px] mx-auto pt-12 border-t border-[#2A2A2A] @container">
        <a
          href={PORTFOLIO_LINKS.behance}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor="pointer"
          className="group block text-center py-6 select-none"
        >
          <div className="font-display font-black text-[clamp(1.75rem,4.4cqw,6rem)] leading-none tracking-tight uppercase transition-all duration-500 text-stroke group-hover-fill group-hover:text-[#7B5CFF] flex flex-wrap items-center justify-center gap-4">
            <span>SEE MORE ON BEHANCE</span>
            <ArrowUpRight className="w-[0.8em] h-[0.8em] shrink-0 inline-block group-hover:translate-x-3 group-hover:-translate-y-3 transition-transform duration-300" />
          </div>
          <span className="text-xs font-mono tracking-widest text-[#9A9A9A] uppercase mt-2 block">
            BEHANCE.NET/ABDULLIFE
          </span>
        </a>
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
  );
};
