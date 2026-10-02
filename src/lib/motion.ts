/**
 * Global Motion System
 * Shared animation curves, durations, staggers, and text splitting utility.
 */

export const EASINGS = {
  expoOut: 'expo.out',
  power4Out: 'power4.out',
  power3Out: 'power3.out',
  elasticOut: 'elastic.out(1, 0.4)',
  backOut: 'back.out(1.7)',
  // CSS cubic-bezier matching the system
  cssCurtain: 'cubic-bezier(0.76, 0, 0.24, 1)',
} as const;

export const DURATIONS = {
  fast: 0.4,
  base: 0.8,
  slow: 1.2,
  hero: 1.4,
} as const;

export const STAGGERS = {
  chars: 0.02,
  words: 0.06,
  lines: 0.1,
  cards: 0.12,
} as const;

/**
 * Check if the user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Split text utility for masked typography reveals (lines, words, chars)
 * Wraps each token in an inner span inside an overflow-hidden outer span.
 * Returns an array of the animatable inner span elements.
 */
export function splitText(
  element: HTMLElement,
  type: 'lines' | 'words' | 'chars' = 'chars'
): HTMLElement[] {
  const originalText = element.textContent || '';
  element.innerHTML = '';
  element.setAttribute('data-split', type);

  const innerSpans: HTMLElement[] = [];

  if (type === 'chars') {
    const chars = Array.from(originalText);
    chars.forEach((char) => {
      const outer = document.createElement('span');
      outer.style.display = 'inline-block';
      outer.style.overflow = 'hidden';
      outer.style.verticalAlign = 'top';

      const inner = document.createElement('span');
      inner.style.display = 'inline-block';
      inner.textContent = char === ' ' ? '\u00A0' : char;
      inner.classList.add('split-char');

      outer.appendChild(inner);
      element.appendChild(outer);
      innerSpans.push(inner);
    });
  } else if (type === 'words') {
    const words = originalText.trim().split(/\s+/);
    words.forEach((word, index) => {
      const outer = document.createElement('span');
      outer.style.display = 'inline-block';
      outer.style.overflow = 'hidden';
      outer.style.verticalAlign = 'top';
      outer.style.marginRight = index < words.length - 1 ? '0.28em' : '0';

      const inner = document.createElement('span');
      inner.style.display = 'inline-block';
      inner.textContent = word;
      inner.classList.add('split-word');

      outer.appendChild(inner);
      element.appendChild(outer);
      innerSpans.push(inner);
    });
  } else if (type === 'lines') {
    // For lines, split by explicit line breaks or sentence clauses
    const lines = originalText.split(/\n/);
    lines.forEach((line) => {
      if (!line.trim()) return;
      const outer = document.createElement('span');
      outer.style.display = 'block';
      outer.style.overflow = 'hidden';

      const inner = document.createElement('span');
      inner.style.display = 'block';
      inner.textContent = line.trim();
      inner.classList.add('split-line');

      outer.appendChild(inner);
      element.appendChild(outer);
      innerSpans.push(inner);
    });
  }

  return innerSpans;
}
