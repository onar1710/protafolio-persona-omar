import { useEffect } from 'react';

function setupAutoScroll(trackSelector, { intervalMs = 4500, gap = 24 } = {}) {
  const track = document.querySelector(trackSelector);
  if (!track) return () => {};

  const media = window.matchMedia?.('(prefers-reduced-motion: reduce)');
  if (media?.matches) return () => {};

  let timer;
  let paused = false;

  const getStep = () => {
    const first = track.querySelector('article, div');
    if (!first) return 400;
    const rect = first.getBoundingClientRect();
    return rect.width + gap;
  };

  const tick = () => {
    if (paused) return;
    const step = getStep();
    const max = track.scrollWidth - track.clientWidth;

    if (track.scrollLeft + step >= max - 4) {
      track.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      track.scrollBy({ left: step, behavior: 'smooth' });
    }
  };

  const start = () => {
    stop();
    timer = window.setInterval(tick, intervalMs);
  };

  const stop = () => {
    if (timer) window.clearInterval(timer);
    timer = undefined;
  };

  const pause = () => {
    paused = true;
  };

  const resume = () => {
    paused = false;
  };

  track.addEventListener('mouseenter', pause);
  track.addEventListener('mouseleave', resume);
  track.addEventListener('focusin', pause);
  track.addEventListener('focusout', resume);

  const onVisibility = () => {
    if (document.hidden) stop();
    else start();
  };

  document.addEventListener('visibilitychange', onVisibility);

  start();

  return () => {
    stop();
    track.removeEventListener('mouseenter', pause);
    track.removeEventListener('mouseleave', resume);
    track.removeEventListener('focusin', pause);
    track.removeEventListener('focusout', resume);
    document.removeEventListener('visibilitychange', onVisibility);
  };
}

export default function DisenoWebBucaramangaClient() {
  useEffect(() => {
    const cleanups = [];

    cleanups.push(setupAutoScroll('[data-projects-track]', { intervalMs: 4500, gap: 16 }));
    cleanups.push(setupAutoScroll('[data-reviews-track]', { intervalMs: 4500, gap: 24 }));

    return () => {
      cleanups.forEach((fn) => fn());
    };
  }, []);

  return null;
}
