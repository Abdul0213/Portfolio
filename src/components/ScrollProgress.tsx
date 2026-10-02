import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const ScrollProgress: React.FC = () => {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    const anim = gsap.to(bar, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: document.documentElement,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.15,
      },
    });

    return () => {
      anim.kill();
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 h-[2.5px] z-[9995] pointer-events-none bg-transparent"
    >
      <div
        ref={barRef}
        className="h-full bg-gradient-to-r from-[#5530A7] via-[#7B5CFF] to-[#7B5CFF] origin-left scale-x-0 shadow-[0_0_10px_#7B5CFF]"
      />
    </div>
  );
};
