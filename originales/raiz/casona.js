/* Native scrolling + small, progressive animations. No scroll hijacking. */
(() => {
  'use strict';
  const root = document.documentElement;
  const motionButton = document.getElementById('motion-control');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const movingElements = [...document.querySelectorAll('[data-shift]')];
  const turningElements = [...document.querySelectorAll('[data-turn]')];
  let userPaused = false;
  let paused = reducedMotion.matches;
  let frameRequested = false;
  let revealObserver;
  try { userPaused = localStorage.getItem('casona-pause-motion') === 'true'; } catch (_) { /* Browsing without local storage is supported. */ }

  function updateMotionPreference() {
    paused = userPaused || reducedMotion.matches;
    root.classList.toggle('motion-paused', paused);
    motionButton.setAttribute('aria-pressed', String(paused));
    motionButton.setAttribute('aria-label', paused ? 'Activar animaciones' : 'Pausar animaciones');
    motionButton.title = paused ? 'Animaciones pausadas' : 'Pausar animaciones';
    motionButton.querySelector('span').textContent = paused ? '▷' : 'Ⅱ';
    if (paused) {
      document.getAnimations().forEach(animation => {
        if (animation.effect && animation.effect.target?.hasAttribute('data-reveal')) animation.finish();
      });
      movingElements.forEach(element => element.style.setProperty('--offset', '0px'));
      turningElements.forEach(element => element.style.removeProperty('transform'));
    }
    document.dispatchEvent(new CustomEvent('casona:motion-change', {detail:{paused}}));
    requestFrame();
  }

  function renderScroll() {
    frameRequested = false;
    const y = window.scrollY;
    const viewport = window.innerHeight;
    // The hero menu trigger scrolls with the page; no sticky header or progress bar.
    if (paused) return;
    movingElements.forEach(element => {
      const rect = element.getBoundingClientRect();
      if (rect.bottom < -120 || rect.top > viewport + 120) return;
      const distance = Number(element.dataset.shift);
      // The hero fans out slowly; the house snapshot has a small independent drift.
      const travel = element.classList.contains('hero-photo')
        ? Math.min(y / 700, 1.3)
        : Math.max(-1, Math.min(1, (viewport / 2 - rect.top - rect.height / 2) / viewport));
      element.style.setProperty('--offset', `${(travel * distance).toFixed(1)}px`);
    });
    turningElements.forEach(element => {
      const rect = element.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > viewport) return;
      const base = Number(element.dataset.turn);
      const turn = (viewport / 2 - rect.top) / viewport * 12;
      element.style.transform = `rotate(${(base + turn).toFixed(2)}deg)`;
    });
  }
  function requestFrame() {
    if (!frameRequested) { frameRequested = true; requestAnimationFrame(renderScroll); }
  }

  // Navigation is owned exclusively by js/editorial-nav.js.
  motionButton.addEventListener('click', () => {
    // An OS-level reduced-motion preference always takes precedence.
    if (reducedMotion.matches) {
      motionButton.title = 'Movimiento reducido activado en tu dispositivo';
      return;
    }
    userPaused = !userPaused;
    try { localStorage.setItem('casona-pause-motion', String(userPaused)); } catch (_) {}
    updateMotionPreference();
  });
  reducedMotion.addEventListener('change', updateMotionPreference);
  window.addEventListener('scroll', requestFrame, {passive:true});
  window.addEventListener('resize', requestFrame, {passive:true});

  if ('IntersectionObserver' in window) {
    revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const element = entry.target;
        if (!paused && typeof element.animate === 'function') {
          element.animate([
            {opacity:.25, translate:'0 26px'},
            {opacity:1, translate:'0 0'}
          ], {duration:850, easing:'cubic-bezier(.16,1,.3,1)'});
        }
        element.classList.add('is-visible');
        revealObserver.unobserve(element);
      });
    }, {threshold:.12});
    document.querySelectorAll('[data-reveal]').forEach(element => revealObserver.observe(element));
  }

  updateMotionPreference();
  // The hero owns its entrance animation; lower-page motion remains here.
  document.querySelectorAll('img').forEach(image => image.addEventListener('load', requestFrame, {once:true}));
})();
