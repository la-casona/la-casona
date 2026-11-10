/* Approved layered hero. Greeting SVGs and their controller are not replaced.
   Native scroll: 0 → one hero height; title 0 → -32px, courtyard 0 → -52px.
   No idle RAF, scroll interception, hover-only action, or additional library. */
(() => {
  'use strict';
  const hero = document.querySelector('.editorial-hero');
  if (!hero) return;
  const root = document.documentElement;
  const title = hero.querySelector('.arch-title');
  const second = hero.querySelector('.arch-title-second');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const desktop = matchMedia('(min-width:901px) and (hover:hover) and (pointer:fine)');
  let frame = 0;
  let sizing = true;
  let formatter;
  try { formatter = new Intl.DateTimeFormat('es-MX', {timeZone:'America/Mexico_City', hour:'2-digit', minute:'2-digit', hourCycle:'h23'}); } catch (_) {}
  // Same clock rules as the previous hero; greeting-motion.js still owns all SVG/word animation.
  function updateClock() {
    if (!formatter) return;
    try {
      const now = new Date();
      const parts = formatter.formatToParts(now);
      const hour = Number(parts.find(p => p.type === 'hour').value);
      const minute = parts.find(p => p.type === 'minute').value;
      const period = hour >= 5 && hour < 12 ? 'morning' : hour >= 12 && hour < 19 ? 'afternoon' : 'night';
      if (!hero.dataset.greetingMotion) {
        document.getElementById('local-greeting').textContent = period === 'morning' ? 'Buenos días.' : period === 'afternoon' ? 'Buenas tardes.' : 'Buenas noches.';
        document.getElementById('day-symbol').textContent = period === 'night' ? '☾' : '☀';
      }
      const clock = document.getElementById('local-clock');
      clock.textContent = `${String(hour).padStart(2,'0')}:${minute}`;
      clock.dateTime = now.toISOString();
      document.getElementById('clock-separator').hidden = false;
      hero.dataset.dayPeriod = period;
    } catch (_) { /* Original neutral greeting remains usable. */ }
  }
  const measure = document.createElement('canvas').getContext('2d');
  function fitTitle() {
    // Actual wine-coloured ink measured in the owner's 1024×549 crop:
    // EL SABOR [80,79,559,113], DE [78,206,146,106], ENCONTRARNOS [80,324,878,111].
    const width=hero.clientWidth, height=hero.clientHeight, mobile=width<=900;
    const first=hero.querySelector('.arch-title-first'), children=[...second.children];
    const stretch=parseFloat(getComputedStyle(title).getPropertyValue('--title-stretch'))||1.2;
    [first,second,...children].forEach(line=>{
      ['--fit-title-size','font-size','letter-spacing','transform','transform-origin','left','top','position','line-height','margin-top','width'].forEach(p=>line.style.removeProperty(p));
      delete line.dataset.inkWidth; delete line.dataset.inkHeight;
    });
    // Retain desktop's two-line composition. The crop calibrates the three-line
    // mobile title; it is not mistaken for the dimensions of the whole hero.
    if(mobile)Object.assign(second.style,{position:'static',width:'auto'});
    const anchor=height*.405;
    const lines=mobile ? [
      [first,'EL SABOR',80/1024*width,anchor,559/1024*width,113/1024*width],
      [children[0],'DE',78/1024*width,anchor+127/1024*width,146/1024*width,106/1024*width],
      [children[1],'ENCONTRARNOS',80/1024*width,anchor+245/1024*width,878/1024*width,111/1024*width]
    ] : [
      [first,'EL SABOR',width*.118,height*.255,width*.461,width*.092],
      [second,'DE ENCONTRARNOS',width*.12,height*.44,width*.796,width*.092]
    ];
    const family=getComputedStyle(title).fontFamily;
    lines.forEach(([line,text,x,y,targetWidth,targetHeight])=>{
      measure.font=`400 100px ${family}`;measure.letterSpacing='0px';
      const base=measure.measureText(text);
      const size=targetHeight/(base.actualBoundingBoxAscent+base.actualBoundingBoxDescent)*100/stretch;
      measure.font=`400 ${size}px ${family}`;
      let tracking=0,ink;
      for(let n=0;n<4;n++){
        measure.letterSpacing=tracking+'px';ink=measure.measureText(text);
        tracking+=(targetWidth-ink.actualBoundingBoxLeft-ink.actualBoundingBoxRight)/text.length;
      }
      measure.letterSpacing=tracking+'px';ink=measure.measureText(text);
      const ascent=ink.fontBoundingBoxAscent||size*.85,descent=ink.fontBoundingBoxDescent||size*.25;
      const inkTop=(size-ascent-descent)/2+ascent-ink.actualBoundingBoxAscent;
      Object.assign(line.style,{position:'absolute',width:'max-content',fontSize:size.toFixed(3)+'px',lineHeight:'1',letterSpacing:tracking.toFixed(3)+'px',transform:`scaleY(${stretch})`,transformOrigin:'0 0',left:(x+ink.actualBoundingBoxLeft).toFixed(3)+'px',top:(y-inkTop*stretch).toFixed(3)+'px',marginTop:'0'});
      line.style.setProperty('--fit-title-size',size.toFixed(3)+'px');
      line.dataset.inkWidth=(ink.actualBoundingBoxLeft+ink.actualBoundingBoxRight).toFixed(3);
      line.dataset.inkHeight=((ink.actualBoundingBoxAscent+ink.actualBoundingBoxDescent)*stretch).toFixed(3);
    });
    hero.dataset.typographyReady='true';
  }
  function render() {
    frame = 0;
    if (sizing) { fitTitle(); sizing = false; }
    const still = reduced.matches || !desktop.matches || root.classList.contains('motion-paused') || document.hidden;
    const progress = still ? 0 : Math.max(0, Math.min(1, -hero.getBoundingClientRect().top / hero.offsetHeight));
    hero.style.setProperty('--title-drift', `${(-32 * progress).toFixed(2)}px`);
    hero.style.setProperty('--photo-drift', `${(-52 * progress).toFixed(2)}px`);
  }
  function schedule() { if (!frame) frame = requestAnimationFrame(render); }
  function resize() { sizing = true; schedule(); }
  addEventListener('scroll', schedule, {passive:true});
  addEventListener('resize', resize, {passive:true});
  addEventListener('pageshow', resize);
  document.addEventListener('casona:motion-change', schedule);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) updateClock(); schedule(); });
  reduced.addEventListener('change', schedule);
  desktop.addEventListener('change', schedule);
  document.fonts?.ready.then(resize);
  document.fonts?.addEventListener('loadingdone', resize);
  updateClock();
  setInterval(() => { if (!document.hidden) updateClock(); }, 60000);
  resize();
})();
