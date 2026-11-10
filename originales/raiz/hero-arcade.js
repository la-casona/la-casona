/* Optional hero enhancement. Contact links and content do not depend on WebGL. */
(() => {
  'use strict';
  const hero = document.querySelector('.arcade-hero');
  if (!hero) return;
  const stage = document.getElementById('entry-stage');
  const canvasHost = document.getElementById('entry-canvas');
  const caption = stage.querySelector('.entry-caption');
  const status = document.getElementById('entry-status');
  const skip = document.getElementById('skip-entrance');
  const replay = document.getElementById('replay-entrance');
  const greeting = document.getElementById('local-greeting');
  const clock = document.getElementById('local-clock');
  const symbol = document.getElementById('day-symbol');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const params = new URLSearchParams(location.search);
  const bypass = params.get('entrada') === '0';
  const force = params.get('entrada') === '1';
  const forceSimple = params.get('entrada') === 'simple';
  let formatter;
  try { formatter = new Intl.DateTimeFormat('es-MX', {timeZone:'America/Mexico_City', hour:'2-digit', minute:'2-digit', hourCycle:'h23'}); } catch (_) {}
  let sessionSeen = false;
  try { sessionSeen = sessionStorage.getItem('casona-entry-seen') === '1'; } catch (_) {}
  const motionPaused = () => reduced.matches || document.documentElement.classList.contains('motion-paused');
  let run = null;
  let introModule;
  let revealAnimations = [];
  let clockInterval;
  let inkTimer;
  let activeInk = null;
  const inkMobile = matchMedia('(max-width: 700px)');
  const forcedColors = matchMedia('(forced-colors: active)');
  // SMIL animates the filter attribute itself, not a transform of the letters.
  // No extra RAF, noise reseeding, interval, or perpetual rendering loop.
  function stopInkSettle() {
    clearTimeout(inkTimer);
    if (activeInk) {
      try { activeInk.endElement(); } catch (_) { /* Static filter is the fallback. */ }
      activeInk = null;
    }
  }
  function settleInk() {
    if (motionPaused() || document.hidden || forcedColors.matches || navigator.connection?.saveData) return;
    if (hero.getBoundingClientRect().bottom <= 0) return;
    const animation = document.getElementById(inkMobile.matches ? 'ink-settle-mobile' : 'ink-settle-desktop');
    if (typeof animation?.beginElement !== 'function') return;
    try { activeInk = animation; animation.beginElement(); }
    catch (_) { activeInk = null; }
  }
  inkMobile.addEventListener('change', stopInkSettle);
  forcedColors.addEventListener('change', stopInkSettle);

  function updateClock() {
    if (!formatter) return;
    try {
      const now = new Date();
      const parts = formatter.formatToParts(now);
      const hour = Number(parts.find(p => p.type === 'hour').value);
      const minute = parts.find(p => p.type === 'minute').value;
      const period = hour >= 5 && hour < 12 ? 'morning' : hour >= 12 && hour < 19 ? 'afternoon' : 'night';
      if (!hero.dataset.greetingMotion) {
        greeting.textContent = period === 'morning' ? 'Buenos días.' : period === 'afternoon' ? 'Buenas tardes.' : 'Buenas noches.';
        symbol.textContent = period === 'night' ? '☾' : '☀';
      }
      clock.textContent = `${String(hour).padStart(2,'0')}:${minute}`;
      clock.dateTime = now.toISOString();
      document.getElementById('clock-separator').hidden = false;
      hero.dataset.dayPeriod = period;
    } catch (_) { /* The neutral greeting in HTML remains valid. */ }
  }
  function startClock() {
    clearInterval(clockInterval);
    updateClock();
    clockInterval = setInterval(() => { if (!document.hidden) updateClock(); }, 60000);
  }
  startClock();

  function stopHeroReveal() {
    stopInkSettle();
    revealAnimations.forEach(animation => animation.cancel());
    revealAnimations = [];
  }
  function revealHero() {
    stopHeroReveal();
    if (motionPaused() || document.hidden || window.scrollY > hero.offsetHeight / 2) return;
    const animate = (element, frames, duration, delay = 0) => {
      if (element && typeof element.animate === 'function') {
        revealAnimations.push(element.animate(frames, {
          duration, delay, easing:'cubic-bezier(.22,1,.36,1)', fill:'backwards'
        }));
      }
    };
    // Keep the approved reveal. Ink settling follows it, rather than competing.
    inkTimer = setTimeout(settleInk, 1100);
    // One short settling gesture, not a perpetual wobble.
    hero.querySelectorAll('.hero-line').forEach((line, index) => {
      animate(line, [
        {opacity:.7, translate:'0 8px', rotate:index ? '.25deg' : '-.35deg'},
        {opacity:1, translate:'0 0', rotate:'0deg'}
      ], 850, index * 90);
    });
    animate(hero.querySelector('.hero-subtitle'), [
      {opacity:.65, translate:'0 5px'}, {opacity:1, translate:'0 0'}
    ], 700, 130);
    // Assemble the existing paper collage from the centre outwards.
    // Keep every z-index fixed, including while the pointer is over a photo.
    // hero-alive.js owns the photo choreography when present.
    if (!document.documentElement.dataset.heroAlive) ['.photo-patio','.photo-table','.photo-food','.photo-entrance','.photo-garden'].forEach((selector, index) => {
      const photo = hero.querySelector(selector);
      if (!photo || getComputedStyle(photo).display === 'none') return;
      const side = index === 0 ? 0 : index % 2 ? -1 : 1;
      animate(photo, [
        {opacity:.5, translate:`${side * 9}px ${index ? 18 : 12}px`, rotate:`${side * 1.5}deg`},
        {opacity:1, translate:'0 0', rotate:'0deg'}
      ], 900, 100 + index * 65);
    });
  }
  function saveSeen() { try { sessionStorage.setItem('casona-entry-seen', '1'); } catch (_) {} }
  function finish(reason = 'complete', animate = true) {
    const current = run;
    if (!current || current.finishing) return;
    current.finishing = true;
    clearTimeout(current.limit);
    clearTimeout(current.simpleTimer);
    cancelAnimationFrame(current.frame);
    current.fallbackAnimation?.cancel();
    const hadFocus = stage.contains(document.activeElement);
    const duration = animate && !motionPaused() ? 420 : 0;
    if (duration) stage.classList.add('is-leaving');
    current.finishTimer = setTimeout(() => {
      current.scene?.dispose();
      stage.hidden = true;
      stage.classList.remove('is-leaving', 'has-webgl');
      canvasHost.replaceChildren();
      hero.dataset.entryState = 'ready';
      hero.dataset.entryResult = reason;
      run = null;
      replay.disabled = motionPaused();
      if (hadFocus) (replay.disabled ? hero.querySelector('.hero-menu-button') : replay).focus({preventScroll:true});
      saveSeen();
      if (animate) revealHero();
      hero.dispatchEvent(new CustomEvent('casona:entry-finished', {detail:{reason}}));
    }, duration);
  }
  function simpleEntrance(current, reason) {
    if (run !== current || current.finishing) return;
    cancelAnimationFrame(current.frame);
    current.scene?.dispose();
    current.scene = null;
    stage.classList.remove('has-webgl');
    caption.style.removeProperty('opacity');
    status.textContent = 'Bienvenido a La Casona.';
    hero.dataset.entryState = 'simple';
    hero.dataset.entryMode = 'simple';
    const arch = stage.querySelector('.entry-fallback');
    if (!motionPaused() && arch.animate) current.fallbackAnimation = arch.animate([
      {transform:'scale(1)',opacity:.22}, {transform:'scale(1.15)',opacity:0}
    ], {duration:650, easing:'ease-out'});
    current.simpleTimer = setTimeout(() => finish(reason), motionPaused() ? 0 : 650);
  }
  function canUse3D() {
    return !forceSimple && !navigator.connection?.saveData && !(navigator.deviceMemory && navigator.deviceMemory <= 2);
  }
  async function playEntrance(manual = false) {
    if (run || motionPaused() || (bypass && !manual)) return;
    if (manual) window.scrollTo({top:0, behavior:'instant'});
    else if (window.scrollY > 45) return;
    stopHeroReveal();
    const current = {scene:null, frame:0, finishing:false};
    run = current;
    replay.disabled = true;
    stage.hidden = false;
    stage.classList.remove('is-leaving', 'has-webgl');
    caption.style.removeProperty('opacity');
    status.textContent = 'Preparando la entrada…';
    hero.dataset.entryState = 'loading';
    hero.dataset.entryMode = 'pending';
    // Real loading state, never a fictitious percentage, with an absolute exit.
    current.limit = setTimeout(() => finish('timeout', false), 5200);
    if (!canUse3D()) { simpleEntrance(current, 'simple-preference'); return; }
    let importDeadline;
    try {
      if (!introModule) introModule = import('./arcade-scene.js');
      const module = await Promise.race([
        introModule,
        new Promise((_, reject) => { importDeadline = setTimeout(() => reject(new Error('import-timeout')), 1600); })
      ]);
      clearTimeout(importDeadline);
      if (run !== current || current.finishing || motionPaused()) return;
      // Texture is optional. Never hold the entrance for a photograph.
      current.scene = module.createArcadeScene(canvasHost, document.getElementById('entrance-photo'), () => {
        if (run === current && !current.finishing) simpleEntrance(current, 'context-lost');
      });
      if (run !== current || current.finishing) { current.scene.dispose(); return; }
      stage.classList.add('has-webgl');
      status.textContent = 'El patio está al otro lado.';
      hero.dataset.entryState = 'playing';
      hero.dataset.entryMode = 'webgl';
      const stats = current.scene.stats();
      hero.dataset.entryDrawCalls = String(stats.drawCalls);
      hero.dataset.entryTriangles = String(stats.triangles);
      hero.dataset.entryPixelRatio = String(stats.pixelRatio);
      const mobile = matchMedia('(max-width: 700px)').matches;
      const duration = mobile ? 2100 : 2450;
      const fps = mobile ? 30 : 45;
      const start = performance.now();
      let last = 0;
      function frame(time) {
        if (run !== current || current.finishing) return;
        const progress = Math.min(1, (time - start) / duration);
        if (time - last >= 1000 / fps || progress >= 1) {
          try { current.scene.render(progress); }
          catch (_) { simpleEntrance(current, 'render-fallback'); return; }
          last = time;
          if (progress > .58) caption.style.opacity = String(Math.max(0, 1 - (progress - .58) / .25));
        }
        if (progress >= .9) { finish('complete'); return; }
        current.frame = requestAnimationFrame(frame);
      }
      current.frame = requestAnimationFrame(frame);
    } catch (_) {
      clearTimeout(importDeadline);
      introModule = null;
      simpleEntrance(current, 'webgl-unavailable');
    }
  }

  replay.hidden = false;
  replay.disabled = motionPaused();
  replay.addEventListener('click', () => playEntrance(true));
  skip.addEventListener('click', () => finish('skipped', false));
  stage.querySelector('a').addEventListener('click', () => finish('menu', false));
  document.querySelector('.header-cta').addEventListener('click', () => finish('menu', false));
  document.getElementById('nav-toggle').addEventListener('click', () => finish('navigation', false));
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && run) finish('escape', false); });
  document.addEventListener('focusin', event => {
    if (run && !stage.contains(event.target) && event.target !== replay) finish('keyboard', false);
  });
  window.addEventListener('scroll', () => {
    if (run && scrollY > 45) finish('scroll', false);
    if (revealAnimations.length && hero.getBoundingClientRect().bottom <= 0) stopHeroReveal();
  }, {passive:true});
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopHeroReveal();
      if (run) finish('background', false);
    } else updateClock();
  });
  function onMotionChange() {
    replay.disabled = motionPaused();
    if (motionPaused()) {
      stopHeroReveal();
      if (run) finish('reduced-motion', false);
    }
  }
  document.addEventListener('casona:motion-change', onMotionChange);
  reduced.addEventListener('change', onMotionChange);
  window.addEventListener('pagehide', () => {
    clearInterval(clockInterval);
    stopHeroReveal();
    if (run) {
      clearTimeout(run.limit); clearTimeout(run.simpleTimer); clearTimeout(run.finishTimer);
      cancelAnimationFrame(run.frame); run.scene?.dispose(); run = null;
      stage.hidden = true; hero.dataset.entryState = 'ready';
    }
  });
  window.addEventListener('pageshow', event => { if (event.persisted) { startClock(); replay.disabled = motionPaused(); } });
  if (motionPaused() || bypass || (sessionSeen && !force && !forceSimple) || (location.hash && location.hash !== '#inicio') || scrollY > 45) {
    hero.dataset.entryState = 'ready';
    hero.dataset.entryMode = 'static';
    hero.dataset.entryResult = motionPaused() ? 'reduced-motion' : 'direct';
    if (!bypass && !motionPaused() && !location.hash && scrollY <= 45) revealHero();
  } else {
    requestAnimationFrame(() => playEntrance());
  }
})();
