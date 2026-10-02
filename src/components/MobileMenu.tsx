import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NAV_LINKS, PORTFOLIO_LINKS } from '../data/portfolio';
import { ArrowUpRight, X } from 'lucide-react';
import { useSmoothScroll } from './SmoothScroll';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const { scrollTo } = useSmoothScroll();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleNavClick = (href: string) => {
    onClose();
    setTimeout(() => {
      scrollTo(href, -70);
    }, 400);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ clipPath: 'circle(0% at calc(100% - 40px) 40px)' }}
          animate={{ clipPath: 'circle(150% at calc(100% - 40px) 40px)' }}
          exit={{ clipPath: 'circle(0% at calc(100% - 40px) 40px)' }}
          transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[9990] bg-[#0E0E0E] text-[#F5F5F5] flex flex-col justify-between p-8 md:p-12 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation Menu"
        >
          {/* Top Bar inside Menu */}
          <div className="flex justify-between items-center w-full">
            <span className="font-display font-black text-2xl tracking-tighter">
              AR<span className="text-[#7B5CFF]">.</span>
            </span>
            <button
              onClick={onClose}
              aria-label="Close navigation menu"
              className="p-3 rounded-full bg-[#1F1F1F] text-[#F5F5F5] hover:text-[#7B5CFF] border border-[#2A2A2A] transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Links list */}
          <nav className="my-auto flex flex-col gap-4 py-8">
            {NAV_LINKS.map((link, idx) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.2 + idx * 0.07,
                  duration: 0.5,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <button
                  onClick={() => handleNavClick(link.href)}
                  className="group flex items-baseline gap-4 text-left w-full"
                >
                  <span className="text-xs font-mono text-[#7B5CFF] tracking-widest">
                    ({link.index})
                  </span>
                  <span className="font-display font-extrabold text-4xl sm:text-5xl tracking-tight text-[#F5F5F5] group-hover:text-[#7B5CFF] transition-colors">
                    {link.label}
                  </span>
                </button>
              </motion.div>
            ))}
          </nav>

          {/* Bottom Socials & Status */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="pt-6 border-t border-[#2A2A2A] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-sm"
          >
            <div className="flex flex-wrap gap-4 text-xs font-medium text-[#9A9A9A]">
              <a
                href={PORTFOLIO_LINKS.behance}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#7B5CFF] transition-colors flex items-center gap-1"
              >
                Behance <ArrowUpRight className="w-3 h-3" />
              </a>
              <a
                href={PORTFOLIO_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#7B5CFF] transition-colors flex items-center gap-1"
              >
                Instagram <ArrowUpRight className="w-3 h-3" />
              </a>
              <a
                href={PORTFOLIO_LINKS.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#7B5CFF] transition-colors flex items-center gap-1"
              >
                LinkedIn <ArrowUpRight className="w-3 h-3" />
              </a>
            </div>
            <span className="text-xs text-[#5C5C5C]">Lahore, Pakistan</span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
