/* Tinta fresca: después del secado inicial (SMIL en index.html), el campo de humedad
   se desliza muy lento bajo el papel fijo. Un solo atributo de offset + escala, a 15 fps.
   El puntero cerca del título sube la humedad, como soplar sobre tinta fresca. */
(() => {
  'use strict';
  const hero = document.querySelector('.arcade-hero');
  const title = document.getElementById('hero-title');
  if (!hero || !title) return;
  const root = document.documentElement;
  const mobileQ = matchMedia('(max-width: 700px)');
  const reducedQ = matchMedia('(prefers-reduced-motion: reduce)');
  const forcedQ = matchMedia('(forced-colors: active)');
  const fineQ = matchMedia('(hover: hover) and (pointer: fine)');
  const FRAME = 1000 / 15;
  const PROFILES = {
    desktop: {id: 'casona-printed-ink', base: 3, breath: .35, wet: 1.3, drift: 12, period: 11000},
    mobile:  {id: 'casona-printed-ink-mobile', base: 1.5, breath: .18, wet: 0, drift: 7, period: 13000}
  };
  let profile, nodes = null, raf = 0, last = 0, visible = true, humidity = 0, target = 0;
  const start = performance.now();

  function bind() {
    profile = mobileQ.matches ? PROFILES.mobile : PROFILES.desktop;
    const filter = document.getElementById(profile.id);
    nodes = filter ? {offset: filter.querySelector('feOffset'), map: filter.querySelector('feDisplacementMap')} : null;
  }
  const paused = () => reducedQ.matches || forcedQ.matches || root.classList.contains('motion-paused')
    || document.hidden || !visible || !!navigator.connection?.saveData;

  function rest() {
    if (!nodes) return;
    nodes.offset.setAttribute('dx', '0');
    nodes.offset.setAttribute('dy', '0');
    nodes.map.setAttribute('scale', String(profile.base));
  }
  function tick(now) {
    raf = 0;
    if (paused() || !nodes) return;
    raf = requestAnimationFrame(tick);
    if (now - last < FRAME) return;
    last = now;
    const phase = (now - start) / profile.period * Math.PI * 2;
    humidity += (target - humidity) * .12;
    const dx = (Math.sin(phase) * .5 + .5) * profile.drift;          // 0 → drift: nunca deja vacío el borde izquierdo
    const dy = Math.sin(phase * .6 + 1.3) * profile.drift * .18;
    const scale = profile.base + Math.sin(phase * 1.7) * profile.breath + humidity * profile.wet;
    nodes.offset.setAttribute('dx', dx.toFixed(2));
    nodes.offset.setAttribute('dy', dy.toFixed(2));
    nodes.map.setAttribute('scale', scale.toFixed(2));
  }
  function sync() {
    if (paused()) { if (raf) cancelAnimationFrame(raf); raf = 0; return; }
    if (!raf) { last = 0; raf = requestAnimationFrame(tick); }
  }

  hero.addEventListener('pointermove', event => {
    if (!fineQ.matches) return;
    const box = title.getBoundingClientRect();
    const dx = event.clientX - (box.left + box.width / 2);
    const dy = event.clientY - (box.top + box.height / 2);
    target = Math.max(0, 1 - Math.hypot(dx, dy * 1.6) / (box.width * .62));
  }, {passive: true});
  hero.addEventListener('pointerleave', () => { target = 0; });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); }).observe(title);
  }
  mobileQ.addEventListener('change', () => { rest(); bind(); rest(); sync(); });
  [reducedQ, forcedQ].forEach(query => query.addEventListener('change', () => { if (paused()) rest(); sync(); }));
  document.addEventListener('visibilitychange', sync);
  document.addEventListener('casona:motion-change', () => { if (paused()) rest(); sync(); });

  bind();
  sync();
})();
