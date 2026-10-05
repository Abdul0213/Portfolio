'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TOOLS_DATA, SKILLS_PLAYGROUND_LIST, ToolItem } from '../data/portfolio';
import { prefersReducedMotion } from '../lib/motion';

gsap.registerPlugin(ScrollTrigger);

export const Skills: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);
  const playgroundRef = useRef<HTMLDivElement>(null);
  const toolsGridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion() || !toolsGridRef.current) return;

    const grid = toolsGridRef.current;
    const cards = grid.querySelectorAll<HTMLElement>('.tool-card');
    const logos = grid.querySelectorAll<HTMLElement>('.tool-logo');
    const texts = grid.querySelectorAll<HTMLElement>('.tool-text');

    // Plays on enter from either direction and reverses on leave,
    // so the reveal repeats every time the grid scrolls into view
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        scrollTrigger: {
          trigger: grid,
          start: 'top 85%',
          end: 'bottom 15%',
          toggleActions: 'play reverse play reverse',
        },
      });

      tl.fromTo(
        cards,
        { opacity: 0, y: 60, scale: 0.94, filter: 'blur(12px)' },
        { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 0.9, stagger: 0.1 }
      )
        .fromTo(
          logos,
          { opacity: 0, scale: 0.4, rotate: -12 },
          { opacity: 1, scale: 1, rotate: 0, duration: 0.6, ease: 'back.out(2)', stagger: 0.1 },
          '-=0.8'
        )
        .fromTo(
          texts,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 },
          '-=0.6'
        );
    }, grid);

    return () => ctx.revert();
  }, []);

  // Recreated logo renderers in pure CSS & inline SVG
  const renderToolLogo = (tool: ToolItem) => {
    switch (tool.type) {
      case 'ps':
        return (
          <div
            className="w-16 h-16 rounded-xl flex items-center justify-center font-display font-black text-2xl border border-[#31A8FF]/30 shadow-lg"
            style={{ backgroundColor: tool.color, color: tool.textColor }}
          >
            Ps
          </div>
        );
      case 'ai':
        return (
          <div
            className="w-16 h-16 rounded-xl flex items-center justify-center font-display font-black text-2xl border border-[#FF9A00]/30 shadow-lg"
            style={{ backgroundColor: tool.color, color: tool.textColor }}
          >
            Ai
          </div>
        );
      case 'figma':
        return (
          <div className="w-16 h-16 rounded-xl bg-[#1E1E1E] border border-white/20 p-2 flex flex-col justify-center items-center shadow-lg">
            <svg viewBox="0 0 38 57" className="w-9 h-9" fill="none">
              <path d="M19 28.5A9.5 9.5 0 1 1 28.5 19 9.5 9.5 0 0 1 19 28.5z" fill="#1ABCFE" />
              <path d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5A9.5 9.5 0 1 1 0 47.5z" fill="#0ACF83" />
              <path d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19z" fill="#FF7262" />
              <path d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z" fill="#F24E1E" />
              <path d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z" fill="#A259FF" />
            </svg>
          </div>
        );
      case 'canva':
        return (
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#00C4CC] to-[#7D2AE8] flex items-center justify-center text-white font-serif font-bold italic text-[15px] shadow-lg">
            Canva
          </div>
        );
      case 'capcut':
        return (
          <div className="w-16 h-16 rounded-xl bg-black border border-white/30 flex items-center justify-center shadow-lg">
            {/* CapCut mark: open brackets joined by a crossed "cut" */}
            <svg
              viewBox="0 0 24 24"
              className="w-10 h-10"
              fill="none"
              stroke="white"
              strokeWidth={2.2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 6.5H5a1.5 1.5 0 0 0-1.5 1.5v8A1.5 1.5 0 0 0 5 17.5h4" />
              <path d="M15 6.5h4a1.5 1.5 0 0 1 1.5 1.5v8a1.5 1.5 0 0 1-1.5 1.5h-4" />
              <path d="M9 6.5l6 11M15 6.5l-6 11" />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  // 3D Tilt calculation on hover
  const ToolCard: React.FC<{ tool: ToolItem; index: number }> = ({ tool, index }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [tilt, setTilt] = useState({ x: 0, y: 0, glareX: 50, glareY: 50, opacity: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (prefersReducedMotion() || !cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const rotX = ((y - rect.height / 2) / (rect.height / 2)) * -14;
      const rotY = ((x - rect.width / 2) / (rect.width / 2)) * 14;

      const glareX = (x / rect.width) * 100;
      const glareY = (y / rect.height) * 100;

      setTilt({ x: rotX, y: rotY, glareX, glareY, opacity: 0.2 });
    };

    const handleMouseLeave = () => {
      setTilt({ x: 0, y: 0, glareX: 50, glareY: 50, opacity: 0 });
    };

    return (
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          perspective: 1000,
        }}
        className="tool-card w-full"
      >
        <div
          style={{
            transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
            transition: 'transform 0.15s ease-out, border-color 0.3s, box-shadow 0.3s',
          }}
          className="relative rounded-3xl p-8 bg-gradient-to-br from-[#241C3D] via-[#1F1F1F] to-[#1A1A1A] border border-[#7B5CFF]/20 hover:border-[#7B5CFF]/70 hover:shadow-[0_0_40px_rgba(123,92,255,0.25)] flex flex-col justify-between h-[230px] overflow-hidden group select-none shadow-xl"
        >
          {/* Purple corner glow */}
          <div
            aria-hidden="true"
            className="absolute -top-16 -left-16 w-48 h-48 rounded-full bg-[#7B5CFF]/20 blur-3xl pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity duration-500"
          />

          {/* Moving glare highlight */}
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none transition-opacity duration-300"
            style={{
              opacity: tilt.opacity,
              background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(155,125,255,0.45) 0%, transparent 60%)`,
            }}
          />

          {/* Purple accent bar that grows on hover */}
          <div
            aria-hidden="true"
            className="absolute bottom-0 left-0 h-[3px] w-1/4 group-hover:w-full bg-gradient-to-r from-[#7B5CFF] to-[#B49CFF] transition-all duration-500"
          />

          <div className="relative flex items-start justify-between">
            <div className="tool-logo">{renderToolLogo(tool)}</div>
            <span className="text-xs font-mono text-[#7B5CFF]/70 group-hover:text-[#B49CFF] transition-colors">
              (0{index + 1})
            </span>
          </div>

          <div className="tool-text relative">
            <h3 className="font-display font-bold text-2xl text-[#F5F5F5] group-hover:text-white mb-1">
              {tool.name}
            </h3>
            <p className="text-xs font-mono text-[#9A9A9A] group-hover:text-[#B49CFF] tracking-wider uppercase transition-colors">
              {tool.role}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section
      id="skills"
      ref={containerRef}
      className="relative py-28 px-6 md:px-12 bg-[#0E0E0E] text-[#F5F5F5] border-t border-[#2A2A2A]"
    >
      <div className="max-w-[1440px] mx-auto">
        {/* Section Header */}
        <div className="mb-16">
          <div className="flex items-center gap-3 text-xs tracking-[0.2em] font-medium text-[#7B5CFF] uppercase mb-4">
            <span>(05) — TOOLKIT</span>
            <div className="h-[1px] w-12 bg-[#7B5CFF]/40" />
          </div>
          <h2 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl uppercase tracking-tight text-[#F5F5F5]">
            CORE TOOLS &amp; SKILLS
          </h2>
        </div>

        {/* 5 Tools 3D Tilt Cards Grid */}
        <div ref={toolsGridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-20">
          {TOOLS_DATA.map((tool, idx) => (
            <ToolCard key={tool.name} tool={tool} index={idx} />
          ))}
        </div>

        {/* Interactive Skills Playground (Draggable Pills) */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display font-bold text-xl uppercase tracking-wider text-[#F5F5F5]">
              SKILLS PLAYGROUND
            </h3>
            <span className="text-xs font-mono tracking-widest text-[#7B5CFF] uppercase">
              (DRAG ME)
            </span>
          </div>

          <div
            ref={playgroundRef}
            className="relative w-full min-h-[360px] p-8 sm:p-12 rounded-3xl bg-[#161616] border border-[#2A2A2A] overflow-hidden flex flex-wrap content-center justify-center gap-4 select-none shadow-2xl"
          >
            {/* Background Hint */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
              <span className="font-display font-black text-8xl text-stroke uppercase">
                INTERACTIVE
              </span>
            </div>

            {SKILLS_PLAYGROUND_LIST.map((skill, index) => {
              const pillStyles =
                skill.variant === 'violet'
                  ? 'bg-[#7B5CFF] text-white border border-[#7B5CFF] shadow-[0_0_15px_rgba(123,92,255,0.3)]'
                  : skill.variant === 'white'
                  ? 'bg-white text-[#0E0E0E] font-semibold border border-white'
                  : 'bg-[#1F1F1F] text-[#F5F5F5] border border-[#2A2A2A] hover:border-[#7B5CFF]';

              return (
                <motion.div
                  key={skill.name}
                  drag
                  dragConstraints={playgroundRef}
                  dragElastic={0.2}
                  whileDrag={{ scale: 1.12, zIndex: 50, cursor: 'grabbing' }}
                  whileHover={{ scale: 1.05 }}
                  initial={{ opacity: 0, y: -40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    type: 'spring',
                    stiffness: 260,
                    damping: 20,
                    delay: index * 0.03,
                  }}
                  className={`px-5 py-3 rounded-full text-xs sm:text-sm font-medium tracking-wide cursor-grab active:cursor-grabbing select-none ${pillStyles}`}
                >
                  <span>{skill.name}</span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
