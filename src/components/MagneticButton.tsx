'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { EASINGS, prefersReducedMotion } from '../lib/motion';

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string;
  download?: string;
  target?: string;
  rel?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'pill' | 'ghost';
  strength?: number;
  className?: string;
  children: React.ReactNode;
  dataCursor?: string;
  dataCursorLabel?: string;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  href,
  download,
  target,
  rel,
  variant = 'primary',
  strength = 0.35,
  className = '',
  children,
  onClick,
  dataCursor,
  dataCursorLabel,
  ...props
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion()) return;
    const container = containerRef.current;
    const text = textRef.current;
    if (!container) return;

    // Check fine pointer
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(container, {
      x: x * strength,
      y: y * strength,
      duration: 0.3,
      ease: 'power2.out',
    });

    if (text) {
      gsap.to(text, {
        x: x * (strength * 1.35),
        y: y * (strength * 1.35),
        duration: 0.3,
        ease: 'power2.out',
      });
    }
  };

  const handleMouseLeave = () => {
    if (prefersReducedMotion()) return;
    const container = containerRef.current;
    const text = textRef.current;
    if (!container) return;

    gsap.to(container, {
      x: 0,
      y: 0,
      duration: 0.8,
      ease: EASINGS.elasticOut,
    });

    if (text) {
      gsap.to(text, {
        x: 0,
        y: 0,
        duration: 0.8,
        ease: EASINGS.elasticOut,
      });
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-[#7B5CFF] text-white border border-[#7B5CFF] shadow-[0_0_25px_rgba(123,92,255,0.35)] hover:shadow-[0_0_35px_rgba(123,92,255,0.6)]';
      case 'secondary':
        return 'bg-[#1F1F1F] text-[#F5F5F5] border border-[#2A2A2A] hover:border-[#7B5CFF]/60 hover:text-white';
      case 'outline':
        return 'bg-transparent text-[#F5F5F5] border border-[#2A2A2A] hover:border-[#7B5CFF] hover:text-white';
      case 'pill':
        return 'bg-[#161616] text-[#F5F5F5] border border-[#2A2A2A] rounded-full hover:border-[#7B5CFF]';
      case 'ghost':
        return 'bg-transparent text-[#9A9A9A] hover:text-white';
      default:
        return 'bg-[#7B5CFF] text-white';
    }
  };

  const content = (
    <div
      ref={textRef}
      className="relative z-10 flex items-center justify-center gap-2 pointer-events-none transition-colors duration-300"
    >
      {/* Text rollup structure */}
      <span className="relative inline-flex overflow-hidden leading-tight">
        <span className="flex items-center justify-center gap-2 whitespace-nowrap transition-transform duration-300 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-full">
          {children}
        </span>
        <span
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center gap-2 whitespace-nowrap translate-y-full transition-transform duration-300 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-y-0 text-white font-medium"
        >
          {children}
        </span>
      </span>
    </div>
  );

  // Full-width buttons need a full-width magnetic wrapper too
  const wrapperClasses = /(^|\s)w-full(\s|$)/.test(className) ? 'block w-full' : 'inline-block';

  const baseClasses = `group relative inline-flex items-center justify-center overflow-hidden rounded-full font-medium transition-all duration-300 select-none cursor-pointer ${getVariantStyles()} ${className}`;

  if (href) {
    return (
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={wrapperClasses}
      >
        <a
          href={href}
          download={download}
          target={target}
          rel={rel}
          onClick={onClick as any}
          data-cursor={dataCursor || 'pointer'}
          data-cursor-label={dataCursorLabel}
          className={baseClasses}
        >
          {/* Bottom fill wipe */}
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-[#5530A7] translate-y-[101%] transition-transform duration-400 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-y-0 pointer-events-none"
          />
          {content}
        </a>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={wrapperClasses}
    >
      <button
        onClick={onClick}
        data-cursor={dataCursor || 'pointer'}
        data-cursor-label={dataCursorLabel}
        className={baseClasses}
        {...props}
      >
        {/* Bottom fill wipe */}
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-[#5530A7] translate-y-[101%] transition-transform duration-400 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-y-0 pointer-events-none"
        />
        {content}
      </button>
    </div>
  );
};
