'use client';

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { EASINGS, DURATIONS, prefersReducedMotion } from '../lib/motion';

gsap.registerPlugin(ScrollTrigger);

interface RevealTextProps {
  children: string;
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';
  className?: string;
  delay?: number;
  trigger?: boolean;
}

export const RevealText: React.FC<RevealTextProps> = ({
  children,
  tag: Tag = 'h2',
  className = '',
  delay = 0,
}) => {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (prefersReducedMotion()) {
      el.style.opacity = '1';
      return;
    }

    const lines = children.split('\n');
    el.innerHTML = '';

    const lineElements: HTMLElement[] = [];

    lines.forEach((line) => {
      if (!line.trim()) return;
      const mask = document.createElement('span');
      mask.style.display = 'block';
      mask.style.overflow = 'hidden';

      const inner = document.createElement('span');
      inner.style.display = 'block';
      inner.textContent = line;
      inner.style.transform = 'translateY(110%)';

      mask.appendChild(inner);
      el.appendChild(mask);
      lineElements.push(inner);
    });

    const anim = gsap.to(lineElements, {
      yPercent: 0,
      duration: DURATIONS.base,
      ease: EASINGS.expoOut,
      stagger: 0.1,
      delay,
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        once: true,
      },
    });

    return () => {
      anim.kill();
    };
  }, [children, delay]);

  return <Tag ref={containerRef as any} className={className}>{children}</Tag>;
};
