import React, { useRef, useState } from 'react';
import { EDUCATION_DATA } from '../data/portfolio';
import { GraduationCap, Award } from 'lucide-react';
import { prefersReducedMotion } from '../lib/motion';

export const Education: React.FC = () => {
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
        className="relative group rounded-3xl p-8 sm:p-12 bg-[#161616] border border-[#2A2A2A] overflow-hidden transition-all duration-300 shadow-xl"
      >
        {/* Dynamic Cursor-following Glow */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{
            opacity: mousePos.opacity,
            background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(123, 92, 255, 0.18), transparent 70%)`,
          }}
        />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-start gap-5">
            <div className="p-4 rounded-2xl bg-[#1F1F1F] border border-[#2A2A2A] text-[#7B5CFF] group-hover:scale-110 transition-transform duration-300 shrink-0">
              {index === 0 ? (
                <Award className="w-8 h-8" />
              ) : (
                <GraduationCap className="w-8 h-8" />
              )}
            </div>
            <div>
              <span className="text-xs font-mono text-[#7B5CFF] tracking-wider uppercase block mb-1">
                {item.duration} · {item.period}
              </span>
              <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight mb-1">
                {item.institution}
              </h3>
              <p className="text-base text-[#9A9A9A] font-medium">
                {item.program}
              </p>
            </div>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-4 sm:pt-0 border-[#2A2A2A]">
            <span className="text-xs font-mono tracking-widest text-[#5C5C5C] uppercase">
              CREDENTIAL (0{index + 1})
            </span>
            <span className="text-xs font-bold text-[#F5F5F5] uppercase tracking-wider mt-1 px-3 py-1 rounded-full bg-[#1F1F1F] border border-[#2A2A2A]">
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
      className="relative py-28 px-6 md:px-12 bg-[#0E0E0E] text-[#F5F5F5] border-t border-[#2A2A2A]"
    >
      <div className="max-w-[1440px] mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="flex items-center gap-3 text-xs tracking-[0.2em] font-medium text-[#7B5CFF] uppercase mb-4">
              <span>(06) — EDUCATION</span>
              <div className="h-[1px] w-12 bg-[#7B5CFF]/40" />
            </div>
            <h2 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl uppercase tracking-tight text-[#F5F5F5]">
              ACADEMIC &amp; TRAINING
            </h2>
          </div>
          <p className="max-w-md text-sm sm:text-base text-[#9A9A9A] italic">
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
