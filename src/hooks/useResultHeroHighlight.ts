import { useEffect, useRef } from 'react';

const SCROLL_OFFSET_PX = 20;

/**
 * After calculate, smooth-scrolls the result hero into view and runs the glow animation.
 */
export function useResultHeroHighlight(highlightTick: number, active: boolean) {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!highlightTick || !active) return;

    const timer = window.setTimeout(() => {
      const el = heroRef.current;
      if (!el) return;

      const top = el.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET_PX;
      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });

      el.classList.remove('result-hero--glow');
      void el.offsetWidth;
      el.classList.add('result-hero--glow');

      const onEnd = () => {
        el.classList.remove('result-hero--glow');
        el.removeEventListener('animationend', onEnd);
      };
      el.addEventListener('animationend', onEnd);
    }, 80);

    return () => window.clearTimeout(timer);
  }, [highlightTick, active]);

  return heroRef;
}
