/* Star cursor. Drop-in: <script src="star-cursor.js" defer></script>
   Uses the same four-point star path as your logo. No dependencies. */
(() => {
  const fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
  if (!fine || matchMedia('(prefers-reduced-motion:reduce)').matches) return;

  // Anything matching this grows and turns. Add data-cursor to any custom element.
  const HOVER = 'a,button,[role="button"],input,textarea,select,summary,label,.card,[data-cursor]';
  const EASE = 0.2; // 0 to 1. Lower = floatier, higher = tighter.

  const el = document.createElement('div');
  el.id = 'star-cursor';
  el.setAttribute('aria-hidden', 'true');
  el.innerHTML =
    '<svg viewBox="-12 -12 24 24"><path d="M0 -12Q1 -2 9 0Q1 2 0 12Q-1 2 -9 0Q-1 -2 0 -12"/></svg>';
  el.classList.add('out');

  function syncHost() {
    const openDialog = document.querySelector('dialog[open]');
    const isPrelude = !!(openDialog && openDialog.id === 'prelude');
    const target = openDialog || document.body;
    if (target && el.parentElement !== target) {
      target.appendChild(el);
    }
    el.classList.toggle('prelude-cursor', isPrelude);
  }

  const mount = () => {
    syncHost();
    document.documentElement.classList.add('has-star-cursor');

    const observer = new MutationObserver(() => syncHost());
    observer.observe(document.body, { attributes: true, subtree: true, attributeFilter: ['open'] });
    document.addEventListener('close', syncHost, true);
  };

  if (document.body) {
    mount();
  } else {
    document.addEventListener('DOMContentLoaded', mount);
  }

  let x = 0, y = 0, cx = 0, cy = 0, seen = false;

  addEventListener('pointermove', (e) => {
    x = e.clientX; y = e.clientY;
    if (!seen) { cx = x; cy = y; seen = true; } // no fly-in from the corner
    el.classList.remove('out');
    syncHost();
  }, { passive: true });

  document.addEventListener('pointerover', (e) =>
    el.classList.toggle('hover', !!(e.target.closest && e.target.closest(HOVER))));
  document.addEventListener('pointerdown', () => el.classList.add('down'));
  addEventListener('pointerup', () => el.classList.remove('down'));
  document.documentElement.addEventListener('pointerleave', () => el.classList.add('out'));
  window.addEventListener('blur', () => el.classList.add('out'));
  document.addEventListener('visibilitychange', () => { if (document.hidden) el.classList.add('out'); });

  (function tick() {
    cx += (x - cx) * EASE;
    cy += (y - cy) * EASE;
    el.style.transform = `translate3d(${cx}px,${cy}px,0)`;
    requestAnimationFrame(tick);
  })();
})();
