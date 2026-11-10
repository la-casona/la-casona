/* Keep V2 as one application: standalone/admin and the site share its data layer. */
(() => {
  'use strict';
  const section = document.getElementById('menu');
  const frame = document.getElementById('menu-app-frame');
  if (!section || !frame) return;
  const incoming = new URL(location.href);
  const child = new URL(frame.dataset.src, location.href);
  child.searchParams.set('embed', '1');
  // Forward table validation to the existing server-backed flow, never trust a number alone.
  for (const key of ['mesa', 'k', 'modo', 'cielo']) {
    if (incoming.searchParams.has(key)) child.searchParams.set(key, incoming.searchParams.get(key));
  }
  const qrEntry = incoming.searchParams.has('mesa') || incoming.searchParams.has('k');
  const jump = qrEntry || ['#menu', '#menu-digital'].includes(incoming.hash);
  if (qrEntry) frame.loading = 'eager';
  frame.src = child.href;
  // The QR code is consumed once by V2; don't leave it in the parent address bar.
  if (qrEntry || incoming.hash === '#menu-digital') {
    for (const key of ['mesa', 'k', 'modo']) incoming.searchParams.delete(key);
    incoming.hash = 'menu';
    history.replaceState(history.state, '', incoming.href);
  }
  const full = document.getElementById('menu-fullscreen');
  full.addEventListener('click', event => {
    // Use the already-initialized session, not a replay of the original QR.
    event.preventDefault();
    location.assign(new URL('menuV2.html#menu', location.href).href);
  });
  function goToMenu() {
    section.scrollIntoView({behavior:'instant', block:'start'});
  }
  if (jump) {
    goToMenu();
    addEventListener('load', goToMenu, {once:true});
  }
  addEventListener('hashchange', () => {
    if (location.hash === '#menu-digital') {
      const url = new URL(location.href); url.hash = 'menu';
      history.replaceState(history.state, '', url.href);
      goToMenu();
    }
  });
  // Link the existing site pause button to CSS/SVG animations in the embedded menu.
  function syncMotion() {
    try {
      const doc = frame.contentDocument;
      if (!doc?.body) return;
      const paused = document.documentElement.classList.contains('motion-paused');
      doc.documentElement.classList.toggle('integration-motion-paused', paused);
      doc.querySelectorAll('svg').forEach(svg => {
        if (paused) svg.pauseAnimations?.(); else svg.unpauseAnimations?.();
      });
    } catch { /* Standalone navigation may unload the frame. */ }
  }
  frame.addEventListener('load', syncMotion);
  document.addEventListener('casona:motion-change', syncMotion);
})();
