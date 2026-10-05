'use client';

import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { NAV_LINKS, PORTFOLIO_LINKS } from '../data/portfolio';
import { ScrambleText } from './ScrambleText';
import { MagneticButton } from './MagneticButton';
import { MobileMenu } from './MobileMenu';
import { useSmoothScroll } from './SmoothScroll';

gsap.registerPlugin(ScrollTrigger);

interface NavbarProps {
  isLoaded: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ isLoaded }) => {
  const [lahoreTime, setLahoreTime] = useState<string>('');
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isHidden, setIsHidden] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>('about');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const navRef = useRef<HTMLElement>(null);
  const lastScrollY = useRef<number>(0);
  const { scrollTo, lockScroll, unlockScroll } = useSmoothScroll();

  // Live Lahore clock (Asia/Karachi, UTC+5)
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-US', {
        timeZone: 'Asia/Karachi',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
      setLahoreTime(timeStr);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000 * 60);
    return () => clearInterval(interval);
  }, []);

  // Animate down after hero intro completes
  useEffect(() => {
    if (!isLoaded || !navRef.current) return;

    gsap.fromTo(
      navRef.current,
      { yPercent: -100, opacity: 0 },
      {
        yPercent: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power3.out',
        delay: 0.2,
      }
    );
  }, [isLoaded]);

  // Scroll direction detection (hide on scroll down, show on scroll up)
  useEffect(() => {
    const onScroll = () => {
      const currentY = window.pageYOffset;
      setIsScrolled(currentY > 50);

      if (currentY > 150 && currentY > lastScrollY.current) {
        setIsHidden(true);
      } else {
        setIsHidden(false);
      }
      lastScrollY.current = currentY;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Track active section for dot indicator
  useEffect(() => {
    const sections = NAV_LINKS.map((link) => link.href.replace('#', ''));

    const triggers = sections.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;

      return ScrollTrigger.create({
        trigger: el,
        start: 'top 40%',
        end: 'bottom 40%',
        onEnter: () => setActiveSection(id),
        onEnterBack: () => setActiveSection(id),
      });
    });

    return () => {
      triggers.forEach((st) => st?.kill());
    };
  }, [isLoaded]);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    scrollTo(href, -80);
  };

  const toggleMobileMenu = () => {
    if (!mobileMenuOpen) {
      lockScroll();
      setMobileMenuOpen(true);
    } else {
      unlockScroll();
      setMobileMenuOpen(false);
    }
  };

  const closeMobileMenu = () => {
    unlockScroll();
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-[9900] transition-all duration-400 ease-[cubic-bezier(0.76,0,0.24,1)] ${
          isHidden ? '-translate-y-full' : 'translate-y-0'
        } ${
          isScrolled
            ? 'py-3.5 bg-[#0E0E0E]/80 backdrop-blur-md border-b border-[#2A2A2A]/70 shadow-lg shadow-black/20'
            : 'py-6 bg-transparent'
        }`}
      >
        <div className="px-6 md:px-12">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between">
          {/* Zone 1: Monogram AR. */}
          <a
            href="#top"
            onClick={(e) => handleLinkClick(e, '#top')}
            aria-label="Abdul Rehman Portfolio Home"
            className="group flex items-center gap-1 text-xl md:text-2xl font-display font-extrabold tracking-tighter text-[#F5F5F5] select-none"
          >
            <span>AR</span>
            <span className="text-[#7B5CFF] group-hover:scale-125 transition-transform duration-300">
              .
            </span>
          </a>

          {/* Zone 2: Navigation Links with Scramble & Active Dot */}
          <nav
            aria-label="Main Navigation"
            className="hidden lg:flex items-center gap-8 text-xs tracking-[0.15em] uppercase font-medium text-[#9A9A9A]"
          >
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.href.replace('#', '');
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className={`group relative py-1 hover:text-white transition-colors duration-200 ${
                    isActive ? 'text-white' : ''
                  }`}
                >
                  <ScrambleText text={link.label} />
                  {/* Active dot */}
                  <span
                    aria-hidden="true"
                    className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#7B5CFF] transition-all duration-300 ${
                      isActive ? 'scale-100 opacity-100' : 'scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-50'
                    }`}
                  />
                </a>
              );
            })}
          </nav>

          {/* Zone 3: Live Lahore PKT Clock & Let's Talk CTA */}
          <div className="flex items-center gap-4">
            {/* Live Clock */}
            <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-[#9A9A9A] bg-[#161616] border border-[#2A2A2A] px-3 py-1.5 rounded-full select-none">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>LHR {lahoreTime || '14:32'}</span>
            </div>

            {/* Let's Talk Magnetic Button */}
            <div className="hidden sm:block">
              <MagneticButton
                href="#contact"
                onClick={(e) => handleLinkClick(e as any, '#contact')}
                variant="primary"
                className="px-5 py-2 text-xs tracking-wider uppercase font-semibold"
              >
                Let&apos;s Talk
              </MagneticButton>
            </div>

            {/* Mobile Hamburger Button */}
            <button
              onClick={toggleMobileMenu}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
              className="lg:hidden p-2.5 rounded-full bg-[#161616] border border-[#2A2A2A] text-white flex flex-col justify-center items-center gap-1.5 w-10 h-10 select-none cursor-pointer"
            >
              <span
                className={`w-5 h-[2px] bg-white transition-all duration-300 origin-center ${
                  mobileMenuOpen ? 'rotate-45 translate-y-2' : ''
                }`}
              />
              <span
                className={`w-5 h-[2px] bg-white transition-all duration-300 ${
                  mobileMenuOpen ? 'opacity-0 scale-0' : ''
                }`}
              />
              <span
                className={`w-5 h-[2px] bg-white transition-all duration-300 origin-center ${
                  mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
                }`}
              />
            </button>
          </div>
        </div>
        </div>
      </header>

      {/* Fullscreen Mobile Menu Overlay */}
      <MobileMenu isOpen={mobileMenuOpen} onClose={closeMobileMenu} />
    </>
  );
};
