import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MARQUEE_ROW_1, MARQUEE_ROW_2 } from '../data/portfolio';
import { prefersReducedMotion } from '../lib/motion';

gsap.registerPlugin(ScrollTrigger);

export const VelocityMarquee: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Reduced motion keeps a gentle constant drift but drops the scroll-driven boost & skew
    const reducedMotion = prefersReducedMotion();

    const row1 = row1Ref.current;
    const row2 = row2Ref.current;
    if (!row1 || !row2) return;

    let x1 = 0;
    let x2 = 0;
    const baseSpeed = reducedMotion ? 0.5 : 1.2;
    let velocityMultiplier = 1;
    let direction = 1;
    let targetSkew = 0;
    let currentSkew = 0;

    // Each row renders its sequence twice; one copy's exact width is the seamless loop length
    const loopLength = (row: HTMLElement) => (row.firstElementChild as HTMLElement | null)?.offsetWidth || 0;

    // Keep x inside (-length, 0] so the second copy always fills the band
    const wrap = (x: number, length: number) => (length > 0 ? (((x % length) + length) % length) - length : x);

    // Track scroll velocity via ScrollTrigger
    const scrollObserver = ScrollTrigger.observe({
      target: window,
      type: 'scroll',
      onChange: (self) => {
        if (reducedMotion) return;
        const vel = self.velocityY || 0;
        // Direction & magnitude
        direction = vel < 0 ? -1 : 1;
        const clampedVel = Math.min(Math.abs(vel) / 120, 8);
        velocityMultiplier = 1 + clampedVel;

        // Skew up to +-10deg
        targetSkew = Math.max(-10, Math.min(10, (vel / 200) * -1));
      },
    });

    const tickerCallback = () => {
      // Return skew to 0 smoothly
      currentSkew += (targetSkew - currentSkew) * 0.1;
      targetSkew *= 0.94;

      // Base move + velocity boost; rows travel in opposite directions
      const delta = baseSpeed * velocityMultiplier * direction;
      x1 = wrap(x1 - delta, loopLength(row1));
      x2 = wrap(x2 + delta, loopLength(row2));

      // Ease velocityMultiplier back to 1
      velocityMultiplier += (1 - velocityMultiplier) * 0.08;

      row1.style.transform = `translateX(${x1}px) skewX(${currentSkew}deg)`;
      row2.style.transform = `translateX(${x2}px) skewX(${-currentSkew}deg)`;
    };

    gsap.ticker.add(tickerCallback);

    return () => {
      scrollObserver.kill();
      gsap.ticker.remove(tickerCallback);
    };
  }, []);

  return (
    <section
      ref={containerRef}
      aria-label="Capabilities Marquee"
      className="relative py-12 overflow-hidden select-none bg-[#0E0E0E]"
      style={{ overflowX: 'clip' }}
    >
      {/* Background Accent Gradients */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-40 bg-[#5530A7]/20 blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-40 bg-[#7B5CFF]/15 blur-[100px] pointer-events-none" />

      {/* Crossed tape bands — both rows share one grid cell and tilt in opposite directions */}
      <div className="relative grid grid-cols-[100%] place-items-center h-[200px] sm:h-[320px] lg:h-[420px]">
        {/* Row 2 (under): Outlined Syne on a dark strip, rising to the right */}
        <div className="col-start-1 row-start-1 justify-self-start relative left-1/2 -translate-x-1/2 -rotate-[5deg] w-[130vw] bg-[#1A1A1A] border-y border-[#7B5CFF]/40 py-3 sm:py-5 overflow-hidden">
          <div ref={row2Ref} className="flex whitespace-nowrap will-change-transform">
            {[0, 1].map((copy) => (
              <div key={copy} aria-hidden={copy === 1} className="flex shrink-0">
                {MARQUEE_ROW_2.map((text, i) => (
                  <div key={i} className="flex items-center gap-6 mr-6">
                    <span className="font-display font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl leading-none tracking-tight text-stroke text-[#F5F5F5] uppercase">
                      {text}
                    </span>
                    <span className="text-[#7B5CFF] text-2xl sm:text-4xl leading-none animate-[spin_6s_linear_infinite_reverse] inline-block font-sans">
                      ✦
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Row 1 (over): Solid Syne on a violet strip, falling to the right */}
        <div className="col-start-1 row-start-1 justify-self-start relative left-1/2 -translate-x-1/2 z-10 rotate-[5deg] w-[130vw] bg-[#7B5CFF] py-3 sm:py-5 overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.55)]">
          <div ref={row1Ref} className="flex whitespace-nowrap will-change-transform">
            {[0, 1].map((copy) => (
              <div key={copy} aria-hidden={copy === 1} className="flex shrink-0">
                {MARQUEE_ROW_1.map((text, i) => (
                  <div key={i} className="flex items-center gap-6 mr-6">
                    <span className="font-display font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl leading-none tracking-tight text-[#0E0E0E] uppercase">
                      {text}
                    </span>
                    <span className="text-[#F5F5F5] text-2xl sm:text-4xl leading-none animate-[spin_6s_linear_infinite] inline-block font-sans">
                      ✦
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
