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

  useEffect(() => {
    // Only enable on desktop fine pointer devices
    const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!isFinePointer || prefersReducedMotion()) {
      setIsEnabled(false);
      return;
    }

    setIsEnabled(true);
    document.body.classList.add('custom-cursor-active');

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

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
    document.body.addEventListener('mouseleave', onMouseLeave);

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
      document.body.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseover', handleElementHover);
      document.removeEventListener('mouseout', handleElementLeave);
    };
  }, []);

  return (
    <CursorContext.Provider value={{ setCursorState, resetCursorState }}>
      {children}

      {isEnabled && (
        <>
          {/* Inner 8px dot (mix-blend difference) */}
          <div
            ref={dotRef}
            aria-hidden="true"
            className={`fixed top-0 left-0 -ml-1 -mt-1 w-2 h-2 rounded-full pointer-events-none z-[99999] opacity-0 transition-transform duration-200 ${
              cursorState === 'default'
                ? 'bg-white mix-blend-difference scale-100'
                : cursorState === 'input'
                ? 'w-0.5 h-5 -ml-[1px] -mt-2.5 rounded-none bg-[#7B5CFF] scale-100'
                : 'opacity-0 scale-0'
            }`}
          />

          {/* Outer ring */}
          <div
            ref={ringRef}
            aria-hidden="true"
            className={`fixed top-0 left-0 pointer-events-none z-[99998] opacity-0 flex items-center justify-center transition-all duration-300 ease-out select-none ${
              cursorState === 'default'
                ? 'w-10 h-10 -ml-5 -mt-5 rounded-full border border-white/60 mix-blend-difference scale-100'
                : cursorState === 'pointer'
                ? 'w-12 h-12 -ml-6 -mt-6 rounded-full border-2 border-white/90 mix-blend-difference scale-125'
                : cursorState === 'project'
                ? 'w-[90px] h-[90px] -ml-[45px] -mt-[45px] rounded-full bg-[#7B5CFF] text-white font-display text-xs font-bold tracking-wider shadow-lg shadow-[#7B5CFF]/30 scale-100'
                : cursorState === 'headline'
                ? 'w-[120px] h-[120px] -ml-[60px] -mt-[60px] rounded-full bg-white/20 border border-white/40 backdrop-blur-[1px] mix-blend-difference scale-100'
                : cursorState === 'input'
                ? 'w-8 h-8 -ml-4 -mt-4 rounded-full border border-[#7B5CFF]/40 opacity-40'
                : 'w-10 h-10 -ml-5 -mt-5 rounded-full border border-white/60 mix-blend-difference'
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
