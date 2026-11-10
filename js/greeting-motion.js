/* ==========================================================================
   La Casona — Greeting Motion System                     js/greeting-motion.js
   Tipografía Nunito Black + tres iconos vectoriales con TRES POSES a 3 FPS.
   A = anticipación · B = pose heroica · C = follow-through (sin pose de reposo:
   la animación idle cicla las 3 poses todo el tiempo).
   Poses en pasos exactos de 333 ms, sin interpolación. Line boil: 3 variantes
   deterministas por pose. Respeta reduced-motion, pausa, pestaña oculta.
   ========================================================================== */
(() => {
  'use strict';

  const NS = 'http://www.w3.org/2000/svg';
  const FPS = 3;
  const HOLD = 1000 / FPS;
  const ACCENT_STEP = 1000 / 12;
  const DEG = Math.PI / 180;
  const KAPPA = 0.5523;
  const POSE_CODE = { A: 1, B: 2, C: 3 };
  let uid = 0;

  /* ---------- 1 · Utilidades deterministas ---------- */
  function hash(...parts) {
    let h = 2166136261 >>> 0;
    for (const p of parts) {
      h ^= Math.round(p * 1013) & 0xffffffff;
      h = Math.imul(h, 16777619);
    }
    h ^= h >>> 15; h = Math.imul(h, 2246822507);
    h ^= h >>> 13; h = Math.imul(h, 3266489909);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  }
  const jig = (amp, ...key) => (amp ? (hash(...key) - 0.5) * 2 * amp : 0);
  const r2 = n => Math.round(n * 100) / 100;
  const pt = p => `${r2(p[0])},${r2(p[1])}`;

  function el(tag, attrs, parent) {
    const node = document.createElementNS(NS, tag);
    if (attrs) for (const k in attrs) node.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(node);
    return node;
  }
  function set(node, attrs) { for (const k in attrs) node.setAttribute(k, attrs[k]); }

  /* ---------- 2 · Geometría ---------- */
  function polarE(cx, cy, ang, rad, rx, ry, k = 0.6) {
    const m = (rx + ry) / 2;
    const fx = 1 + (rx / m - 1) * k;
    const fy = 1 + (ry / m - 1) * k;
    return [cx + Math.cos(ang * DEG) * rad * fx, cy + Math.sin(ang * DEG) * rad * fy];
  }
  function ray(cx, cy, ang, r1, r2_, rx, ry, bend) {
    const p1 = polarE(cx, cy, ang, r1, rx, ry);
    const p2 = polarE(cx, cy, ang + bend * 0.6, r2_, rx, ry);
    const mid = polarE(cx, cy, ang + bend, (r1 + r2_) / 2, rx, ry);
    return `M${pt(p1)}Q${pt(mid)} ${pt(p2)}`;
  }
  function blob(cx, cy, rx, ry, wob, key) {
    const s = [0, 1, 2, 3].map(i => 1 + jig(wob, ...key, i));
    const E = [cx + rx * s[0], cy];
    const S = [cx, cy + ry * s[1]];
    const W = [cx - rx * s[2], cy];
    const N = [cx, cy - ry * s[3]];
    const ex = E[0] - cx, sy = S[1] - cy, wx = W[0] - cx, ny = N[1] - cy;
    return `M${pt(E)}` +
      `C${pt([E[0], cy + KAPPA * sy])} ${pt([cx + KAPPA * ex, S[1]])} ${pt(S)}` +
      `C${pt([cx + KAPPA * wx, S[1]])} ${pt([W[0], cy + KAPPA * sy])} ${pt(W)}` +
      `C${pt([W[0], cy + KAPPA * ny])} ${pt([cx + KAPPA * wx, N[1]])} ${pt(N)}` +
      `C${pt([cx + KAPPA * ex, N[1]])} ${pt([E[0], cy + KAPPA * ny])} ${pt(E)}Z`;
  }
  function arc(cx, cy, rx, ry, a1, a2) {
    const p1 = [cx + Math.cos(a1 * DEG) * rx, cy + Math.sin(a1 * DEG) * ry];
    const p2 = [cx + Math.cos(a2 * DEG) * rx, cy + Math.sin(a2 * DEG) * ry];
    return `M${pt(p1)}A${r2(rx)} ${r2(ry)} 0 0 1 ${pt(p2)}`;
  }
  function sparkle(x, y, lx, ly) {
    const q = 0.18;
    return `M${pt([x, y - ly])}` +
      `Q${pt([x + lx * q, y - ly * q])} ${pt([x + lx, y])}` +
      `Q${pt([x + lx * q, y + ly * q])} ${pt([x, y + ly])}` +
      `Q${pt([x - lx * q, y + ly * q])} ${pt([x - lx, y])}` +
      `Q${pt([x - lx * q, y - ly * q])} ${pt([x, y - ly])}Z`;
  }

  /* ---------- 3 · POSES (viewBox 64 × 64) ---------- */
  const SUN_ANGLES = [-90, -45, 0, 45, 90, 135, 180, 225];
  const SUN = {
    A: {
      cx: 32, cy: 34.6, rx: 13.0, ry: 10.9, rot: -11, wMaj: 3.9, wMin: 3.5,
      rays: [[15.4, 20.4], [15.0, 18.6], [15.6, 19.6], [15.0, 18.2],
             [15.4, 19.4], [15.0, 18.0], [15.6, 19.8], [15.2, 18.8]],
      glint: [200, 244, 0.6], spark: null
    },
    B: {
      cx: 32, cy: 30.6, rx: 12.2, ry: 13.6, rot: 0, wMaj: 3.4, wMin: 3.0,
      rays: [[17.4, 27.6], [17.0, 24.6], [17.6, 27.8], [17.0, 24.0],
             [17.2, 26.4], [17.0, 23.8], [17.6, 28.2], [17.0, 25.0]],
      glint: [196, 256, 0.64], spark: null
    },
    C: {
      cx: 32, cy: 32.6, rx: 13.3, ry: 12.3, rot: 8, wMaj: 3.6, wMin: 3.2,
      rays: [[16.8, 26.6], [16.6, 22.4], [16.4, 23.2], [16.4, 21.2],
             [16.6, 24.4], [16.8, 23.6], [17.0, 26.8], [16.9, 24.8]],
      glint: [208, 250, 0.6], spark: [53, 9.5, 3.2, 4.6]
    }
  };
  const SUNSET = {
    A: {
      cx: 32, cy: 41.2, rx: 13.6, ry: 11.4, h: [42, 42.2, 42.2],
      ang: [-150, -118, -90, -62, -30], ray: [15.6, 18.6], w: 3.2,
      refl: [[32, 48.6, 6.2], [32, 53.6, 3.0]]
    },
    B: {
      cx: 32, cy: 33.2, rx: 12.3, ry: 13.8, h: [42.6, 40.4, 40.2],
      ang: [-160, -125, -90, -55, -20], ray: [17.0, 25.0], w: 3.0,
      refl: [[32, 48.4, 8.6], [32, 53.4, 4.6]]
    },
    C: {
      cx: 32, cy: 37.8, rx: 14.1, ry: 12.3, h: [41.4, 44.2, 43.8],
      ang: [-155, -121, -88, -56, -25], ray: [16.4, 22.0], w: 3.1,
      refl: [[33.2, 48.8, 7.6], [31, 54, 4.2]]
    }
  };
  const MOON = {
    A: { cx: 30, cy: 34, r: 13.2, cut: [8.6, -5.4, 11.0], rot: -16, s: 0.94, dot: [49.5, 14, 1.4], star: null },
    B: { cx: 30, cy: 33.4, r: 14.2, cut: [6.6, -4.4, 12.6], rot: 9, s: 1.02, dot: null, star: [50, 13, 2.6, 3.8] },
    C: { cx: 30, cy: 33.8, r: 13.8, cut: [7.3, -4.8, 12.0], rot: -3, s: 1, dot: null, star: [51, 12, 3.0, 6.8] }
  };

  /* ---------- 4 · Constructores de icono ---------- */
  function buildSun(svg) {
    const g = el('g', { class: 'gm-kind gm-sun' }, svg);
    const minor = el('path', { class: 'gm-ray gm-ray-minor' }, g);
    const major = el('path', { class: 'gm-ray gm-ray-major' }, g);
    const body = el('path', { class: 'gm-body' }, g);
    const glint = el('path', { class: 'gm-glint' }, g);
    const spark = el('path', { class: 'gm-spark' }, g);
    function draw(pose, v, amp) {
      const P = SUN[pose] || SUN.B, c = POSE_CODE[pose] || 2;
      let dMaj = '', dMin = '';
      SUN_ANGLES.forEach((base, i) => {
        const [inR, outR] = P.rays[i];
        const a = base + P.rot + jig(1.6 * amp, 11, c, v, i, 1);
        const o = outR + jig(0.7 * amp, 11, c, v, i, 2);
        const bend = jig(1.4 * amp, 11, c, v, i, 3);
        const d = ray(P.cx, P.cy, a, inR, o, P.rx, P.ry, bend);
        if (i % 2) dMin += d; else dMaj += d;
      });
      set(major, { d: dMaj, 'stroke-width': P.wMaj });
      set(minor, { d: dMin, 'stroke-width': P.wMin });
      body.setAttribute('d', blob(P.cx, P.cy, P.rx, P.ry, 0.012 * amp, [11, c, v, 9]));
      const [g1, g2, f] = P.glint;
      glint.setAttribute('d', arc(P.cx, P.cy, P.rx * f, P.ry * f,
        g1 + jig(4 * amp, 11, c, v, 20), g2 + jig(4 * amp, 11, c, v, 21)));
      if (P.spark) {
        const [x, y, lx, ly] = P.spark;
        spark.setAttribute('d', sparkle(x + jig(0.4 * amp, 11, c, v, 30), y + jig(0.4 * amp, 11, c, v, 31),
          lx + jig(0.3 * amp, 11, c, v, 32), ly + jig(0.4 * amp, 11, c, v, 33)));
      } else spark.setAttribute('d', '');
    }
    return { g, draw };
  }

  function buildSunset(svg, defs, id) {
    const clipId = `${id}-sky`;
    const clip = el('clipPath', { id: clipId }, defs);
    const clipShape = el('path', {}, clip);
    const g = el('g', { class: 'gm-kind gm-sunset' }, svg);
    const sky = el('g', { 'clip-path': `url(#${clipId})` }, g);
    const rays = el('path', { class: 'gm-ray' }, sky);
    const body = el('path', { class: 'gm-body' }, sky);
    const horizon = el('path', { class: 'gm-horizon' }, g);
    const refl = el('path', { class: 'gm-reflection' }, g);
    function draw(pose, v, amp) {
      const P = SUNSET[pose] || SUNSET.B, c = POSE_CODE[pose] || 2;
      const yl = P.h[0] + jig(0.3 * amp, 22, c, v, 1);
      const yr = P.h[0] + jig(0.3 * amp, 22, c, v, 2);
      const c1 = P.h[1] + jig(0.45 * amp, 22, c, v, 3);
      const c2 = P.h[2] + jig(0.45 * amp, 22, c, v, 4);
      const hz = `M${pt([4, yl])}C${pt([19, c1])} ${pt([45, c2])} ${pt([60, yr])}`;
      horizon.setAttribute('d', hz);
      clipShape.setAttribute('d', `${hz}L60,-14L4,-14Z`);
      let dr = '';
      P.ang.forEach((base, i) => {
        const a = base + jig(1.8 * amp, 22, c, v, i, 10);
        const o = P.ray[1] + jig(0.7 * amp, 22, c, v, i, 11);
        dr += ray(P.cx, P.cy, a, P.ray[0], o, P.rx, P.ry, jig(1.4 * amp, 22, c, v, i, 12));
      });
      set(rays, { d: dr, 'stroke-width': P.w });
      body.setAttribute('d', blob(P.cx, P.cy, P.rx, P.ry, 0.012 * amp, [22, c, v, 9]));
      let dl = '';
      P.refl.forEach(([x, y, half], i) => {
        const dx = jig(0.6 * amp, 22, c, v, i, 20);
        const dy = jig(0.25 * amp, 22, c, v, i, 21);
        dl += `M${pt([x - half + dx, y + dy])}L${pt([x + half + dx, y - dy * 0.5])}`;
      });
      refl.setAttribute('d', dl);
    }
    return { g, draw };
  }

  function buildMoon(svg, defs, id) {
    const maskId = `${id}-bite`;
    const mask = el('mask', { id: maskId, maskUnits: 'userSpaceOnUse', x: -16, y: -16, width: 96, height: 96 }, defs);
    el('rect', { x: -16, y: -16, width: 96, height: 96, fill: '#fff' }, mask);
    const cut = el('path', { fill: '#000' }, mask);
    const g = el('g', { class: 'gm-kind gm-moon' }, svg);
    const turn = el('g', { class: 'gm-moon-turn' }, g);
    const body = el('path', { class: 'gm-body', mask: `url(#${maskId})` }, turn);
    const seed = el('circle', { class: 'gm-spark', r: 0 }, g);
    const star = el('path', { class: 'gm-spark' }, g);
    function draw(pose, v, amp) {
      const P = MOON[pose] || MOON.B, c = POSE_CODE[pose] || 2;
      const rot = P.rot + jig(1.2 * amp, 33, c, v, 1);
      turn.setAttribute('transform',
        `translate(${P.cx} ${P.cy}) rotate(${r2(rot)}) scale(${P.s}) translate(${-P.cx} ${-P.cy})`);
      body.setAttribute('d', blob(P.cx, P.cy, P.r, P.r, 0.01 * amp, [33, c, v, 2]));
      const [dx, dy, cr] = P.cut;
      cut.setAttribute('d', blob(P.cx + dx + jig(0.25 * amp, 33, c, v, 3), P.cy + dy + jig(0.25 * amp, 33, c, v, 4),
        cr, cr, 0.014 * amp, [33, c, v, 5]));
      if (P.dot) set(seed, { cx: P.dot[0], cy: P.dot[1], r: P.dot[2] });
      else seed.setAttribute('r', 0);
      if (P.star) {
        const [x, y, lx, ly] = P.star;
        star.setAttribute('d', sparkle(x + jig(0.35 * amp, 33, c, v, 6), y + jig(0.35 * amp, 33, c, v, 7),
          lx + jig(0.3 * amp, 33, c, v, 8), ly + jig(0.45 * amp, 33, c, v, 9)));
      } else star.setAttribute('d', '');
    }
    return { g, draw };
  }

  const KINDS = { sun: buildSun, sunset: buildSunset, moon: buildMoon };

  function createIcon(kind) {
    const id = `gm${++uid}`;
    const svg = el('svg', { viewBox: '0 0 64 64', class: `gm-icon gm-icon-${kind}`, 'aria-hidden': 'true', focusable: 'false' });
    const defs = el('defs', null, svg);
    const api = (KINDS[kind] || KINDS.sun)(svg, defs, id);
    api.svg = svg;
    api.kind = kind;
    api.draw('B', 0, 0);
    return api;
  }

  /* ---------- 5 · Copy y coreografías ---------- */
  const PERIODS = {
    morning:   { kind: 'sun',    words: ['Buenos', 'días'] },
    afternoon: { kind: 'sunset', words: ['Buenas', 'tardes'] },
    night:     { kind: 'moon',   words: ['Buenas', 'noches'] },
    neutral:   { kind: 'sun',    words: ['Hola,', 'bienvenido'] }
  };
  const SEQ = {
    sun: {
      intro: ['A', 'A', 'A', { pose: 'B', cue: 'dot' }, 'B', 'C', 'A', 'B', 'B', 'B', 'C'],
      idle: ['A', 'B', 'B', 'C']
    },
    sunset: {
      intro: ['A', 'A', 'A', { pose: 'B', cue: 'dot' }, 'B', 'B', 'C', 'C', 'A', 'B', 'C', 'C'],
      idle: ['A', 'B', 'C', 'C']
    },
    moon: {
      intro: ['A', 'A', 'A', { pose: 'B', cue: 'dot' }, 'B', 'B', 'C', 'C', 'C'],
      idle: ['A', 'B', 'B', 'C', 'C']
    }
  };
  const SWAP = ['A', { pose: 'B', cue: 'dot' }, 'C'];
  const normalize = frames => frames.map(f => (typeof f === 'string' ? { pose: f } : f));
  function sequence(periodOrKind, name = 'intro') {
    const kind = PERIODS[periodOrKind] ? PERIODS[periodOrKind].kind : periodOrKind;
    if (name === 'swap') return normalize(SWAP);
    return normalize((SEQ[kind] || SEQ.sun)[name] || SEQ.sun.intro);
  }

  /* ---------- 6 · Componente ---------- */
  function mount(cfg) {
    const opt = Object.assign({ period: 'neutral', autoplay: true, ambient: true, observe: true, onFrame: null }, cfg);
    const { root, iconHost, wordHost } = opt;
    if (!root || !iconHost || !wordHost) return null;

    const html = document.documentElement;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)');
    let hold = HOLD;
    let current = null;
    let icon = null;
    const icons = {};
    let seq = null, seqIdx = -1, seqStart = 0, seqTimer = 0, seqDone = null, seqName = '';
    let boilStep = 0;
    let visible = true, ready = false, introPlayed = false, suspended = false;
    const anims = new Set();
    const timers = new Set();

    root.classList.add('greeting-motion', 'gm-palette');
    iconHost.textContent = '';
    iconHost.classList.add('gm-icon-host');
    const stage = document.createElement('span');
    stage.className = 'gm-icon-stage';
    iconHost.appendChild(stage);

    wordHost.textContent = '';
    wordHost.classList.add('gm-words');
    const variants = {};
    Object.keys(PERIODS).forEach(key => {
      const P = PERIODS[key];
      const node = document.createElement('span');
      node.className = 'gm-variant';
      node.dataset.period = key;
      node.setAttribute('aria-hidden', 'true');
      let dot = null;
      const words = P.words.map((text, i) => {
        if (i) node.appendChild(document.createTextNode(' '));
        const mask = document.createElement('span');
        mask.className = 'gm-mask';
        const word = document.createElement('span');
        word.className = 'gm-word';
        word.textContent = text;
        if (i === P.words.length - 1) {
          dot = document.createElement('span');
          dot.className = 'gm-dot';
          dot.textContent = '.';
          word.appendChild(dot);
        }
        mask.appendChild(word);
        node.appendChild(mask);
        return word;
      });
      wordHost.appendChild(node);
      variants[key] = { node, words, dot };
    });

    const later = (fn, ms) => { const t = setTimeout(() => { timers.delete(t); fn(); }, ms); timers.add(t); return t; };
    const track = a => { if (a) { anims.add(a); a.finished.then(() => anims.delete(a), () => anims.delete(a)); } return a; };
    const cancelAnims = () => { anims.forEach(a => a.cancel()); anims.clear(); };
    const clearTimers = () => { timers.forEach(clearTimeout); timers.clear(); };
    const canAnimate = n => n && typeof n.animate === 'function';
    const blocked = () => reduce.matches || html.classList.contains('motion-paused') ||
      (opt.observe && (document.hidden || !visible));

    function applyPeriod(key) {
      current = PERIODS[key] ? key : 'neutral';
      const kind = PERIODS[current].kind;
      if (!icons[kind]) icons[kind] = createIcon(kind);
      if (icon && icon !== icons[kind]) icon.svg.remove();
      icon = icons[kind];
      if (!icon.svg.parentNode) stage.appendChild(icon.svg);
      root.dataset.gmPeriod = current;
      root.dataset.gmKind = kind;
      Object.keys(variants).forEach(k => {
        const on = k === current;
        variants[k].node.classList.toggle('is-active', on);
        if (on) variants[k].node.removeAttribute('aria-hidden');
        else variants[k].node.setAttribute('aria-hidden', 'true');
      });
    }
    function render(pose, v = 0, amp = 1) { icon.draw(pose, v, amp); root.dataset.gmPose = pose; }

    /* Programador de poses a 3 fps, por reloj */
    function stopSeq() { clearTimeout(seqTimer); seqTimer = 0; seq = null; seqIdx = -1; seqDone = null; }
    function playSeq(name, frames, done) {
      stopSeq();
      seq = normalize(frames);
      seqName = name;
      seqDone = done || null;
      seqStart = performance.now();
      tick();
    }
    function tick() {
      if (!seq) return;
      const now = performance.now();
      const idx = Math.floor((now - seqStart) / hold);
      if (idx >= seq.length) { const d = seqDone; stopSeq(); if (d) d(); return; }
      if (idx !== seqIdx) {
        for (let i = seqIdx + 1; i <= idx; i++) if (seq[i].cue) cue(seq[i].cue);
        seqIdx = idx;
        const f = seq[idx];
        const variant = (boilStep++) % 3;
        render(f.pose, variant, 1);
        if (opt.onFrame) opt.onFrame({ name: seqName, index: idx, total: seq.length, pose: f.pose, variant, ms: idx * hold });
      }
      seqTimer = setTimeout(tick, Math.max(4, seqStart + (idx + 1) * hold - now));
    }

    /* Animación idle continua (sin pose de reposo) */
    function startIdleLoop() {
      if (!opt.ambient || blocked()) return;
      playIdle();
    }
    function playIdle() {
      if (blocked()) return;
      playSeq('idle', SEQ[icon.kind].idle, opt.ambient ? startIdleLoop : null);
    }

    /* El punto final salta en doses */
    function popDot() {
      const dot = variants[current].dot;
      if (!dot) return;
      ['1', '2', '3', '4', 'rest'].forEach((f, i) => later(() => { dot.dataset.pop = f; }, i * ACCENT_STEP));
    }
    function cue(name) { if (name === 'dot') popDot(); }

    /* Entradas suaves */
    function animateIconIn() {
      if (!canAnimate(stage)) return;
      track(stage.animate([
        { transform: 'translate3d(0,14%,0) scale(.42) rotate(-16deg)', opacity: 0 },
        { opacity: 1, offset: 0.18 },
        { transform: 'translate3d(0,-4%,0) scale(1.08) rotate(4deg)', offset: 0.66 },
        { transform: 'none', opacity: 1 }
      ], { duration: 430, easing: 'cubic-bezier(.3,.6,.3,1)', fill: 'backwards' }));
    }
    function animateWordsIn(v, delay = 110) {
      v.node.classList.add('is-animating');
      v.words.forEach((w, i) => {
        if (!canAnimate(w)) return;
        track(w.animate([
          { transform: 'translate3d(0,108%,0) rotate(5deg)' },
          { transform: 'translate3d(0,-6%,0) rotate(-.8deg)', offset: 0.64 },
          { transform: 'translate3d(0,1.5%,0) rotate(.2deg)', offset: 0.84 },
          { transform: 'none' }
        ], { duration: 640, delay: delay + i * 95, easing: 'cubic-bezier(.2,.75,.25,1)', fill: 'backwards' }));
      });
      later(() => v.node.classList.remove('is-animating'), delay + v.words.length * 95 + 700);
    }

    function settle() {
      stopSeq(); cancelAnims(); clearTimers();
      Object.values(variants).forEach(v => {
        v.node.classList.remove('is-animating', 'is-leaving');
        if (v.dot) v.dot.dataset.pop = 'rest';
      });
      render('B', 0, 0);
    }
    function playIntro() {
      if (blocked()) { settle(); return; }
      introPlayed = true;
      stopSeq(); cancelAnims(); clearTimers();
      const v = variants[current];
      if (v.dot) v.dot.dataset.pop = 'hidden';
      animateIconIn();
      animateWordsIn(v);
      playSeq('intro', SEQ[icon.kind].intro, startIdleLoop);
    }
    function setPeriod(key, { animate = true } = {}) {
      key = PERIODS[key] ? key : 'neutral';
      if (key === current) return;
      if (!animate || blocked() || !introPlayed) {
        applyPeriod(key);
        if (introPlayed && !blocked()) startIdleLoop(); else render('B', 0, 0);
        return;
      }
      stopSeq(); cancelAnims(); clearTimers();
      const old = variants[current];
      old.node.classList.add('is-animating', 'is-leaving');
      render('A', 0, 1);
      old.words.forEach((w, i) => canAnimate(w) && track(w.animate([
        { transform: 'none' }, { transform: 'translate3d(0,-112%,0) rotate(-4deg)' }
      ], { duration: 260, delay: i * 50, easing: 'cubic-bezier(.5,0,.75,0)', fill: 'forwards' })));
      if (canAnimate(stage)) track(stage.animate([
        { transform: 'none', opacity: 1 }, { transform: 'scale(.4) rotate(12deg)', opacity: 0 }
      ], { duration: 240, easing: 'cubic-bezier(.5,0,.75,0)', fill: 'forwards' }));
      later(() => {
        cancelAnims();
        old.node.classList.remove('is-animating', 'is-leaving');
        applyPeriod(key);
        const v = variants[current];
        if (v.dot) v.dot.dataset.pop = 'hidden';
        animateIconIn();
        animateWordsIn(v, 40);
        playSeq('swap', SWAP, startIdleLoop);
      }, 320);
    }
    function sync() {
      if (!ready) return;
      if (blocked()) { if (!suspended) { suspended = true; settle(); } return; }
      if (suspended || !seq) {
        suspended = false;
        if (!introPlayed && opt.autoplay) playIntro();
        else if (opt.ambient) startIdleLoop();
      }
    }

    if (opt.observe) {
      if ('IntersectionObserver' in window) {
        new IntersectionObserver(([en]) => { visible = en.isIntersecting; sync(); }, { threshold: 0.01 }).observe(root);
      }
      document.addEventListener('visibilitychange', sync);
    }
    document.addEventListener('casona:motion-change', sync);
    reduce.addEventListener?.('change', sync);
    new MutationObserver(sync).observe(html, { attributes: true, attributeFilter: ['class'] });

    applyPeriod(opt.period);
    render('B', 0, 0);

    return {
      root,
      get period() { return current; },
      get kind() { return icon.kind; },
      get hold() { return hold; },
      start() { ready = true; sync(); },
      playIntro, playIdle, setPeriod, settle, cue, popDot,
      sequence: name => sequence(icon.kind, name),
      showPose(pose, v = 0, amp = 1) { stopSeq(); render(pose, v, amp); },
      setHold(ms) { hold = Math.max(40, Number(ms) || HOLD); },
      destroy() { settle(); ready = false; }
    };
  }

  /* ---------- 7 · API pública ---------- */
  const api = { FPS, HOLD, ACCENT_STEP, PERIODS, SEQ, SWAP, POSES: { sun: SUN, sunset: SUNSET, moon: MOON }, createIcon, mount, sequence };
  window.CasonaGreeting = api;

  /* ---------- 8 · Arranque en la portada ---------- */
  function boot() {
    const hero = document.querySelector('.arcade-hero');
    const root = document.getElementById('greeting');
    const iconHost = document.getElementById('day-symbol');
    const wordHost = document.getElementById('local-greeting');
    if (!hero || !root || !iconHost || !wordHost) return;

    hero.dataset.greetingMotion = '1';
    const query = new URLSearchParams(location.search).get('saludo');
    const override = { manana: 'morning', 'mañana': 'morning', dia: 'morning', tarde: 'afternoon', noche: 'night' }[query];

    const ctl = mount({ root, iconHost, wordHost, period: override || hero.dataset.dayPeriod || 'neutral' });
    if (!ctl) return;
    api.instance = ctl;

    if (!override) {
      new MutationObserver(() => ctl.setPeriod(hero.dataset.dayPeriod))
        .observe(hero, { attributes: true, attributeFilter: ['data-day-period'] });
    }

    const still = matchMedia('(prefers-reduced-motion: reduce)').matches ||
      document.documentElement.classList.contains('motion-paused');
    if (!still) root.classList.add('gm-pending');
    setTimeout(() => root.classList.remove('gm-pending'), 10000);

    const fontReady = document.fonts && document.fonts.load
      ? Promise.race([document.fonts.load('900 1em Nunito'), new Promise(r => setTimeout(r, 1200))])
      : Promise.resolve();
    const entryClear = new Promise(res => {
      if (hero.dataset.entryState !== 'playing') { res(); return; }
      hero.addEventListener('casona:entry-finished', res, { once: true });
      setTimeout(res, 9000);
    });

    Promise.all([fontReady.catch(() => {}), entryClear]).then(() => {
      root.classList.remove('gm-pending');
      ctl.start();
      hero.addEventListener('casona:entry-finished', () => ctl.playIntro());
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
