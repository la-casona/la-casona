/* Independent photographic stems + selectable text. No routes are guessed.
   Bboxes are visible content, never the full padded bitmap. */
(() => {
  'use strict';
  const root=document.querySelector('.food-marquee');
  if(!root)return;
  const view=root.querySelector('.mq-window'),track=root.querySelector('.mq-track'),sequence=root.querySelector('.mq-sequence');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const reference=new URLSearchParams(location.search).has('marquee-reference');
  if(reference)root.dataset.reference='true';
  let map,metrics=[],loop=null,touching=false,focused=false,visible=true,hovered=false,resizeTimer;
  let cycleWidth=0,layoutWidth=0,layoutHeight=0,layoutScale=0;
  const wrap=(value,width)=>((value%width)+width)%width;
  function cyclePosition(){
    return cycleWidth?wrap(view.scrollLeft-Number(gsap.getProperty(track,'x')),cycleWidth)/cycleWidth:0;
  }
  const canvas=document.createElement('canvas'),ctx=canvas.getContext('2d',{willReadFrequently:true});
  // Scan alpha once per source, at reduced resolution, retaining every real image.
  function alphaBounds(img){
    const ratio=Math.min(1,700/img.naturalWidth,700/img.naturalHeight);
    canvas.width=Math.round(img.naturalWidth*ratio);canvas.height=Math.round(img.naturalHeight*ratio);
    ctx.clearRect(0,0,canvas.width,canvas.height);ctx.drawImage(img,0,0,canvas.width,canvas.height);
    const pixels=ctx.getImageData(0,0,canvas.width,canvas.height).data;
    let l=canvas.width,t=canvas.height,r=0,b=0;
    for(let y=0;y<canvas.height;y++)for(let x=0;x<canvas.width;x++)if(pixels[(y*canvas.width+x)*4+3]>12){l=Math.min(l,x);r=Math.max(r,x);t=Math.min(t,y);b=Math.max(b,y)}
    return [l/ratio,t/ratio,(r-l+1)/ratio,(b-t+1)/ratio];
  }
  function layout(){
    // Preserve the visible point, whether rendered by transform or native scrolling.
    const position=cyclePosition();
    if(loop){gsap.killTweensOf(loop);loop.kill()}
    track.querySelectorAll('[data-clone]').forEach(e=>e.remove());
    gsap.set(track,{x:0});view.scrollLeft=0;
    const scale=parseFloat(getComputedStyle(root).getPropertyValue('--mq-scale'));
    // Union of each headline and its VISIBLE sprite bounds. Reserve real breathing
    // room between unions, instead of letting independently positioned groups collide.
    const gap=48;
    let cursor=gap/2;
    const shifts=map.items.map(item=>{
      const left=Math.min(item.title[0],item.sprite[0])*19.83;
      const right=Math.max(item.title[0]+item.title[2],item.sprite[0]+item.sprite[2])*19.83;
      const shift=cursor-left;cursor+=right-left+gap;return shift;
    });
    const artWidth=cursor-gap/2;
    root.style.setProperty('--mq-sequence-width',artWidth*scale+'px');
    if(reference)root.style.width=artWidth+'px';
    const crop=reference?0:260-(root.clientHeight-234*scale)/2/scale;
    map.items.forEach((item,i)=>{
      const li=sequence.children[i],title=li.querySelector('.mq-title'),sprite=li.querySelector('.mq-sprite'),img=sprite.firstElementChild;
      const [l,t,w,h]=metrics[i],box=item.sprite;
      const bw=box[2]*19.83,bh=box[3]*7.93,k=Math.min(bw/w,bh/h);
      const x=box[0]*19.83+shifts[i]+(bw-w*k)/2-l*k,y=box[1]*7.93+(bh-h*k)/2-t*k;
      Object.assign(sprite.style,{left:x*scale+'px',top:(y-crop)*scale+'px',width:img.naturalWidth*k*scale+'px'});
      img.style.setProperty('--image-ratio',`${img.naturalWidth}/${img.naturalHeight}`);
      sprite.style.setProperty('--float-delay',(-i*.47)+'s');
      const family=item.voice==='serif'?'Antic Didone':'Marquee Anton',weight=400;
      const lines=item.lines||[item.text];
      ctx.font=`${weight} 100px "${family}"`;
      const ink=lines.map(line=>ctx.measureText(line)),sample=ink[0];
      // Include the accents of EVERY line (COMPAÑÍA/MIXOLOGÍA), not only LA BUENA.
      const inkTop=Math.min(...ink.map((m,n)=>n*90-m.actualBoundingBoxAscent));
      const inkBottom=Math.max(...ink.map((m,n)=>n*90+m.actualBoundingBoxDescent));
      const size=item.title[3]*7.93*100/(inkBottom-inkTop)*scale;
      title.style.fontSize=size+'px';title.style.transform='none';title.style.width='max-content';
      const measured=title.getBoundingClientRect().width;
      const sx=item.title[2]*19.83*scale/measured;
      // Requested Antic Didone, with measured horizontal condensation to match the reference.
      // Height comes from font-size; no scaleY or synthetic bold.
      title.style.transform=`scaleX(${sx})`;
      const fullAsc=sample.fontBoundingBoxAscent||100,fullDesc=sample.fontBoundingBoxDescent||25;
      const topInk=((90-fullAsc-fullDesc)/2+fullAsc+inkTop)/100*size;
      title.style.left=(item.title[0]*19.83+shifts[i])*scale+'px';
      li.dataset.groupStart=((Math.min(item.title[0],box[0])*19.83+shifts[i])*scale).toFixed(3);
      li.dataset.groupEnd=((Math.max(item.title[0]+item.title[2],box[0]+box[2])*19.83+shifts[i])*scale).toFixed(3);
      title.style.top=(item.title[1]*7.93-crop)*scale-topInk+'px';
    });
    const width=sequence.getBoundingClientRect().width;
    for(let i=0;i<Math.ceil(root.clientWidth/width)+1;i++){
      const clone=sequence.cloneNode(true);clone.dataset.clone='true';clone.setAttribute('aria-hidden','true');clone.inert=true;track.append(clone);
    }
    cycleWidth=width;
    loop=gsap.fromTo(track,{x:-width},{x:0,duration:width/28,repeat:-1,ease:'none',paused:true});
    loop.progress(1-position);
    // The restored position is currently in the transform. sync() may transfer
    // it to scrollLeft for reduced motion, global pause, touch or keyboard focus.
    root.dataset.moving='true';
    root.dataset.sequenceWidth=width.toFixed(2);
    layoutWidth=root.clientWidth;layoutHeight=root.clientHeight;layoutScale=scale;
    sync();
  }
  function staticMode(){return reference||touching||focused||reduced.matches||document.documentElement.classList.contains('motion-paused')}
  function sync(){
    if(!loop)return;
    const stopped=staticMode(),wasMoving=root.dataset.moving==='true';
    let position=view.scrollLeft;
    if(stopped&&wasMoving)position=cyclePosition()*cycleWidth;
    root.dataset.moving=String(!stopped);
    if(stopped){loop.pause();gsap.set(track,{x:0});view.scrollLeft=position}
    else{
      if(!wasMoving){const position=cyclePosition();view.scrollLeft=0;loop.progress(1-position)}
      if(visible&&!document.hidden)loop.play();else loop.pause();
      loop.timeScale(hovered?.45:1);
    }
    root.dataset.offscreen=String(!visible||document.hidden);
  }
  function step(direction){focused=true;sync();const max=view.scrollWidth-view.clientWidth;let next=view.scrollLeft+direction*view.clientWidth*.72;if(next>max+2)next=0;if(next<0)next=max;view.scrollTo({left:Math.max(0,Math.min(max,next)),behavior:'auto'})}
  view.addEventListener('keydown',event=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(event.key)){event.preventDefault();focused=true;sync();if(event.key==='Home')view.scrollLeft=0;else if(event.key==='End')view.scrollLeft=view.scrollWidth;else step(event.key==='ArrowRight'?1:-1)}});
  view.addEventListener('focus',()=>{focused=view.matches(':focus-visible');sync()});view.addEventListener('blur',()=>{focused=false;sync()});
  // No local controls. The existing global motion preference remains authoritative.
  // Touch suspends only during the gesture, keyboard focus until blur.
  root.addEventListener('pointerenter',event=>{if(event.pointerType!=='mouse')return;hovered=true;if(loop&&!staticMode())gsap.to(loop,{timeScale:.45,duration:.45,overwrite:true})});
  view.addEventListener('pointerdown',event=>{if(event.pointerType==='touch'){touching=true;focused=false;hovered=false;sync()}});
  const finishTouch=()=>{if(touching){touching=false;sync()}};
  window.addEventListener('pointerup',finishTouch);window.addEventListener('pointercancel',finishTouch);
  root.addEventListener('pointerleave',()=>{hovered=false;if(loop&&!staticMode())gsap.to(loop,{timeScale:1,duration:.45,overwrite:true})});
  document.addEventListener('casona:motion-change',sync);document.addEventListener('visibilitychange',sync);
  reduced.addEventListener('change',sync);
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync()},{rootMargin:'60px'}).observe(root);
  // Mobile browser chrome changes viewport HEIGHT during vertical scrolling.
  // Rebuild only when this component's geometry changes, never for that event alone.
  window.addEventListener('resize',()=>{
    clearTimeout(resizeTimer);
    resizeTimer=setTimeout(()=>{
      if(!map||root.dataset.ready!=='true')return;
      const scale=parseFloat(getComputedStyle(root).getPropertyValue('--mq-scale'));
      if(root.clientWidth!==layoutWidth||root.clientHeight!==layoutHeight||scale!==layoutScale)layout();
    },120);
  });
  (async()=>{
    const response=await fetch('references/marquee/mount-map.json');if(!response.ok)throw Error('No se pudo cargar el mapa');map=await response.json();
    await Promise.all([document.fonts.load('400 100px "Antic Didone"'),document.fonts.load('400 100px "Marquee Anton"'),...[...sequence.querySelectorAll('img')].map(img=>img.decode())]);
    metrics=[...sequence.querySelectorAll('img')].map(alphaBounds);
    root.dataset.ready='true';layout();
    root.dispatchEvent(new CustomEvent('marquee:ready'));
  })().catch(error=>{console.error('[MARQUEE]',error);root.dataset.error='true';root.dataset.moving='false';});
})();
