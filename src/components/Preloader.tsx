import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { EASINGS, prefersReducedMotion } from '../lib/motion';

gsap.registerPlugin(ScrollTrigger);

interface PreloaderProps {
  onComplete: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const blackPanelRef = useRef<HTMLDivElement>(null);
  const violetPanelRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const nameCharsRef = useRef<HTMLDivElement>(null);
  const roleLabelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if session has already seen preloader
    const hasSeenPreloader = sessionStorage.getItem('ar_preloader_seen');

    if (hasSeenPreloader || prefersReducedMotion()) {
      // Fast fade on repeat visit or reduced motion
      const tl = gsap.timeline({
        onComplete: () => {
          setIsVisible(false);
          ScrollTrigger.refresh();
          onComplete();
        },
      });
      tl.to(containerRef.current, {
        opacity: 0,
        duration: 0.4,
        ease: 'power2.out',
      });
      return;
    }

    // Mark as seen for session
    sessionStorage.setItem('ar_preloader_seen', 'true');

    // Lock body scroll
    document.body.style.overflow = 'hidden';

    // Char by char setup for ABDUL REHMAN
    const nameEl = nameCharsRef.current;
    let charSpans: HTMLElement[] = [];
    if (nameEl) {
      const text = 'ABDUL REHMAN';
      nameEl.innerHTML = '';
      text.split('').forEach((char) => {
        const span = document.createElement('span');
        span.textContent = char === ' ' ? '\u00A0' : char;
        span.style.display = 'inline-block';
        span.style.opacity = '0';
        span.style.transform = 'translateY(20px)';
        nameEl.appendChild(span);
        charSpans.push(span);
      });
    }

    const counterObj = { value: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        setIsVisible(false);
        document.body.style.overflow = '';
        ScrollTrigger.refresh();
        onComplete();
      },
    });

    // 1. Counter 0 -> 100 & progress line
    tl.to(
      counterObj,
      {
        value: 100,
        duration: 1.6,
        ease: 'power2.inOut',
        onUpdate: () => {
          if (counterRef.current) {
            counterRef.current.textContent = String(Math.floor(counterObj.value)).padStart(2, '0');
          }
        },
      },
      0
    );

    tl.to(
      progressBarRef.current,
      {
        scaleX: 1,
        duration: 1.6,
        ease: 'power2.inOut',
      },
      0
    );

    // 2. Chars reveal
    tl.to(
      charSpans,
      {
        opacity: 1,
        y: 0,
        stagger: 0.04,
        duration: 0.6,
        ease: 'power3.out',
      },
      0.2
    );

    // 3. Role label reveal
    tl.to(
      roleLabelRef.current,
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power3.out',
      },
      0.7
    );

    // 4. Hold for a beat
    tl.to({}, { duration: 0.2 });

    // 5. Exit: Black curtain panel slides up, then violet panel 0.1s behind it
    tl.to(
      blackPanelRef.current,
      {
        yPercent: -100,
        duration: 0.8,
        ease: EASINGS.expoOut,
      },
      '+=0.1'
    );

    tl.to(
      violetPanelRef.current,
      {
        yPercent: -100,
        duration: 0.8,
        ease: EASINGS.expoOut,
      },
      '<0.1'
    );

    return () => {
      tl.kill();
      document.body.style.overflow = '';
    };
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[10000] pointer-events-auto select-none"
    >
      {/* Violet Curtain Panel Behind (slides up 0.1s after black) */}
      <div
        ref={violetPanelRef}
        className="absolute inset-0 bg-[#5530A7] z-[10001] translate-y-0"
      />

      {/* Primary Black Content Panel */}
      <div
        ref={blackPanelRef}
        className="absolute inset-0 bg-[#0E0E0E] text-[#F5F5F5] z-[10002] flex flex-col justify-between p-8 md:p-16"
      >
        {/* Top small tag */}
        <div className="flex justify-between items-center text-xs text-[#9A9A9A] tracking-[0.2em] font-medium uppercase">
          <span>PORTFOLIO © 2026</span>
          <span className="text-[#7B5CFF]">LAHORE, PK</span>
        </div>

        {/* Center: Chars & Role Label */}
        <div className="flex flex-col items-center justify-center my-auto text-center">
          <div
            ref={nameCharsRef}
            className="font-display font-black text-3xl md:text-6xl lg:text-7xl tracking-tighter text-[#F5F5F5] mb-4 whitespace-nowrap"
          >
            ABDUL REHMAN
          </div>
          <div
            ref={roleLabelRef}
            className="text-xs md:text-sm tracking-[0.3em] uppercase text-[#7B5CFF] font-semibold opacity-0 translate-y-3"
          >
            GRAPHIC DESIGNER
          </div>
        </div>

        {/* Bottom bar with Counter & Progress Line */}
        <div className="w-full">
          <div className="flex justify-between items-end mb-4">
            <span
              ref={counterRef}
              className="font-display font-black text-6xl md:text-8xl text-white tracking-tighter tabular-nums"
            >
              00
            </span>
            <span className="text-xs text-[#9A9A9A] tracking-[0.25em] uppercase pb-2">
              INITIALIZING CREATIVE ENGINE
            </span>
          </div>

          {/* Thin violet progress line */}
          <div className="w-full h-[2px] bg-[#2A2A2A] overflow-hidden">
            <div
              ref={progressBarRef}
              className="w-full h-full bg-[#7B5CFF] origin-left scale-x-0"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
