'use client';

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { prefersReducedMotion } from '../lib/motion';

export type CursorState = 'default' | 'pointer' | 'project' | 'input' | 'headline';

interface CursorContextType {
  setCursorState: (state: CursorState, label?: string) => void;
  resetCursorState: () => void;
}

const CursorContext = createContext<CursorContextType>({
  setCursorState: () => {},
  resetCursorState: () => {},
});

export const useCursor = () => useContext(CursorContext);

export const CursorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cursorState, setCursorStateInternal] = useState<CursorState>('default');
  const [cursorLabel, setCursorLabel] = useState<string>('');
  const [isEnabled, setIsEnabled] = useState<boolean>(false);

  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  const setCursorState = (state: CursorState, label?: string) => {
    setCursorStateInternal(state);
    if (label !== undefined) setCursorLabel(label);
    else if (state === 'project') setCursorLabel('VIEW ↗');
    else setCursorLabel('');
  };

  const resetCursorState = () => {
    setCursorStateInternal('default');
    setCursorLabel('');
  };

  // Only enable on desktop fine pointer devices
  useEffect(() => {
    const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    setIsEnabled(isFinePointer && !prefersReducedMotion());
  }, []);

  // Wire up tracking once the dot/ring have actually rendered. This must not run in
  // the same effect as setIsEnabled: the elements only mount on the render *after*
  // isEnabled flips, so their refs would still be null and the native cursor would
  // be hidden with nothing drawn in its place.
  useEffect(() => {
    if (!isEnabled) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    document.body.classList.add('custom-cursor-active');

    // Fast quickTo setters
    const xDot = gsap.quickTo(dot, 'x', { duration: 0.05, ease: 'power3' });
    const yDot = gsap.quickTo(dot, 'y', { duration: 0.05, ease: 'power3' });
    const xRing = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power2.out' });
    const yRing = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power2.out' });

    let isVisible = false;

    const onMouseMove = (e: MouseEvent) => {
      if (!isVisible) {
        gsap.to([dot, ring], { opacity: 1, duration: 0.2 });
        isVisible = true;
      }
      xDot(e.clientX);
      yDot(e.clientY);
      xRing(e.clientX);
      yRing(e.clientY);
    };

    const onMouseLeave = () => {
      gsap.to([dot, ring], { opacity: 0, duration: 0.2 });
      isVisible = false;
    };

    window.addEventListener('mousemove', onMouseMove);
    document.documentElement.addEventListener('mouseleave', onMouseLeave);

    // Global listeners for standard interactive elements
    const handleElementHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest('a, button, input, textarea, select, [data-cursor]');
      if (!interactive) {
        return;
      }

      const explicitState = interactive.getAttribute('data-cursor') as CursorState | null;
      if (explicitState) {
        setCursorState(explicitState, interactive.getAttribute('data-cursor-label') || undefined);
      } else if (interactive.tagName === 'INPUT' || interactive.tagName === 'TEXTAREA') {
        setCursorState('input');
      } else {
        setCursorState('pointer');
      }
    };

    const handleElementLeave = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (target.closest('a, button, input, textarea, select, [data-cursor]')) {
        resetCursorState();
      }
    };

    document.addEventListener('mouseover', handleElementHover);
    document.addEventListener('mouseout', handleElementLeave);

    return () => {
      document.body.classList.remove('custom-cursor-active');
      window.removeEventListener('mousemove', onMouseMove);
      document.documentElement.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseover', handleElementHover);
      document.removeEventListener('mouseout', handleElementLeave);
    };
  }, [isEnabled]);

  return (
    <CursorContext.Provider value={{ setCursorState, resetCursorState }}>
      {children}

      {isEnabled && (
        <>
          {/* Inner dot: solid white with a thin dark outline and soft white glow, so it reads
              on dark, light and purple backgrounds alike.
              Only size/colour transition in CSS — GSAP owns the transform, so a CSS transform
              transition would make the cursor lag and drift. */}
          <div
            ref={dotRef}
            aria-hidden="true"
            className={`fixed top-0 left-0 rounded-full pointer-events-none z-[99999] opacity-0 transition-[width,height,margin,border-radius,background-color,scale] duration-200 ${
              cursorState === 'input'
                ? 'w-0.5 h-5 -ml-[1px] -mt-2.5 rounded-none bg-[#7B5CFF] shadow-[0_0_8px_rgba(123,92,255,0.9)]'
                : cursorState === 'project'
                ? 'w-2 h-2 -ml-1 -mt-1 bg-white scale-0'
                : `w-3 h-3 -ml-1.5 -mt-1.5 bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.4),0_0_12px_4px_rgba(255,255,255,0.75)] ${
                    cursorState === 'pointer' ? 'scale-75' : 'scale-100'
                  }`
            }`}
          />

          {/* Outer ring: white glowing circle (outer glow + faint inner glow) */}
          <div
            ref={ringRef}
            aria-hidden="true"
            className={`fixed top-0 left-0 pointer-events-none z-[99998] opacity-0 flex items-center justify-center transition-[width,height,margin,background-color,border-color,box-shadow,scale] duration-300 ease-out select-none ${
              cursorState === 'pointer'
                ? 'w-14 h-14 -ml-7 -mt-7 rounded-full border-2 border-white bg-white/10 shadow-[0_0_24px_4px_rgba(255,255,255,0.45),inset_0_0_14px_rgba(255,255,255,0.3)]'
                : cursorState === 'project'
                ? 'w-[90px] h-[90px] -ml-[45px] -mt-[45px] rounded-full bg-[#7B5CFF] text-white font-display text-xs font-bold tracking-wider shadow-lg shadow-[#7B5CFF]/30'
                : cursorState === 'headline'
                ? 'w-[120px] h-[120px] -ml-[60px] -mt-[60px] rounded-full bg-white/10 border border-white/80 backdrop-blur-[1px] shadow-[0_0_30px_rgba(255,255,255,0.35)]'
                : cursorState === 'input'
                ? 'w-8 h-8 -ml-4 -mt-4 rounded-full border border-white/50'
                : 'w-10 h-10 -ml-5 -mt-5 rounded-full border-[1.5px] border-white/90 shadow-[0_0_16px_3px_rgba(255,255,255,0.4),inset_0_0_10px_rgba(255,255,255,0.25),0_0_0_1px_rgba(0,0,0,0.25)]'
            }`}
          >
            {cursorState === 'project' && (
              <span className="text-[11px] uppercase tracking-wider font-extrabold text-white text-center leading-none">
                {cursorLabel || 'VIEW ↗'}
              </span>
            )}
          </div>
        </>
      )}
    </CursorContext.Provider>
  );
};
