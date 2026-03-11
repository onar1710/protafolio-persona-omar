(() => {
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) return;

  const init = () => {
    const tracks = Array.from(document.querySelectorAll('[data-projects-track], [data-reviews-track]'));

    const setupAutoScroll = (track) => {
      if (!track) return;

      let timer;
      let paused = false;

      const getStep = () => {
        const first = track.firstElementChild;
        if (!first) return 400;
        const rect = first.getBoundingClientRect();
        const style = window.getComputedStyle(track);
        const gapPx = parseFloat(style.columnGap || style.gap || '0') || 0;
        return rect.width + gapPx;
      };

      const tick = () => {
        if (paused) return;

        const step = getStep();
        const max = track.scrollWidth - track.clientWidth;
        if (max <= 0) return;

        if (track.scrollLeft + step >= max - 4) {
          track.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          track.scrollTo({ left: track.scrollLeft + step, behavior: 'smooth' });
        }
      };

      const start = () => {
        stop();
        timer = window.setInterval(tick, 4500);
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
      track.addEventListener('touchstart', pause, { passive: true });
      track.addEventListener('touchend', resume, { passive: true });

      document.addEventListener('visibilitychange', () => {
        if (document.hidden) stop();
        else start();
      });

      start();
      window.setTimeout(tick, 1100);
    };

    for (const t of tracks) setupAutoScroll(t);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
