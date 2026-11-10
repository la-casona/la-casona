/* Approved SOMA navigation. Native dialog owns modality; GSAP only enhances motion.
   All links remain ordinary same-page anchors. No replacement cursor or scroll hijack. */
(() => {
  'use strict';
  const menu = document.getElementById('site-menu');
  const trigger = document.getElementById('nav-toggle');
  const close = document.getElementById('close-menu');
  if (!menu || !trigger || !close) return;
  const scene = menu.querySelector('.editorial-nav');
  const entries = [...menu.querySelectorAll('.nav-entry')];
  const labels = entries.map(entry => entry.querySelector('.nav-label'));
  const photos = [...menu.querySelectorAll('.nav-photo')];
  const star = menu.querySelector('.nav-star');
  const ornaments = [...menu.querySelectorAll('.nav-botanical,.nav-star')];
  const moving = [scene, ...entries, ...labels, ...photos, ...ornaments];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  const gs = window.gsap;
  let timeline = null;
  let closeMotion = null;
  const closeIcon = close.querySelector('svg');
  const closeStrokes = [...close.querySelectorAll('.nav-close-stroke')];
  const closeParts = [closeIcon, ...closeStrokes].filter(Boolean);
  let idle = null;
  let idleGeneration = 0;
  let framesReady = null;
  const starImage = star?.querySelector('img');
  const starOriginalStyle = starImage?.getAttribute('style');
  const starFrames = [
    {src:starImage?.getAttribute('src')},
    {src:'images/nav-star-frame-2.png', width:878, x:183, y:201, inkWidth:529},
    {src:'images/nav-star-frame-3.png', width:878, x:166, y:201, inkWidth:529}
  ];
  const FRAME_MS = 1000 / 3;
  let state = 'closed';
  let previousFocus = null;
  let focusOnClose = true;
  const paused = () => reduced.matches || document.documentElement.classList.contains('motion-paused');
  const setState = value => { state = value; menu.dataset.navState = value; };
  const sections = entries.map(link => document.getElementById(link.hash.slice(1)));
  let activeIndex = 0;
  let sectionFrame = 0;
  let pendingSection = null;
  let pendingUntil = 0;

  function setActiveSection(index, layout = true) {
    if (index < 0 || index >= entries.length) return;
    const changed = activeIndex !== index || !menu.hasAttribute('data-current-section');
    activeIndex = index;
    menu.dataset.currentSection = sections[index]?.id || entries[index].hash.slice(1);
    entries.forEach((link, i) => {
      if (i === index) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    if (changed && layout && menu.open) layoutActiveSection();
  }
  function sectionAtScroll() {
    const line = Math.min(innerHeight * .32, 280);
    const bottom = scrollY > 0 && scrollY + innerHeight >= document.documentElement.scrollHeight - 4;
    if (bottom) { pendingSection = null; return entries.length - 1; }
    if (pendingSection !== null && performance.now() < pendingUntil) {
      const top = sections[pendingSection]?.getBoundingClientRect().top;
      if (top <= line && top >= -48) pendingSection = null;
      else return pendingSection;
    } else pendingSection = null;
    let found = 0;
    sections.forEach((section, index) => {
      if (section && section.getBoundingClientRect().top <= line) found = index;
    });
    return found;
  }
  function layoutActiveSection() {
    if (!menu.open || !star) return;
    labels.forEach(label => {
      label.style.removeProperty('--nav-label-size');
      label.style.removeProperty('left');
    });
    ['left','top','width'].forEach(property => star.style.removeProperty(property));
    const label = labels[activeIndex];
    const entry = entries[activeIndex];
    const width = scene.clientWidth;
    const mobile = width <= 900;
    if (activeIndex !== 0) {
      // Measure the approved La casa layout synchronously, then restore state
      // before paint. All active titles share its actual left/right margins.
      const section = menu.dataset.currentSection;
      menu.dataset.currentSection = 'la-casa';
      const referenceLeft = entries[0].offsetLeft + labels[0].offsetLeft;
      const referenceWidth = labels[0].getBoundingClientRect().width;
      menu.dataset.currentSection = section;
      label.style.left = (referenceLeft - entry.offsetLeft) + 'px';
      let size = width * (mobile ? .17 : .135);
      label.style.setProperty('--nav-label-size', size + 'px');
      for (let attempt = 0; attempt < 2; attempt++) {
        const measured = label.getBoundingClientRect().width;
        if (measured > 0) size *= referenceWidth / measured;
        label.style.setProperty('--nav-label-size', size.toFixed(3) + 'px');
      }
      const secondary = Math.min(width * (mobile ? .086 : .06), size / 1.24);
      labels.forEach((other, i) => {
        if (i !== activeIndex) other.style.setProperty('--nav-label-size', secondary.toFixed(3) + 'px');
      });
    }
    // Never shrink the star or move it sideways for another section: its size
    // and x position always come from the approved responsive CSS for La casa.
    // Offset metrics ignore the entrance/hover transforms. The sprite keeps its
    // own 3 fps clock; only its container's resting position follows the section.
    const center = entry.offsetTop + label.offsetTop + label.offsetHeight / 2;
    star.style.top = Math.max(0, Math.min(scene.clientHeight - star.offsetHeight, center - star.offsetHeight / 2)) + 'px';
  }
  function scheduleSectionUpdate() {
    if (sectionFrame) return;
    sectionFrame = requestAnimationFrame(() => {
      sectionFrame = 0;
      if (menu.open) layoutActiveSection();
      else setActiveSection(sectionAtScroll(), false);
    });
  }
  function selectDestination(index) {
    pendingSection = index;
    pendingUntil = performance.now() + 1800;
    setActiveSection(index, false);
  }
  function syncHashSection() {
    let target;
    try { target = document.getElementById(decodeURIComponent(location.hash.slice(1))); } catch (_) { return; }
    if (!target) return;
    let index = sections.findIndex(section => section === target || section?.contains(target));
    if (index < 0 && target.closest('.legacy-section')) index = 1;
    if (target.id === 'inicio') index = 0;
    if (index >= 0) { selectDestination(index); if (menu.open) layoutActiveSection(); }
  }
  window.addEventListener('scroll', () => { if (!menu.open) scheduleSectionUpdate(); }, {passive:true});
  window.addEventListener('resize', scheduleSectionUpdate, {passive:true});
  window.addEventListener('hashchange', syncHashSection);
  window.addEventListener('pageshow', scheduleSectionUpdate);
  window.addEventListener('load', scheduleSectionUpdate, {once:true});
  ['wheel','touchstart'].forEach(type => window.addEventListener(type, () => { pendingSection = null; }, {passive:true}));
  window.addEventListener('keydown', event => {
    if (['ArrowUp','ArrowDown','PageUp','PageDown','Home','End',' '].includes(event.key) && !menu.open) pendingSection = null;
  });
  if ('ResizeObserver' in window) {
    const sectionObserver = new ResizeObserver(() => { if (!menu.open) scheduleSectionUpdate(); });
    const main = document.querySelector('main');
    if (main) sectionObserver.observe(main);
  }
  document.fonts?.ready.then(scheduleSectionUpdate);
  document.fonts?.addEventListener('loadingdone', scheduleSectionUpdate);

  function clearMotion() {
    timeline?.kill(); timeline = null;
    resetCloseMotion();
    stopIdle();
    if (gs) {
      gs.killTweensOf(moving);
      gs.set(moving, {clearProps:'transform,opacity,visibility'});
    }
  }
  function resetCloseMotion() {
    closeMotion?.kill(); closeMotion = null;
    if (!gs) return;
    gs.killTweensOf(closeParts);
    gs.set(closeParts, {clearProps:'transform,opacity,visibility'});
  }
  function canAnimateClose() {
    return gs && closeIcon && closeStrokes.length === 2 && !paused() && !document.hidden && state === 'open';
  }
  function prepareCloseOrigins() {
    gs.set(closeIcon, {transformOrigin:'50% 50%'});
    gs.set(closeStrokes, {svgOrigin:'12 12'});
  }
  function animateCloseIntent() {
    if (!canAnimateClose() || closeMotion?.isActive()) return;
    resetCloseMotion();
    prepareCloseOrigins();
    // Each line exits along its own diagonal. The reset happens fully outside
    // the clipped SVG, then it slides in from the opposite end. No fading.
    closeMotion = gs.timeline({onComplete:() => { closeMotion = null; }});
    closeStrokes.forEach((path, index) => {
      const endY = index === 0 ? 28 : -28;
      const delay = index === 0 ? .045 : 0;
      closeMotion
        .to(path, {x:28, y:endY, duration:.18, ease:'power2.in'}, delay)
        .set(path, {x:-28, y:-endY}, delay + .18)
        .to(path, {x:0, y:0, duration:.29, ease:'power3.out'}, delay + .18);
    });
  }
  function settleClose() {
    if (!canAnimateClose()) return;
    closeMotion?.kill();
    gs.killTweensOf(closeParts);
    closeMotion = gs.to(closeStrokes, {x:0, y:0, opacity:1, duration:.18, ease:'power2.out'});
  }
  close.addEventListener('pointerenter', () => { if (fine.matches) animateCloseIntent(); });
  close.addEventListener('focus', () => { if (close.matches(':focus-visible')) animateCloseIntent(); });
  close.addEventListener('pointerdown', event => {
    if (event.pointerType !== 'mouse') animateCloseIntent();
  });
  // Leaving hover does not rewind halfway through: finish the one-shot gesture.
  close.addEventListener('pointercancel', settleClose);
  function showStarFrame(index) {
    if (!starImage) return;
    const frame = starFrames[index];
    if (index === 0) {
      if (starOriginalStyle === null) starImage.removeAttribute('style');
      else starImage.setAttribute('style', starOriginalStyle);
    } else {
      // Register the visible alpha, not the different transparent export canvases.
      // Uniform scale only: no warping, rotation, fading or synthesized frames.
      starImage.style.width = (frame.width / frame.inkWidth * 100) + '%';
      starImage.style.left = (-frame.x / frame.inkWidth * 100) + '%';
      starImage.style.top = (-frame.y / frame.inkWidth * 698 / 844 * 100) + '%';
    }
    if (starImage.getAttribute('src') !== frame.src) starImage.setAttribute('src', frame.src);
    star.dataset.starFrame = String(index);
  }
  function stopIdle() {
    clearTimeout(idle); idle = null;
    idleGeneration++;
    showStarFrame(0);
  }
  function preloadStarFrames() {
    if (!framesReady) {
      framesReady = Promise.all(starFrames.map(frame => {
        const image = new Image();
        image.src = frame.src;
        frame.image = image; // Retain the decoded images for the whole loop.
        return image.decode();
      })).then(() => true).catch(error => {
        console.warn('[La Casona] Estrella estática: no se pudieron cargar sus fotogramas.', error);
        return false;
      });
    }
    return framesReady;
  }
  async function startIdle() {
    stopIdle();
    const canPlay = () => starImage && menu.open && state === 'open' && !paused() && !document.hidden;
    if (!canPlay()) return;
    const generation = idleGeneration;
    if (!await preloadStarFrames() || generation !== idleGeneration || !canPlay()) return;
    let frame = 0;
    // 0 → 1 → 2 → 0. One hard cut every 333.33 ms, on touch as well as desktop.
    const tick = () => {
      if (generation !== idleGeneration) return;
      if (!canPlay()) { stopIdle(); return; }
      frame = (frame + 1) % starFrames.length;
      showStarFrame(frame);
      idle = setTimeout(tick, FRAME_MS);
    };
    idle = setTimeout(tick, FRAME_MS);
  }
  function finishOpening() {
    clearMotion(); setState('open'); layoutActiveSection(); startIdle();
  }
  function openMenu() {
    if (menu.open) return;
    clearMotion(); previousFocus = document.activeElement; focusOnClose = true;
    setActiveSection(sectionAtScroll(), false);
    menu.showModal(); menu.scrollTop = 0;
    layoutActiveSection();
    document.body.classList.add('menu-open');
    trigger.setAttribute('aria-expanded','true');
    close.focus({preventScroll:true});
    setState('opening');
    if (!gs || paused()) { finishOpening(); return; }
    timeline = gs.timeline({onComplete:finishOpening});
    timeline.fromTo(scene, {opacity:0}, {opacity:1,duration:.16,ease:'none'}, 0)
      .fromTo(entries, {y:15,opacity:0}, {y:0,opacity:1,duration:.20,stagger:.05,ease:'power2.out'}, .02)
      .fromTo(photos, {y:20,opacity:0}, {y:0,opacity:1,duration:.24,stagger:.04,ease:'power2.out'}, .06)
      .fromTo(ornaments, {opacity:0}, {opacity:1,duration:.18,ease:'none'}, .18);
  }
  function finishClosing() {
    clearMotion();
    if (menu.open) menu.close();
    setState('closed');
    trigger.setAttribute('aria-expanded','false');
    document.body.classList.remove('menu-open');
    if (focusOnClose && previousFocus?.isConnected) previousFocus.focus({preventScroll:true});
  }
  function closeMenu({immediate=false,returnFocus=true} = {}) {
    if (!menu.open || state === 'closing') return;
    focusOnClose = returnFocus;
    // Continue from the hover/touch position instead of snapping back before exit.
    const closePose = gs && !paused() && !immediate
      ? closeStrokes.map(path => ({x:Number(gs.getProperty(path,'x')) || 0, y:Number(gs.getProperty(path,'y')) || 0}))
      : null;
    clearMotion(); setState('closing');
    if (!gs || paused() || immediate) { finishClosing(); return; }
    if (!closeIcon || closeStrokes.length !== 2) {
      timeline = gs.to(scene, {opacity:0,duration:.18,ease:'power1.in',onComplete:finishClosing});
      return;
    }
    prepareCloseOrigins();
    if (closePose) closeStrokes.forEach((path, index) => gs.set(path, closePose[index]));
    timeline = gs.timeline({onComplete:finishClosing});
    timeline
      .to(closeStrokes[1], {x:28, y:-28, duration:.20, ease:'power2.in'}, 0)
      .to(closeStrokes[0], {x:28, y:28, duration:.20, ease:'power2.in'}, .045)
      .to(scene, {opacity:0, duration:.14, ease:'power1.in'}, .16);
  }
  trigger.addEventListener('click',openMenu);
  close.addEventListener('click',() => closeMenu());
  menu.addEventListener('cancel',event => {event.preventDefault(); closeMenu();});
  menu.addEventListener('close',() => {
    // Also handles external/native dialog.close(), not only animated closure.
    // A close event can be queued until AFTER a rapid reopen: never close that new session.
    if (!menu.open && state !== 'closed') finishClosing();
  });
  menu.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click',() => {
      const index = entries.indexOf(link);
      if (index >= 0) selectDestination(index);
      else if (link.hash === '#inicio') selectDestination(0);
      closeMenu({immediate:true,returnFocus:false});
      const destination = document.getElementById(link.hash.slice(1));
      if (!destination) return;
      destination.setAttribute('tabindex','-1');
      requestAnimationFrame(() => destination.focus({preventScroll:true}));
    });
  });
  // Explicit focus loop supplements native modality, including Safari variants.
  menu.addEventListener('keydown',event => {
    if (event.key !== 'Tab') return;
    const elements = [...menu.querySelectorAll('a[href],button:not([disabled])')];
    const first = elements[0], last = elements[elements.length-1];
    if (event.shiftKey && document.activeElement === first) {event.preventDefault();last.focus();}
    else if (!event.shiftKey && document.activeElement === last) {event.preventDefault();first.focus();}
  });
  entries.forEach(entry => {
    const label = entry.querySelector('.nav-label');
    const move = x => {
      if (!gs || paused() || !fine.matches || state !== 'open') return;
      gs.to(label,{x,duration:.23,ease:'power2.out',overwrite:true});
    };
    entry.addEventListener('pointerenter',() => move(4));
    entry.addEventListener('pointerleave',() => move(0));
    entry.addEventListener('focus',() => move(4));
    entry.addEventListener('blur',() => move(0));
  });
  function motionChanged() {
    if (state === 'closed') return;
    if (state === 'closing') {finishClosing();return;}
    clearMotion(); setState('open'); startIdle();
  }
  document.addEventListener('casona:motion-change',motionChanged);
  reduced.addEventListener('change',motionChanged);
  fine.addEventListener('change',motionChanged);
  document.addEventListener('visibilitychange',motionChanged);
  setState('closed');
  setActiveSection(sectionAtScroll(), false);
  syncHashSection();
})();
