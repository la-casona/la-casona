/* La Casona — hero vivo v2 · "boceto a lápiz"
   Cada foto tiene un contorno dibujado a mano (SVG) que se traza, hierve y se borra.
   Line boil real: 3 variantes de trazo con semilla, ciclo a 8 fps (12 fps en el beat).
   Las fotos NUNCA se deforman: se mueven como papel (resortes, flotación, squash leve).
   Solo transforma .photo-frame y su .ink-sketch; el <figure> conserva --rotate y z-index. */
(() => {
  const hero = document.querySelector('.arcade-hero');
  const collage = hero && hero.querySelector('.arcade-collage');
  if (!hero || !collage) return;

  const root = document.documentElement;
  root.dataset.heroAlive = '1';                       // hero-arcade.js ya no anima las fotos
  const reduceMQ = matchMedia('(prefers-reduced-motion: reduce)');
  const fineMQ = matchMedia('(hover: hover) and (pointer: fine)');
  const noise = document.getElementById('boil-noise');
  const NS = 'http://www.w3.org/2000/svg';

  // Personalidad de cada foto: el patio abre, los vecinos responden, los extremos cierran
  const PROFILES = {
    'photo-patio':    { ax: 1.1, ay: 2.4, rot: .3,  br: .008, per: 8.3, depth: 1.2, delay: 0,   kick: 0,  drop: 48, keep: true },
    'photo-table':    { ax: 1.7, ay: 3.6, rot: .55, br: .006, per: 6.1, depth: .8,  delay: 230, kick: 1,  drop: 38 },
    'photo-food':     { ax: 2.0, ay: 3.2, rot: .6,  br: .006, per: 5.6, depth: .85, delay: 320, kick: -1, drop: 40 },
    'photo-entrance': { ax: 2.3, ay: 2.8, rot: .45, br: .005, per: 7.4, depth: .55, delay: 450, kick: -1, drop: 32 },
    'photo-garden':   { ax: 2.5, ay: 2.6, rot: .5,  br: .005, per: 6.9, depth: .6,  delay: 520, kick: 1,  drop: 34 }
  };

  // Aleatoriedad con semilla: el mismo "dibujo" en cada ciclo, nunca ruido nuevo por frame
  const hash = n => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
  const rng = seed => { let s = (seed * 9301 + 49297) % 233280 || 1; return () => (s = (s * 16807) % 2147483647) / 2147483647; };
  const fmt = p => p[0].toFixed(1) + ',' + p[1].toFixed(1);

  /* ---------- Generador de trazo a mano ---------- */
  function sketch(w, h, arch, seed, pad, amp) {
    const r = rng(seed), n = () => (r() + r() - 1) * amp;
    const L = -pad, T = -pad, R = w + pad, B = h + pad, pts = [];
    const line = (x1, y1, x2, y2, k) => {
      for (let i = 0; i < k; i++) { const t = i / k; pts.push([x1 + (x2 - x1) * t + n(), y1 + (y2 - y1) * t + n()]); }
    };
    if (arch) {
      const rx = (R - L) / 2, ry = (B - T) * .48, cx = L + rx, cy = T + ry;
      line(L, B, L, cy, 5);
      for (let i = 0; i < 18; i++) { const a = Math.PI * (1 + i / 18); pts.push([cx + Math.cos(a) * rx + n(), cy + Math.sin(a) * ry + n()]); }
      line(R, cy, R, B, 5);
    } else {
      line(L, B, L, T, 6); line(L, T, R, T, 7); line(R, T, R, B, 6);
    }
    line(R, B, L, B, 7);
    // La mano se pasa del punto de inicio: el cierre "sobregirado" de un boceto real
    pts.push([pts[0][0] + n(), pts[0][1] + n()], [pts[1][0] + 2.5 + n(), pts[1][1] - 3 + n()]);
    let d = 'M' + fmt(pts[0]);
    for (let i = 1; i < pts.length - 1; i++) {
      const m = [(pts[i][0] + pts[i + 1][0]) / 2, (pts[i][1] + pts[i + 1][1]) / 2];
      d += 'Q' + fmt(pts[i]) + ' ' + fmt(m);
    }
    return d + 'L' + fmt(pts[pts.length - 1]);
  }

  // Estallido del patio: 7 trazos cortos radiando desde el arco
  function burstPaths(w, h, seed) {
    const r = rng(seed), rx = w / 2 + 6, ry = h * .48 + 6, cx = w / 2, cy = h * .48;
    return Array.from({ length: 7 }, (_, i) => {
      const a = Math.PI * (1.1 + i * .8 / 6) + (r() - .5) * .12;
      const k1 = 12 + r() * 6, k2 = k1 + 13 + r() * 9;
      const p1 = [cx + Math.cos(a) * (rx + k1), cy + Math.sin(a) * (ry + k1)];
      const p2 = [cx + Math.cos(a) * (rx + k2) + (r() - .5) * 3, cy + Math.sin(a) * (ry + k2) + (r() - .5) * 3];
      const bend = [(p1[0] + p2[0]) / 2 + (r() - .5) * 5, (p1[1] + p2[1]) / 2 + (r() - .5) * 5];
      return 'M' + fmt(p1) + 'Q' + fmt(bend) + ' ' + fmt(p2);
    });
  }

  /* ---------- Actores ---------- */
  const actors = [...collage.querySelectorAll('.hero-photo')].map((fig, i) => {
    const key = Object.keys(PROFILES).find(k => fig.classList.contains(k)) || 'photo-patio';
    const frame = fig.querySelector('.photo-frame');
    if (!frame) return null;
    fig.getAnimations?.().forEach(an => an.cancel());   // sin entradas en paralelo

    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('class', 'ink-sketch' + (key === 'photo-patio' ? ' ink-warm' : ''));
    svg.setAttribute('aria-hidden', 'true');
    const mk = cls => { const p = document.createElementNS(NS, 'path'); p.setAttribute('class', cls); p.setAttribute('pathLength', '1'); svg.appendChild(p); return p; };
    const re = mk('ink-line ink-retrace'), main = mk('ink-line');
    const ticks = key === 'photo-patio' ? Array.from({ length: 7 }, (_, t) => { const p = mk('ink-tick'); p.style.setProperty('--i', t); return p; }) : [];
    fig.appendChild(svg);

    return {
      fig, frame, svg, main, re, ticks, key, p: PROFILES[key], dir: PROFILES[key].kick || 1, seed: i * 17 + 3,
      y: 0, vy: 0, r: 0, vr: 0, s: 0, vs: 0, excite: 0, op: 1, hold: false, landing: false, appear: 0,
      kx: 0, ky: 0, kr: 0, jit: 0, variants: null
    };
  }).filter(Boolean);

  const accents = [...collage.querySelectorAll('.alive-accent')];
  const patio = actors.find(a => a.key === 'photo-patio');

  let running = false, visible = true, raf = 0, last = 0, clock = 0;
  let boilStep = -1, boilIdx = 0, boilFast = 0, jitterStep = -1, nextBeat = 0, entered = false;
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  const timers = new Set();
  const later = (fn, ms) => { const id = setTimeout(() => { timers.delete(id); fn(); }, ms); timers.add(id); };
  const clearTimers = () => { timers.forEach(clearTimeout); timers.clear(); };
  const paused = () => reduceMQ.matches || root.classList.contains('motion-paused') ||
    document.body.classList.contains('motion-paused') || document.hidden || !visible;

  /* ---------- Trazos: construir y pintar variantes ---------- */
  function build(a) {
    const w = a.frame.offsetWidth, h = a.frame.offsetHeight;
    if (!w || !h) { a.variants = null; return; }
    const arch = parseFloat(getComputedStyle(a.frame).borderTopLeftRadius) > 12;
    a.svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
    Object.assign(a.svg.style, { left: a.frame.offsetLeft + 'px', top: a.frame.offsetTop + 'px', width: w + 'px', height: h + 'px' });
    a.variants = [0, 1, 2].map(v => ({
      main: sketch(w, h, arch, a.seed * 7 + v, 7, 1.6),
      re: sketch(w, h, arch, a.seed * 7 + v + 40, 4, 2.3),
      ticks: a.ticks.length ? burstPaths(w, h, a.seed + v * 31) : null
    }));
    paint(a);
  }
  function paint(a) {
    const v = a.variants && a.variants[boilIdx % 3];
    if (!v) return;
    a.main.setAttribute('d', v.main);
    a.re.setAttribute('d', v.re);
    if (v.ticks) a.ticks.forEach((t, i) => t.setAttribute('d', v.ticks[i]));
  }
  const buildAll = () => actors.forEach(build);

  function ink(a, state) {
    if (state === 'draw') {
      if (a.fig.dataset.ink === 'draw') return;
      a.fig.dataset.ink = 'off'; void a.svg.getBoundingClientRect();   // reinicia la animación
    }
    a.fig.dataset.ink = state;
  }
  function burstTicks(a) {
    if (!a || !a.ticks.length || paused()) return;
    a.svg.classList.remove('is-burst'); void a.svg.getBoundingClientRect();
    a.svg.classList.add('is-burst');
    boilFast = clock + .7;
    later(() => a.svg.classList.remove('is-burst'), 1000);
  }

  /* ---------- Física: resorte subamortiguado → overshoot y asentamiento ---------- */
  const K = 165, C = 11.5;
  function stepSpring(a, dt) {
    a.vy += (-K * a.y - C * a.vy) * dt; a.y += a.vy * dt;
    a.vr += (-K * a.r - C * a.vr) * dt; a.r += a.vr * dt;
    a.vs += (-K * 1.3 * a.s - C * a.vs) * dt; a.s += a.vs * dt;
  }
  const impulse = (a, vy = 0, vr = 0, vs = 0) => { a.vy += vy; a.vr += vr; a.vs += vs; };

  /* ---------- Entrada: boceto → caída → aterrizaje → asentamiento → borrado ---------- */
  function entrance() {
    entered = true; clearTimers();
    actors.forEach(a => {
      ink(a, 'off');
      a.op = 0; a.hold = true; a.landing = true;
      a.y = -a.p.drop; a.r = -3.2 * a.dir; a.s = -1.9; a.vy = a.vr = a.vs = 0; a.excite = 0;
      later(() => ink(a, 'draw'), a.p.delay);                              // 1 · la mano dibuja el lugar
      later(() => { a.hold = false; a.appear = performance.now(); impulse(a, 120, 16 * a.dir, 0); }, a.p.delay + 300); // 2 · cae
      if (!a.p.keep) later(() => ink(a, 'erase'), a.p.delay + 1350);      // 5 · el lápiz se va
    });
    hero.classList.remove('alive-pending');
    later(() => burstTicks(patio), 760);
    later(() => burst(accents[0]), 820);
    later(() => burst(accents[1]), 1000);
    nextBeat = clock + 7.5;
  }

  /* ---------- Beat de firma: el arco toma aire, se estira y suelta trazos ---------- */
  function signatureBeat() {
    if (!patio) return;
    impulse(patio, 70, 0, 2.4);                                 // anticipación: se aplasta
    later(() => {
      impulse(patio, -290, -7, -4.4);                           // estira y salta
      burstTicks(patio);
      accents.forEach((el, i) => later(() => burst(el), 120 + i * 90));
      actors.forEach((a, idx) => {                              // los vecinos responden tarde
        if (a === patio) return;
        const dist = Math.abs(idx - actors.indexOf(patio)) || 1;
        later(() => impulse(a, -80 / dist, 20 * a.dir / dist, -.8 / dist), 90 + dist * 110);
      });
    }, 160);
  }

  /* ---------- Acentos dibujados: fotogramas en doses (12 fps) ---------- */
  function burst(el) {
    if (!el || paused()) return;
    [1, 2, 3, 2, 3, 4, 0].forEach((f, i) => later(() => { el.dataset.frame = f; }, i * 83));
  }

  /* ---------- Bucle ---------- */
  function frame(t) {
    raf = 0;
    if (paused()) { stop(); return; }
    const dt = Math.min(.034, (t - (last || t)) / 1000);
    last = t; clock += dt;

    // Line boil: cambia de "dibujo" a 8 fps (12 en el beat). Ramitas: semilla del filtro.
    const rate = clock < boilFast ? 12 : 8;
    const b = Math.floor(clock * rate);
    if (b !== boilStep) {
      boilStep = b; boilIdx++;
      actors.forEach(a => { const st = a.fig.dataset.ink; if (st && st !== 'off') paint(a); });
      if (noise && boilIdx % 2 === 0) noise.setAttribute('seed', [3, 11, 19, 27][(boilIdx / 2) % 4]);
    }
    const j = Math.floor(clock * 6);                  // pose "redibujada" en doses
    const jChanged = j !== jitterStep; if (jChanged) jitterStep = j;

    pointer.x += (pointer.tx - pointer.x) * Math.min(1, dt * 5);
    pointer.y += (pointer.ty - pointer.y) * Math.min(1, dt * 5);

    actors.forEach(a => {
      const p = a.p, w = (Math.PI * 2) / p.per, ph = a.seed;
      if (!a.hold) stepSpring(a, dt);
      if (a.landing && !a.hold && a.y > 0 && a.vy > 0) { a.landing = false; impulse(a, 0, -6 * a.dir, 3.6); } // aterrizaje: squash

      // Opacidad en pasos (cel): 0 → .5 → .85 → 1
      if (a.hold) a.op = 0;
      else if (a.op < 1) { const e = performance.now() - a.appear; a.op = e < 84 ? .5 : e < 168 ? .85 : 1; }
      a.excite *= Math.pow(.12, dt);

      // Flotación: senos con periodos no múltiplos → nunca se repite igual
      const fx = Math.sin(clock * w + ph) * p.ax + Math.sin(clock * w * 2.31 + ph * 1.7) * p.ax * .35;
      const fy = Math.cos(clock * w * .83 + ph) * p.ay + Math.sin(clock * w * 1.9 + ph) * p.ay * .3;
      const fr = Math.sin(clock * w * .71 + ph * 2) * p.rot;
      const breath = Math.sin(clock * w * .5 + ph) * p.br;
      if (jChanged) a.jit = (hash(a.seed + j) - .5) * .26;
      const wob = Math.sin(clock * 19 + ph) * a.excite * 1.3;

      const px = pointer.x * 9 * p.depth, py = pointer.y * 6 * p.depth;
      const x = fx + px, y = fy + a.y + py - a.excite * 3;
      const r = fr + a.r + a.jit + wob;
      const sx = 1 + breath + a.s * .034 + a.excite * .016;
      const sy = 1 + breath - a.s * .03 + a.excite * .016;
      a.frame.style.transform = `translate3d(${x.toFixed(2)}px,${y.toFixed(2)}px,0) rotate(${r.toFixed(3)}deg) scale(${sx.toFixed(4)},${sy.toFixed(4)})`;
      a.frame.style.opacity = a.op;

      // El trazo va con retraso (follow-through) y solo hereda parte del rebote
      const tx = fx * .6 + px * 1.15, ty = fy * .6 + py * 1.15 + (a.hold ? 0 : a.y * .3), tr = fr * .5 + (a.hold ? 0 : a.r * .4);
      const f = Math.min(1, dt * 8);
      a.kx += (tx - a.kx) * f; a.ky += (ty - a.ky) * f; a.kr += (tr - a.kr) * f;
      a.svg.style.transform = `translate3d(${a.kx.toFixed(2)}px,${a.ky.toFixed(2)}px,0) rotate(${a.kr.toFixed(3)}deg)`;
    });

    if (entered && clock > nextBeat) { nextBeat = clock + 10 + hash(clock) * 3; signatureBeat(); }
    raf = requestAnimationFrame(frame);
  }

  function start() {
    if (running || paused()) return;
    running = true; last = 0; hero.classList.add('is-alive');
    if (!actors[0] || !actors[0].variants) buildAll();
    if (!entered) entrance();
    raf = requestAnimationFrame(frame);
  }
  function stop() {
    running = false;
    if (raf) cancelAnimationFrame(raf); raf = 0;
    if (reduceMQ.matches || root.classList.contains('motion-paused')) reset();
  }
  function reset() {
    clearTimers();
    hero.classList.remove('is-alive', 'alive-pending');
    actors.forEach(a => {
      a.frame.style.transform = a.frame.style.opacity = a.svg.style.transform = '';
      a.y = a.r = a.s = a.vy = a.vr = a.vs = 0; a.op = 1; a.hold = false; ink(a, 'off');
    });
    accents.forEach(el => { el.dataset.frame = 0; });
    if (noise) noise.setAttribute('seed', 3);
    entered = false;
  }
  const resume = () => (paused() ? stop() : start());

  /* ---------- Interacción ---------- */
  collage.addEventListener('pointermove', e => {
    if (!fineMQ.matches) return;
    const r = collage.getBoundingClientRect();
    pointer.tx = ((e.clientX - r.left) / r.width - .5) * 2;
    pointer.ty = ((e.clientY - r.top) / r.height - .5) * 2;
  });
  collage.addEventListener('pointerleave', () => { pointer.tx = pointer.ty = 0; });

  actors.forEach((a, i) => {
    const react = strength => {
      if (!running || a.hold) return;
      a.excite = Math.min(1, a.excite + strength);
      impulse(a, -60 * strength, 10 * a.dir * strength, -1.2 * strength);
      [-1, 1].forEach(d => {
        const nb = actors[i + d];
        if (nb) later(() => { nb.excite = Math.min(1, nb.excite + strength * .4); impulse(nb, -18 * strength, 5 * d, 0); }, 120);
      });
      if (!a.p.keep) ink(a, 'draw'); else burstTicks(a);
      const near = accents.find(el => el.dataset.for === a.key);
      if (near) burst(near);
    };
    const release = () => { if (!a.p.keep && a.fig.dataset.ink === 'draw') ink(a, 'erase'); };
    a.fig.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') react(.8); });
    a.fig.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse') later(release, 180); });
    a.fig.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') { react(1); later(release, 1100); } }, { passive: true });
  });

  /* ---------- Ciclo de vida ---------- */
  let rz = 0;
  new ResizeObserver(() => { cancelAnimationFrame(rz); rz = requestAnimationFrame(buildAll); }).observe(collage);
  new IntersectionObserver(([en]) => { visible = en.isIntersecting; resume(); }, { threshold: .05 }).observe(collage);
  document.addEventListener('visibilitychange', resume);
  document.addEventListener('casona:motion-change', resume);
  reduceMQ.addEventListener?.('change', resume);
  new MutationObserver(resume).observe(root, { attributes: true, attributeFilter: ['class'] });

  hero.addEventListener('casona:entry-finished', () => { entered = false; if (running) entrance(); else start(); });

  // Oculta las fotos solo si va a haber entrada; red de seguridad por si algo falla
  if (!paused()) hero.classList.add('alive-pending');
  setTimeout(() => { if (!entered) hero.classList.remove('alive-pending'); }, 2600);

  const imgs = actors.map(a => a.frame.querySelector('img')).filter(Boolean);
  Promise.all(imgs.map(img => (img.decode ? img.decode().catch(() => {}) : Promise.resolve())))
    .then(() => { if (hero.dataset.entryState !== 'playing') start(); else hero.classList.remove('alive-pending'); });
})();
