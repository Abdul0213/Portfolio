'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const ScrollProgress: React.FC = () => {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    // Progress over the real scroll range: start 0 to end 'max' is re-measured on every
    // refresh, so it stays correct after pinned sections add their scroll space.
    // scaleX is set explicitly from GSAP (not a Tailwind scale class, which uses the CSS
    // `scale` property that GSAP folds into its own transform and reads as "already full").
    const setScale = gsap.quickSetter(bar, 'scaleX');
    setScale(0);

    const st = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => setScale(self.progress),
      onRefresh: (self) => setScale(self.progress),
    });

    return () => {
      st.kill();
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 h-[2.5px] z-[9995] pointer-events-none bg-transparent"
    >
      <div
        ref={barRef}
        style={{ transform: 'scaleX(0)' }}
        className="h-full bg-gradient-to-r from-[#5530A7] via-[#7B5CFF] to-[#7B5CFF] origin-left shadow-[0_0_10px_#7B5CFF]"
      />
    </div>
  );
};
