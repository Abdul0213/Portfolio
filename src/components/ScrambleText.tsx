'use client';

import React, { useState, useRef, useEffect } from 'react';
import { prefersReducedMotion } from '../lib/motion';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';

interface ScrambleTextProps {
  text: string;
  className?: string;
  duration?: number;
  triggerOnHover?: boolean;
}

export const ScrambleText: React.FC<ScrambleTextProps> = ({
  text,
  className = '',
  duration = 0.4,
  triggerOnHover = true,
}) => {
  const [displayText, setDisplayText] = useState(text);
  const intervalRef = useRef<number | null>(null);

  const startScramble = () => {
    if (prefersReducedMotion()) return;
    if (intervalRef.current) clearInterval(intervalRef.current);

    const length = text.length;
    let iteration = 0;
    const totalFrames = Math.max(12, Math.floor((duration * 1000) / 30));
    const step = length / totalFrames;

    intervalRef.current = window.setInterval(() => {
      setDisplayText(() => {
        return text
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';
            if (index < iteration) {
              return text[index];
            }
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join('');
      });

      iteration += step;

      if (iteration >= length) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setDisplayText(text);
      }
    }, 30);
  };

  useEffect(() => {
    setDisplayText(text);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [text]);

  return (
    <span
      onMouseEnter={triggerOnHover ? startScramble : undefined}
      className={`inline-block font-mono tracking-tight select-none ${className}`}
    >
      {displayText}
    </span>
  );
};
