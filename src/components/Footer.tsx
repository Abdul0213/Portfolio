import React, { useRef } from 'react';
import { PORTFOLIO_LINKS, NAV_LINKS } from '../data/portfolio';
import { MagneticButton } from './MagneticButton';
import { useSmoothScroll } from './SmoothScroll';
import { ArrowUp, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  const { scrollTo } = useSmoothScroll();
  const nameString = 'ABDUL REHMAN';

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    scrollTo(href, -80);
  };

  const handleBackToTop = () => {
    scrollTo('#top', 0);
  };

  return (
    <footer
      id="footer"
      className="relative z-10 w-full bg-[#0E0E0E] text-[#F5F5F5] border-t border-[#2A2A2A] pt-24 pb-12 px-6 md:px-12 select-none"
    >
      <div className="max-w-[1440px] mx-auto flex flex-col justify-between min-h-[500px]">
        {/* Top 3-Column Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-20 border-b border-[#2A2A2A]">
          {/* Col 1: Monogram & Bio (5 cols) */}
          <div className="md:col-span-5 flex flex-col justify-between">
            <div>
              <div className="font-display font-black text-3xl tracking-tighter mb-4">
                AR<span className="text-[#7B5CFF]">.</span>
              </div>
              <p className="max-w-sm text-sm text-[#9A9A9A] leading-relaxed mb-6 font-body">
                Self-taught Graphic Designer crafting bold brand identities, high-converting social campaigns, and 3D mockups.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono tracking-wider text-[#9A9A9A] uppercase">
                Available for Q4 2026 Projects
              </span>
            </div>
          </div>

          {/* Col 2: Navigation Links (3 cols) */}
          <div className="md:col-span-3">
            <span className="text-xs font-mono tracking-[0.2em] text-[#7B5CFF] uppercase font-semibold block mb-6">
              NAVIGATION
            </span>
            <ul className="flex flex-col gap-3 text-sm font-medium text-[#9A9A9A]">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="hover:text-white transition-colors duration-200 inline-flex items-center gap-2"
                  >
                    <span className="text-xs font-mono text-[#5C5C5C]">({link.index})</span>
                    <span>{link.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Socials & External Profiles (4 cols) */}
          <div className="md:col-span-4 flex flex-col justify-between">
            <div>
              <span className="text-xs font-mono tracking-[0.2em] text-[#7B5CFF] uppercase font-semibold block mb-6">
                CONNECT
              </span>
              <ul className="flex flex-col gap-3 text-sm font-medium text-[#9A9A9A]">
                <li>
                  <a
                    href={PORTFOLIO_LINKS.behance}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#7B5CFF] transition-colors inline-flex items-center gap-1.5"
                  >
                    <span>Behance / abdullife</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </li>
                <li>
                  <a
                    href={PORTFOLIO_LINKS.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#7B5CFF] transition-colors inline-flex items-center gap-1.5"
                  >
                    <span>Instagram / @kagenoink</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </li>
                <li>
                  <a
                    href={PORTFOLIO_LINKS.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#7B5CFF] transition-colors inline-flex items-center gap-1.5"
                  >
                    <span>LinkedIn / Abdul Rehman</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </li>
                <li>
                  <a
                    href={PORTFOLIO_LINKS.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#7B5CFF] transition-colors inline-flex items-center gap-1.5"
                  >
                    <span>WhatsApp / Direct Chat</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </li>
                <li>
                  <a
                    href={PORTFOLIO_LINKS.email}
                    className="hover:text-[#7B5CFF] transition-colors inline-flex items-center gap-1.5"
                  >
                    <span>Email / {PORTFOLIO_LINKS.emailAddress}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </li>
              </ul>
            </div>

            {/* Back to top magnetic circular button */}
            <div className="mt-8 flex justify-start md:justify-end">
              <MagneticButton
                onClick={handleBackToTop}
                variant="outline"
                className="w-16 h-16 rounded-full flex flex-col items-center justify-center p-0 border border-[#2A2A2A] hover:border-[#7B5CFF]"
                aria-label="Back to top"
              >
                <ArrowUp className="w-5 h-5 text-[#7B5CFF]" />
              </MagneticButton>
            </div>
          </div>
        </div>

        {/* Giant Interactive Hoverable ABDUL REHMAN Letters */}
        <div className="py-12 overflow-hidden text-center @container">
          <div
            aria-label={nameString}
            className="font-display font-black text-[clamp(2.25rem,7.2cqw,9.5rem)] tracking-tighter leading-none text-[#F5F5F5] flex justify-center items-center flex-wrap gap-x-[0.3em]"
          >
            {nameString.split(' ').map((word, wordIndex) => (
              <span key={wordIndex} aria-hidden="true" className="inline-flex whitespace-nowrap">
                {Array.from(word).map((char, index) => (
                  <span
                    key={index}
                    className="inline-block transition-all duration-300 hover:-translate-y-3 hover:text-[#7B5CFF] cursor-default"
                  >
                    {char}
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 border-t border-[#2A2A2A] flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-mono text-[#5C5C5C]">
          <div>
            © 2026 Abdul Rehman — Designed &amp; built with passion in Lahore.
          </div>
          <div className="flex items-center gap-6">
            <span>Syne &amp; DM Sans</span>
            <span>·</span>
            <span>All Rights Reserved</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
