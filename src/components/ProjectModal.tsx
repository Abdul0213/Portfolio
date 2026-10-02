import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Project, PORTFOLIO_LINKS } from '../data/portfolio';
import { MagneticButton } from './MagneticButton';
import { X, ArrowRight, ArrowLeft, ArrowUpRight } from 'lucide-react';
import { useSmoothScroll } from './SmoothScroll';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  currentIndex: number;
  totalProjects: number;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  project,
  onClose,
  onNext,
  onPrev,
  currentIndex,
  totalProjects,
}) => {
  const { lockScroll, unlockScroll } = useSmoothScroll();
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (project) {
      lockScroll();
    } else {
      unlockScroll();
    }
    return () => {
      unlockScroll();
    };
  }, [project, lockScroll, unlockScroll]);

  // Keyboard navigation: Escape to close, Arrows to switch
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!project) return;
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        onNext();
      } else if (e.key === 'ArrowLeft') {
        onPrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [project, onClose, onNext, onPrev]);

  if (!project) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 md:p-10"
        role="dialog"
        aria-modal="true"
        aria-label={project.title}
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#0E0E0E]/90 backdrop-blur-xl"
        />

        {/* Modal Window */}
        <motion.div
          ref={modalRef}
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-5xl max-h-[90vh] bg-[#161616] border border-[#2A2A2A] rounded-3xl shadow-2xl flex flex-col overflow-hidden z-10"
        >
          {/* Top Bar inside modal */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#2A2A2A] bg-[#161616]/80 backdrop-blur-md">
            <div className="flex items-center gap-3 text-xs font-mono text-[#9A9A9A]">
              <span className="text-[#7B5CFF] font-bold">PROJECT {project.number}</span>
              <span>/</span>
              <span>{String(totalProjects).padStart(2, '0')}</span>
              <span className="hidden sm:inline-block">· {project.category}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onPrev}
                aria-label="Previous project"
                className="p-2 rounded-full bg-[#1F1F1F] hover:bg-[#2A2A2A] text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button
                onClick={onNext}
                aria-label="Next project"
                className="p-2 rounded-full bg-[#1F1F1F] hover:bg-[#2A2A2A] text-white transition-colors"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                aria-label="Close modal"
                className="p-2 rounded-full bg-[#1F1F1F] hover:bg-[#7B5CFF] text-white transition-colors ml-2"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Scrollable Content Body */}
          <div className="p-6 md:p-10 overflow-y-auto flex flex-col gap-8">
            {/* Project Image Frame */}
            <div
              className="relative w-full aspect-video rounded-2xl overflow-hidden bg-[#1F1F1F] border border-[#2A2A2A] shadow-inner"
              style={{ background: project.gradientFallback }}
            >
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // If image fails, hide <img> and let gradient fallback shine
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs font-mono text-white">
                {project.year}
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-8 flex flex-col gap-4">
                <h3 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-[#F5F5F5] tracking-tight">
                  {project.title}
                </h3>
                <p className="text-base sm:text-lg text-[#9A9A9A] leading-relaxed">
                  {project.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {project.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3.5 py-1.5 rounded-full bg-[#1F1F1F] border border-[#2A2A2A] text-xs font-mono text-[#F5F5F5]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Column (4 cols) */}
              <div className="lg:col-span-4 flex flex-col gap-4 p-6 rounded-2xl bg-[#1F1F1F] border border-[#2A2A2A]">
                <div className="text-xs uppercase tracking-widest text-[#9A9A9A] font-semibold">
                  PROJECT SCOPE
                </div>
                <div className="text-sm font-medium text-[#F5F5F5]">
                  Visual Identity · Campaign Strategy · Production Assets
                </div>
                <div className="pt-4 border-t border-[#2A2A2A]">
                  <MagneticButton
                    href={PORTFOLIO_LINKS.behance}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="primary"
                    className="w-full py-3.5 text-xs font-bold uppercase tracking-wider"
                  >
                    <span>View on Behance</span>
                    <ArrowUpRight className="w-4 h-4 ml-1" />
                  </MagneticButton>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
