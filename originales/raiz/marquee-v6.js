/* MARQUEE DE LA CASONA · v6 "Seda" con guirnaldas florales (v5 + bordes botánicos)
   Motor original (28 px/s, hover 45 %, 450 ms, pausa, teclado, táctil, reducido)
   + titulares en negro, cintas de seda (canvas) que no se repiten,
   ilustraciones temáticas pulidas entre platillos y trazo "a mano" a 7 fps. */
(() => {
  'use strict';
  /* 1. DATOS DE COMPOSICIÓN (idénticos al original) */
  const items = [
    {title:[1.7,34.1,9.5,11.7],sprite:[1.4,43.2,10.7,18.9]},
    {title:[12.1,33.7,6.4,12.3],sprite:[12.1,43,7.2,13]},
    {title:[19.8,33.9,7,12],sprite:[19.6,43,8.6,19.2]},
    {title:[26.7,33,7.1,16],sprite:[28.9,44.1,6.4,17]},
    {title:[34.8,33.5,9,12],sprite:[37.3,44.8,7,17.5]},
    {title:[44.7,33,8.4,16.3],sprite:[46.6,44,6.5,17.9]},
    {title:[53,33.7,8,12.4],sprite:[51.7,44.4,10.2,16.5]},
    {title:[61.3,33.7,7,12.4],sprite:[60.7,44.2,9.1,16.8]},
    {title:[70,33.9,7.8,12],sprite:[69.8,44.3,9.5,16.7]},
    {title:[78.5,34,10.7,10],sprite:[79.5,43.8,8.7,18]},
    {title:[89.9,32.8,9.4,17],sprite:[90,44.4,8.9,17]}
  ];
  const metrics = [
    [104.57142857142857,198.85714285714283,989.1428571428571,502.2857142857143],
    [132.85714285714286,175.71428571428572,738.5714285714287,484.28571428571433],
    [177.57142857142858,166.57142857142858,765.2857142857143,609.7142857142858],
    [55.714285714285715,100,588.5714285714286,800],
    [55.714285714285715,91.42857142857143,588.5714285714286,815.7142857142858],
    [142.85714285714286,80,414.28571428571433,840],
    [88,209,924,482.42857142857144],
    [63.40571428571429,108.97857142857143,1250.2814285714287,966.9371428571429],
    [88,171.28571428571428,924,557.8571428571429],
    [80.14285714285714,185.42857142857144,839.1428571428571,729.1428571428571],
    [88,80.14285714285714,924,839.1428571428571]
  ];

  /* 2. ILUSTRACIONES (viewBox -22..22). Cada una va en el hueco que SIGUE a su platillo. */
  const C = {ink:'#171410',cream:'#f4eedf',wine:'#4a121a',green:'#19382c',leaf:'#3f6b45',mint:'#4f7f55',terra:'#b8432a',gold:'#c4913a',bun:'#d29a4c',cheese:'#e8b443',lime:'#dfe39a',limeRind:'#8fae3c'};
  const L = (d,c=C.ink,w=1.4,extra='') => `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;
  const F = (d,fill,stroke=C.ink,w=1.2,extra='') => `<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${w}" stroke-linejoin="round" ${extra}/>`;
  const G = (cls,origin,inner,style='') => `<g class="${cls}" style="transform-box:fill-box;transform-origin:${origin};${style}">${inner}</g>`;

  /* Espiga de trigo (vertical, base en y=18) */
  const stalk = () => {
    let g=L('M0 18Q.8 4 0 -19',C.wine,1.1);
    for(let k=0;k<5;k++){const y=-17+k*4.2;
      g+=F(`M0 ${y+3.4}C-5.6 ${y+2.6} -6.4 ${y-1.6} -5.2 ${y-3.4}C-2 ${y-2.2} -.4 ${y} 0 ${y+3.4}Z`,C.gold,C.wine,.9);
      g+=F(`M0 ${y+3.4}C5.6 ${y+2.6} 6.4 ${y-1.6} 5.2 ${y-3.4}C2 ${y-2.2} .4 ${y} 0 ${y+3.4}Z`,C.gold,C.wine,.9);
      g+=L(`M-4.8 ${y-3}L-7.6 ${y-7.4}M4.8 ${y-3}L7.6 ${y-7.4}`,C.wine,.6,'stroke-opacity=".7"');
    }
    g+=F('M0 -15C-1.6 -18 -1.2 -21 0 -23C1.2 -21 1.6 -18 0 -15Z',C.gold,C.wine,.9);
    g+=F('M.4 10C5 7 8 2 9 -3C5 -1 2 4 .4 10Z','#5d7f42',C.green,.8);
    return g;
  };
  /* Copa de vino centrada en cx, base en y=13 */
  const glass = (cx,wine) =>
    `<path d="M${cx-5.4} -8H${cx+5.4}C${cx+5.2} -3 ${cx+2} -.6 ${cx} -.4C${cx-2} -.6 ${cx-5.2} -3 ${cx-5.4} -8Z" fill="${wine}" fill-opacity=".85"/>`+
    L(`M${cx-6} -14H${cx+6}C${cx+6} -4 ${cx+2.2} -.4 ${cx} -.2C${cx-2.2} -.4 ${cx-6} -4 ${cx-6} -14ZM${cx} 0V12.4M${cx-5} 12.8H${cx+5}`,C.ink,1.3)+
    L(`M${cx-4} -12V-9`,C.cream,1,'stroke-opacity=".8"');
  const asteriskStrokes = ['M0 -16V16','M-14 -8L14 8','M-14 8L14 -8','M-7.5 -14L7.5 14','M7.5 -14L-7.5 14'];

  /* Hoja de albahaca (anverso o envés) */
  const BASIL='M0 15C-11 5 -8.4 -8.6 0 -15.6C8.4 -8.6 11 5 0 15Z';
  const basil = back => F(BASIL,back?'#8fb27f':C.leaf,C.ink,1.2)+
    L('M0 13.6V-12.6M0 5L-5 .4M0 -1.6L4.6 -6.2M0 9L4.4 5.2M0 -6.6L-3.6 -9.6',back?C.green:C.cream,back?.8:1,back?'stroke-opacity=".7"':'');

  /* Llama genérica, base en y=11 */
  const flame=(w,h,lean,dx=0)=>{const b=11,x=v=>(v+dx).toFixed(2);
    return `M${x(0)} ${b}C${x(-w)} ${b} ${x(-w)} ${(b-h*.45).toFixed(2)} ${x(lean*.4-w*.32)} ${(b-h*.7).toFixed(2)}C${x(lean*.6)} ${(b-h*.84).toFixed(2)} ${x(lean)} ${(b-h*.9).toFixed(2)} ${x(lean)} ${(b-h).toFixed(2)}C${x(lean+w*.62)} ${(b-h*.74).toFixed(2)} ${x(w)} ${(b-h*.46).toFixed(2)} ${x(w*.92)} ${(b-h*.2).toFixed(2)}C${x(w*.82)} ${(b-h*.04).toFixed(2)} ${x(w*.5)} ${b} ${x(0)} ${b}Z`;};
  const FR=[{l:-2,h:26,sl:-1.5,sh:12},{l:1.6,h:23.5,sl:1.2,sh:14},{l:-.6,h:28,sl:-.4,sh:10.5},{l:2.6,h:25,sl:1.8,sh:13}];
  const fireLayer=(w,k,fill,stroke,shift,tongues)=>FR.map((f,n)=>{
    const cls=`fl fl${(n+shift)%4}`;
    let d=flame(w,f.h*k,f.l*k);
    if(tongues)d+=flame(w*.42,f.sh,f.sl-2,-6.2)+flame(w*.38,f.sh*.86,f.sl+2.4,6.4);
    return `<path class="${cls}" d="${d}" fill="${fill}" ${stroke?`stroke="${stroke}" stroke-width="1.1" stroke-linejoin="round"`:''}/>`;
  }).join('');
  const log=(a,ring)=>`<g transform="rotate(${a} 0 15)"><rect x="-15.5" y="12.7" width="31" height="4.8" rx="2.4" fill="#8a5230" stroke="${C.ink}" stroke-width="1.1"/>`+
    L('M-11 14.4H-3M2 15.9H9',C.ink,.6,'stroke-opacity=".55"')+
    `<ellipse cx="${ring}" cy="15.1" rx="1.7" ry="2.4" fill="#e2b98a" stroke="${C.ink}" stroke-width="1"/><ellipse cx="${ring}" cy="15.1" rx=".6" ry=".9" fill="none" stroke="#8a5230" stroke-width=".6"/></g>`;

  /* Penca de agave: dos tonos, espinas laterales y espina terminal */
  const penca=(a,len,w,fill,delay)=>{
    const tip=-len;let spines='';
    [.34,.64].forEach(t=>{const y=-len*t,x=w*(1-t*t)*.98;
      spines+=`M${(-x).toFixed(2)} ${y.toFixed(2)}l-1.5 -.5M${x.toFixed(2)} ${y.toFixed(2)}l1.5 -.5`;});
    const body=F(`M${-w} 0Q${-w*.92} ${-len*.55} 0 ${tip}Q${w*.92} ${-len*.55} ${w} 0Z`,fill,C.ink,1.1)+
      `<path d="M${-w*.34} 0Q${-w*.3} ${-len*.5} 0 ${-len*.84}Q${w*.3} ${-len*.5} ${w*.34} 0Z" fill="#7f9a7c" fill-opacity=".55"/>`+
      L(spines,C.ink,.8)+L(`M0 ${tip}V${tip-2.2}`,C.ink,.9);
    return `<g transform="translate(0 10) rotate(${a})">${G('o-agleaf','50% 100%',body,`animation-delay:${delay}s`)}</g>`;
  };

  const ORN = {
    /* PLATILLOS → tenedor y cuchillo */
    platillos: G('o-clink-l','50% 100%',L('M-7 -16V-8M-10 -16V-8Q-10 -4 -7 -4Q-4 -4 -4 -8V-16M-7 -4V16',C.ink,1.5))+
               G('o-clink-r','50% 100%',L('M7 16V-16C11 -12 11 -4 7 -2',C.ink,1.5)),
    /* POSTRES → cerezas */
    postres: G('o-swing','55% 0%',L('M2 -16Q-1 -6 -6 3M2 -16Q5 -6 7 5',C.green,1.3)+F('M2 -16Q8 -20 12 -15Q7 -12 2 -16Z',C.leaf,C.green,1.1)+
             `<circle cx="-6" cy="8" r="5.5" fill="${C.terra}" stroke="${C.wine}" stroke-width="1.3"/><circle cx="7" cy="10" r="5.5" fill="${C.terra}" stroke="${C.wine}" stroke-width="1.3"/>`+L('M-8 6Q-7.5 5 -6.5 5',C.cream,1.2)),
    /* PIZZA → albahaca que se voltea (enseña el envés) + jitomate cherry que rebota */
    pizza: `<g transform="translate(-7 -1.6)">`+G('o-sway','50% 100%',L('M0 15V19.4',C.ink,1.2)+
             G('o-bflip','50% 50%',basil(false)+`<g class="o-bback">${basil(true)}</g>`))+`</g>`+
           G('o-tshadow','50% 50%',`<ellipse cx="12.6" cy="20" rx="6" ry="1.2" fill="${C.ink}" fill-opacity=".16"/>`)+
           G('o-tbounce','50% 100%',`<circle cx="12.6" cy="13.6" r="6.2" fill="${C.terra}" stroke="${C.ink}" stroke-width="1.3"/>`+
             L('M10 11.4Q10.7 10.2 11.9 10',C.cream,1.2,'stroke-opacity=".85"')+
             F('M12.6 7.8L10.4 6.4 12 7.4 11.4 5.4 12.8 7.2 14.4 5.6 13.6 7.6 15.4 7.4Z','#5d8a4a',C.ink,.8)),
    /* LA BUENA BEBIDA → medio limón que se exprime sobre un vaso:
       torsión, chorro, el nivel sube, salpica, hielo flotando y última gota */
    'la-buena-bebida':
      /* vaso: interior con líquido recortado */
      `<g clip-path="url(#mq-glass-clip)">`+
        G('o-llevel','50% 50%',`<rect x="-11" y="6" width="22" height="16" fill="#e7df9c" fill-opacity=".85"/>`+
          L('M-10 6Q-5 4.8 0 6T10 6',C.ink,.8,'stroke-opacity=".55"')+
          G('o-lice','50% 50%',`<rect x="-5.8" y="5" width="6" height="6" rx="1.2" fill="#f6f3e6" fill-opacity=".92" stroke="${C.ink}" stroke-width=".9"/>`))+
      `</g>`+
      L('M-10 -3.4L-7.8 19.6H7.8L10 -3.4',C.ink,1.5)+L('M-7.4 1.6L-6.6 12',C.cream,1.1,'stroke-opacity=".8"')+
      /* chorro, salpicadura, última gota */
      G('o-lstream','50% 0%',`<path d="M-.9 -8Q-1.2 -1 -.6 6H.6Q1.2 -1 .9 -8Z" fill="${C.limeRind}"/>`)+
      G('o-lsplash','50% 100%',L('M-2.6 3.2L-5.4 .2M2.6 3.2L5.4 .2M0 2.6V-.6',C.limeRind,1.1)+`<circle cx="-6.4" cy="-1.4" r=".8" fill="${C.limeRind}"/><circle cx="6.6" cy="-1" r=".7" fill="${C.limeRind}"/>`)+
      G('o-ldrop','50% 50%',`<path d="M0 -8.4C0 -7 -1.3 -6 -1.3 -4.9A1.3 1.3 0 0 0 1.3 -4.9C1.3 -6 0 -7 0 -8.4Z" fill="${C.limeRind}"/>`)+
      /* marcas de presión */
      `<g class="o-lpress">${L('M-16.4 -18Q-14.6 -15 -16.4 -11.6M-18.8 -16.6Q-17.6 -15 -18.8 -13M16.4 -18Q14.6 -15 16.4 -11.6M18.8 -16.6Q17.6 -15 18.8 -13',C.ink,1)}</g>`+
      /* medio limón, corte hacia abajo */
      G('o-lsq','50% 100%',
        F('M-12 -8C-12 -16.6 -6 -21 0 -21C6 -21 12 -16.6 12 -8Z',C.limeRind,C.ink,1.3)+
        F('M-10.6 -8C-10.6 -15 -5.4 -18.8 0 -18.8C5.4 -18.8 10.6 -15 10.6 -8Z',C.lime,'none',0)+
        L('M0 -8V-18M0 -8L-7.2 -15.8M0 -8L7.2 -15.8M0 -8L-10 -11.4M0 -8L10 -11.4',C.limeRind,.8,'stroke-opacity=".8"')+
        `<circle cx="-4.6" cy="-12.6" r=".7" fill="${C.cream}"/><circle cx="4" cy="-14" r=".6" fill="${C.cream}"/>`+
        L('M-13 -8H13',C.ink,1.4)+F('M1.6 -21C3.4 -24.6 8 -24.6 10 -22.8C7.4 -20.4 3.6 -20 1.6 -21Z',C.leaf,C.ink,1)),
    /* CÓCTELES → asterisco que se dibuja trazo a trazo, gira y se borra; destellos */
    cocteles: G('o-star','50% 50%',asteriskStrokes.map((d,i)=>L(d,C.terra,1.7,`pathLength="1" class="o-draw" style="animation-delay:${(i*.12).toFixed(2)}s"`)).join('')+
              `<circle r="2.2" fill="${C.ink}" class="o-pop" style="transform-box:fill-box;transform-origin:center"/>`)+
              G('o-pop','50% 50%',`<path d="M15 -15L16 -12.6 18.4 -11.6 16 -10.6 15 -8.2 14 -10.6 11.6 -11.6 14 -12.6Z" fill="${C.gold}"/>`,'animation-delay:.18s')+
              G('o-pop','50% 50%',`<path d="M-15 13L-14.2 15 -12.2 15.8 -14.2 16.6 -15 18.6 -15.8 16.6 -17.8 15.8 -15.8 15Z" fill="${C.gold}"/>`,'animation-delay:.36s'),
    /* MIXOLOGÍA → ramita de menta: cada hoja aletea a su ritmo;
       la de arriba se desprende, cae en zigzag y vuelve a brotar */
    mixologia: G('o-sway-soft','50% 100%',
      L('M0 19Q1.2 4 -.6 -10.6',C.green,1.3)+
      [['M0 9C-4 9.6 -10 7 -12.6 1C-7 .4 -2.6 3.6 0 9Z','M0 9C-4 6 -8 3.6 -11 1.8','100% 100%',0],
       ['M0 7C4 7.6 10 5 12.6 -1C7 -1.6 2.6 1.6 0 7Z','M0 7C4 4 8 1.6 11 -.2','0% 100%',-.45],
       ['M0 -1C-3.6 -1 -8.6 -3 -10 -8.6C-5.6 -8.6 -1.8 -6 0 -1Z','M0 -1C-3 -3 -6 -5 -9 -7.8','100% 100%',-.9],
       ['M0 -3C3.6 -3 8.6 -5 10 -10.6C5.6 -10.6 1.8 -8 0 -3Z','M0 -3C3 -5 6 -7 9 -9.8','0% 100%',-.25]]
      .map(([d,v,o,dl])=>G('o-mleaf',o,F(d,C.mint,C.ink,1.1)+L(v,C.green,.7,'stroke-opacity=".8"'),`animation-delay:${dl}s`)).join('')+
      G('o-mfall','50% 100%',F('M-.6 -10.6C-3.8 -12.8 -3.8 -18 -.6 -21.4C2.6 -18 2.6 -12.8 -.6 -10.6Z','#6a9a62',C.ink,1.1)+L('M-.6 -11.4V-19.6',C.green,.7,'stroke-opacity=".8"'))),
    /* LA BUENA COMIDA → agave en maceta de barro; el quiote crece y florece */
    'la-buena-comida':
      L('M.4 9Q-1.2 -6 1 -21',C.ink,1.2,'pathLength="1" class="o-quiote"')+
      G('o-bloom','50% 50%',[[1,-21.6,1.7],[-1.6,-20,1.2],[3.4,-20,1.2],[-.6,-23.4,1],[2.8,-23.2,1]].map(([x,y,r])=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${C.cheese}" stroke="${C.ink}" stroke-width=".7"/>`).join(''))+
      penca(-14,23,3.4,'#a9bba1',-.3)+penca(14,22,3.4,'#a9bba1',-.9)+penca(0,25,3.6,'#b7c7ad',-.6)+
      penca(-44,19,3.6,'#c9d3bd',0)+penca(44,19,3.6,'#c9d3bd',-1.2)+
      F('M-8.6 11.6H8.6L7 21H-7Z',C.terra,C.ink,1.2)+
      `<rect x="-10.4" y="8.6" width="20.8" height="3.2" rx="1" fill="#c65a36" stroke="${C.ink}" stroke-width="1.2"/>`+
      L('M-7.4 15.6L-4.9 13.8L-2.4 15.6L0 13.8L2.4 15.6L4.9 13.8L7.4 15.6','#2f5d8a',1.1),
    /* PARRILLA → fogata: resplandor, humo, 3 capas de llama desfasadas a 7 fps,
       leños cruzados con veta y anillos, brasas que suben y círculo de piedras */
    parrilla:
      `<circle class="o-glow" cx="0" cy="5" r="22" fill="url(#mq-fire-glow)"/>`+
      [[-3,0],[3.4,-1.3]].map(([x,d])=>`<g class="o-smoke" style="transform-box:fill-box;transform-origin:50% 100%;animation-delay:${d}s">${L(`M${x} -16Q${x-2.4} -18.6 ${x} -21Q${x+2.2} -23 ${x} -25`,C.ink,.9,'stroke-opacity=".35"')}</g>`).join('')+
      fireLayer(10.4,1,'#c2412a',C.ink,0,true)+
      fireLayer(6.8,.72,'#e8782f','',1,false)+
      fireLayer(3.8,.44,'#f4c650','',2,false)+
      log(-17,13.4)+log(17,-13.4)+
      [[-4,0,'#f4c650'],[3,-.6,'#e8782f'],[.6,-1.1,'#f4c650']].map(([x,d,c])=>`<circle class="o-ember" style="transform-box:fill-box;transform-origin:center;animation-delay:${d}s" cx="${x}" cy="-4" r=".9" fill="${c}"/>`).join('')+
      [[-15.6,19.4,3.2],[-9.4,20.4,3],[-3,20.8,3.2],[3.4,20.8,3],[9.6,20.4,3.2],[15.8,19.4,2.8]].map(([x,y,r])=>`<ellipse cx="${x}" cy="${y}" rx="${r}" ry="2.1" fill="#d6cdbb" stroke="${C.ink}" stroke-width="1"/>`).join(''),
    /* PASTAS → dos espigas cruzadas con lazo */
    pastas: `<g transform="rotate(-16 0 18)">${G('o-sway-soft','50% 100%',stalk())}</g>`+
            `<g transform="rotate(16 0 18)">${G('o-sway-soft o-late','50% 100%',stalk())}</g>`+
            F('M0 9C-5 5 -10 6 -9 10C-8 13 -4 12 0 9Z',C.terra,C.wine,1)+F('M0 9C5 5 10 6 9 10C8 13 4 12 0 9Z',C.terra,C.wine,1)+
            L('M-.6 9.6L-4.6 17M.6 9.6L4.2 17.4',C.terra,1.6)+`<circle cx="0" cy="9.2" r="1.8" fill="${C.terra}" stroke="${C.wine}" stroke-width="1"/>`,
    /* HAMBURGUESAS → hamburguesa con banderita: se aplasta, el pan rebota */
    hamburguesas: G('o-squish','50% 100%',
        F('M-15 10H15V11.4C15 14.6 -15 14.6 -15 11.4Z',C.bun)+
        `<rect x="-15.6" y="4.2" width="31.2" height="5.6" rx="2.8" fill="${C.wine}" stroke="${C.ink}" stroke-width="1.2"/>`+
        F('M-15 2.4H15V4.4H6.6L3.6 8L.6 4.4H-15Z',C.cheese)+
        F('M-16.4 2.6Q-14.4 -.6 -12.4 2.6T-8.4 2.6T-4.4 2.6T-.4 2.6T3.6 2.6T7.6 2.6T11.6 2.6T15.6 2.6Q16.6 1 16.4 .2H-16.4Z','#79a256',C.green,1.1)+
        G('o-bun','50% 100%',
          F('M-15 -.4C-15 -13 15 -13 15 -.4Z',C.bun)+
          [[-8,-6,-20],[-2,-9,10],[5,-7,-12],[10,-4,25],[-11,-2.6,40],[1,-4,-5]].map(([x,y,a])=>`<ellipse cx="${x}" cy="${y}" rx="1.4" ry=".75" transform="rotate(${a} ${x} ${y})" fill="${C.cream}"/>`).join('')+
          L('M3 -10.2V-19',C.ink,1.1)+G('o-flag','0% 50%',F('M3 -19L10.6 -16.8L3 -14.6Z',C.terra,C.wine,1)))),
    /* LA BUENA COMPAÑÍA → brindis: las copas se inclinan sobre su base y sus bordes se tocan */
    'la-buena-compania': G('o-cheers-l','50% 100%',glass(-9,C.terra))+G('o-cheers-r','50% 100%',glass(9,C.gold))+
              `<g class="o-marks" style="transform-box:fill-box;transform-origin:50% 100%">${L('M0 -22V-18.4M-5.4 -20.6L-3.4 -17.4M5.4 -20.6L3.4 -17.4',C.terra,1.3)}</g>`
  };

  /* 3. REFERENCIAS Y ESTADO */
  const root=document.querySelector('.food-marquee');
  if(!root)return;
  // Integración: casona.js mantiene el control global y su preferencia existente.
  const view=root.querySelector('.mq-window'), track=root.querySelector('.mq-track'), sequence=root.querySelector('.mq-sequence');
  const canvas=root.querySelector('.mq-waves'), wctx=canvas.getContext('2d');
  const turbulences=[...root.querySelectorAll('.mq-defs feTurbulence')];
  const rules=root.querySelector('.mq-rules');
  let garlands=[];
  const button=document.querySelector('.standalone-pause'), status=document.querySelector('.standalone-status');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const reference=new URLSearchParams(location.search).has('marquee-reference');
  const ctx=document.createElement('canvas').getContext('2d');
  const GAP=160;
  if(reference)root.dataset.reference='true';
  let touching=false, focused=false, visible=true, hovered=false, paused=false;
  let width=0, offset=0, moving=false, frame=0, lastTime=0, speed=1;
  let layoutWidth=0, layoutHeight=0, layoutScale=0, resizeTimer;
  let skew=0, skewV=0, accel=0, contentVel=0;
  let lastScroll=0, lastScrollT=0, boilTimer=0, seed=1, fireFrame=0;
  let travel=0, waveT=17.3, W=0, H=0, dpr=1;
  const wrap=(value,size)=>((value%size)+size)%size;
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const position=()=>width?wrap(moving?offset:view.scrollLeft,width)/width:0;
  const globalPaused=()=>document.documentElement.classList.contains('motion-paused');
  const staticMode=()=>reference||touching||focused||reduced.matches||paused||globalPaused();
  const motionOK=()=>!reduced.matches&&!reference&&!globalPaused();

  /* 4. CINTAS DE SEDA
     Cada cinta suma tres senos con frecuencias inconmensurables (1, φ, √2, e…)
     y velocidades distintas: el dibujo ondula siempre igual de suave, pero nunca
     vuelve a coincidir consigo mismo. También deriva un poco con la franja. */
  const RIBBONS=[
    {rgb:'214,128,146',a:.32,y:.4, amp:.17,th:.2, f:[1,1.618,2.414],s:[.23,-.14,.09],p:[0,1.3,2.1],par:.22},
    {rgb:'112,152,196',a:.28,y:.6,amp:.15,th:.17,f:[.83,1.414,2.718],s:[-.18,.12,-.07],p:[.7,2.4,4],par:.32}
  ];
  function sizeWaves(){
    dpr=Math.min(window.devicePixelRatio||1,2);W=root.clientWidth;H=root.clientHeight;
    canvas.width=Math.round(W*dpr);canvas.height=Math.round(H*dpr);
  }
  function drawWaves(){
    if(!W||reference)return;
    wctx.setTransform(dpr,0,0,dpr,0,0);wctx.clearRect(0,0,W,H);
    const t=waveT, step=Math.max(6,W/180), Lw=Math.max(420,W*.42);
    RIBBONS.forEach(r=>{
      const top=[],bot=[];
      for(let x=-step;x<=W+step;x+=step){
        const u=(x+travel*r.par)/Lw*Math.PI*2;
        const c=H*(r.y+r.amp*(.6*Math.sin(r.f[0]*u+r.s[0]*t+r.p[0])+.3*Math.sin(r.f[1]*u+r.s[1]*t+r.p[1])+.14*Math.sin(r.f[2]*u+r.s[2]*t+r.p[2])));
        const th=H*r.th*(.55+.45*Math.sin(.61*u+.19*t+r.p[1]*2));
        const twist=.5+.5*Math.sin(.47*u-.11*t+r.p[2]);
        top.push([x,c-th*twist]);bot.push([x,c+th*(1-twist)]);
      }
      const g=wctx.createLinearGradient(0,0,W,0);
      for(let i=0;i<=6;i++){const k=.45+.55*(.5+.5*Math.sin(i*1.7+t*.13+r.p[0]*3));g.addColorStop(i/6,`rgba(${r.rgb},${(r.a*k).toFixed(3)})`);}
      wctx.beginPath();wctx.moveTo(top[0][0],top[0][1]);
      top.forEach(([x,y])=>wctx.lineTo(x,y));
      for(let i=bot.length-1;i>=0;i--)wctx.lineTo(bot[i][0],bot[i][1]);
      wctx.closePath();wctx.fillStyle=g;wctx.fill();
      /* Filo de la cinta: línea fina que le da cuerpo de seda */
      wctx.beginPath();top.forEach(([x,y],i)=>i?wctx.lineTo(x,y):wctx.moveTo(x,y));
      wctx.strokeStyle=`rgba(${r.rgb},${(r.a*1.6).toFixed(3)})`;wctx.lineWidth=1;wctx.stroke();
    });
  }
  function setBoil(on){
    if(on&&!boilTimer){
      boilTimer=setInterval(()=>{
        seed=seed%97+1;turbulences.forEach((t,i)=>t.setAttribute('seed',String(seed+i*11)));
        fireFrame=(fireFrame+1)%4;root.dataset.f=String(fireFrame);
      },1000/7);
    }else if(!on&&boilTimer){clearInterval(boilTimer);boilTimer=0;}
  }

  /* BORDES FLORALES: guirnalda botánica a tinta arriba y abajo.
     Un módulo de GT px (enredadera + hojas + flores) se repite a lo ancho; abajo
     va reflejado y desfasado medio módulo. Avanza con la franja al 55 % (parallax)
     usando el recorrido acumulado, así nunca salta al cerrar el bucle.
     Las flores rosa y azul repiten los tonos de las cintas de seda. */
  const GT=208, GPAR=.55;
  const GC={rose:'#d68092',blue:'#7098c4',sage:'#8aa27a',sageDark:'#6d8a62'};
  const vineY=x=>6.6+2.4*Math.sin(x/GT*Math.PI*4);
  const vineSlope=x=>Math.atan(2.4*Math.PI*4/GT*Math.cos(x/GT*Math.PI*4))*180/Math.PI;
  const anim=(cls,origin,delay,inner)=>`<g class="${cls}" style="transform-box:fill-box;transform-origin:${origin};animation-delay:${delay.toFixed(2)}s">${inner}</g>`;
  const gLeaf=(x,side,len,delay,still)=>{
    const a=vineSlope(x)+side*38, y=vineY(x);
    const body=F(`M0 0C${len*.3} ${-len*.2} ${len*.76} ${-len*.15} ${len} 0C${len*.76} ${len*.15} ${len*.3} ${len*.2} 0 0Z`,side>0?GC.sage:GC.sageDark,C.ink,1)+
      L(`M${len*.12} 0H${len*.8}`,C.cream,.6,'stroke-opacity=".7"');
    return `<g transform="translate(${x.toFixed(1)} ${y.toFixed(2)}) rotate(${a.toFixed(1)})">${still?body:anim('g-leaf','0% 50%',delay,body)}</g>`;
  };
  const gFlower=(x,dy,r,fill,delay)=>{
    let p='';for(let i=0;i<5;i++)p+=`<ellipse cx="0" cy="${(-r*.56).toFixed(2)}" rx="${(r*.42).toFixed(2)}" ry="${(r*.56).toFixed(2)}" transform="rotate(${i*72})" fill="${fill}" stroke="${C.ink}" stroke-width=".8"/>`;
    const y=vineY(x);
    return L(`M${x} ${y.toFixed(2)}V${(y+dy-r*.6).toFixed(2)}`,C.ink,1)+
      `<g transform="translate(${x} ${(y+dy).toFixed(2)})">${anim('g-turn','50% 50%',delay,p+`<circle r="${(r*.28).toFixed(2)}" fill="${C.cheese}" stroke="${C.ink}" stroke-width=".7"/>`)}</g>`;
  };
  const gDaisy=(x,dy,r,delay)=>{
    let p='';for(let i=0;i<8;i++)p+=`<ellipse cx="0" cy="${(-r*.58).toFixed(2)}" rx="${(r*.2).toFixed(2)}" ry="${(r*.5).toFixed(2)}" transform="rotate(${i*45})" fill="${C.cream}" stroke="${C.ink}" stroke-width=".7"/>`;
    const y=vineY(x);
    return L(`M${x} ${y.toFixed(2)}V${(y+dy).toFixed(2)}`,C.ink,.8)+
      `<g transform="translate(${x} ${(y+dy).toFixed(2)})">${anim('g-bloom','50% 50%',delay,p+`<circle r="${(r*.3).toFixed(2)}" fill="${C.gold}" stroke="${C.ink}" stroke-width=".7"/>`)}</g>`;
  };
  const gBud=(x,delay)=>{
    const y=vineY(x);
    return `<g transform="translate(${x} ${y.toFixed(2)})">`+anim('g-sway','50% 0%',delay,
      L('M0 0Q1.8 3.4 0 7',C.ink,.8)+F('M0 7C-3.2 8 -3.6 12.4 0 15.2C3.6 12.4 3.2 8 0 7Z',GC.rose,C.ink,.9)+
      F('M0 7L-2.4 9.4L0 8.6L2.4 9.4Z',GC.sageDark,C.ink,.6)+L('M-1 10.4Q-1.4 12 -.6 13.2',C.cream,.7,'stroke-opacity=".8"'))+`</g>`;
  };
  const gCluster=(x,delay)=>{
    const y=vineY(x), tiny=(cx,cy)=>{let p='';for(let i=0;i<5;i++)p+=`<circle cx="${cx}" cy="${(cy-1.5).toFixed(2)}" r="1.25" transform="rotate(${i*72} ${cx} ${cy})" fill="${GC.blue}" stroke="${C.ink}" stroke-width=".5"/>`;return p+`<circle cx="${cx}" cy="${cy}" r=".6" fill="${C.cream}"/>`;};
    return `<g transform="translate(${x} ${y.toFixed(2)})">`+anim('g-sway','50% 0%',delay,
      L('M0 0Q-.6 3 -3.4 6.4M0 0Q.4 4 0 9.4M0 0Q.8 3 3.6 6',C.ink,.7)+tiny(-3.4,7.6)+tiny(0,11)+tiny(3.6,7.2))+`</g>`;
  };
  const gBerry=(x,delay)=>{
    const y=vineY(x);
    return `<g transform="translate(${x} ${y.toFixed(2)})">`+anim('g-sway','50% 0%',delay,
      L('M0 0Q-1.4 2.4 -2 4.6M0 0Q1.2 2.6 1.8 5.4',C.ink,.7)+`<circle cx="-2" cy="5.6" r="1.3" fill="${C.terra}" stroke="${C.ink}" stroke-width=".6"/><circle cx="1.8" cy="6.4" r="1.3" fill="${C.terra}" stroke="${C.ink}" stroke-width=".6"/>`)+`</g>`;
  };
  function gTile(k){
    const d=j=>-(((k*.61+j*.47)%2.2));
    let vine='M0 '+vineY(0).toFixed(2);for(let x=4;x<=GT;x+=4)vine+=`L${x} ${vineY(x).toFixed(2)}`;
    return L(vine,C.ink,1.25)+
      gLeaf(14,-1,8.4,d(1),true)+gLeaf(22,1,9,d(2))+gFlower(46,6.4,5.8,C.terra,d(3))+
      gLeaf(64,-1,8,d(4),true)+gBerry(70,d(5))+gCluster(92,d(6))+
      gLeaf(114,1,9,d(7))+gLeaf(120,-1,7.6,d(8),true)+L(`M126 ${vineY(126).toFixed(2)}q2.6 2.6 .4 5.4q-2 1.6 -.6 3.2`,C.ink,.7)+
      gBud(140,d(9))+gLeaf(158,1,8.4,d(10))+gDaisy(178,5.2,5.2,d(11))+gLeaf(198,-1,8.6,d(12),true);
  }
  function buildRules(){
    const w=root.clientWidth,h=root.clientHeight,n=Math.ceil((w+GT)/GT)+1;
    let top='',bottom='';
    for(let k=0;k<n;k++){
      top+=`<g transform="translate(${k*GT} 0)">${gTile(k)}</g>`;
      /* Desfase de medio módulo HACIA LA IZQUIERDA (k-1): así el primer módulo
         siempre empieza antes del borde y nunca queda un hueco a la izquierda. */
      bottom+=`<g transform="translate(${(k-1)*GT+GT/2} 0)">${gTile(k+5)}</g>`;
    }
    rules.innerHTML=`<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">`+
      `<g class="mq-garland">${top}</g>`+
      `<g transform="translate(0 ${h}) scale(1 -1)"><g class="mq-garland">${bottom}</g></g></svg>`;
    garlands=[...rules.querySelectorAll('.mq-garland')];
    paintRules();
  }
  function paintRules(){
    if(!garlands.length)return;
    const tx=(wrap(travel*GPAR,GT)-GT).toFixed(2);
    garlands.forEach(g=>g.setAttribute('transform',`translate(${tx} 0)`));
  }

  /* 5. ILUSTRACIÓN */
  function ornament(kind,cx,cy,size){
    const el=document.createElement('span');el.className='mq-orn';el.setAttribute('aria-hidden','true');
    Object.assign(el.style,{left:cx-size/2+'px',top:cy-size/2+'px',width:size+'px',height:size+'px'});
    /* Lenguaje único: todo contorno en tinta negra, color solo en rellenos planos. */
    const art=(ORN[kind]||'').replace(/stroke="(#19382c|#4a121a)"/g,`stroke="${C.ink}"`);
    el.innerHTML=`<svg viewBox="-24 -24 48 48"><g filter="url(#mq-boil)">${art}</g></svg>`;
    return el;
  }

  /* 6. MOTOR (rAF único) */
  function paint(){track.style.transform=`translateX(${-offset}px)`;paintRules();}
  function stopFrame(){cancelAnimationFrame(frame);frame=0;lastTime=0;}
  function kick(){if(!frame&&visible&&!document.hidden)frame=requestAnimationFrame(loop);}
  function loop(time){
    frame=0;
    if(!visible||document.hidden){lastTime=0;return;}
    const dt=lastTime?Math.min((time-lastTime)/1000,.1):0;lastTime=time;
    const animOn=root.dataset.anim==='true';
    if(moving&&dt){
      const target=hovered?.45:1, prev=speed;
      speed+=Math.sign(target-speed)*Math.min(Math.abs(target-speed),dt*.55/.45);
      accel=(speed-prev)/dt;
      offset=wrap(offset-28*speed*dt,width);travel+=28*speed*dt;paint();
    }else accel=0;
    if(animOn&&dt){waveT+=dt*(moving?.6+.4*speed:.7);drawWaves();}
    const target=motionOK()?clamp(accel*1.5+contentVel*.002,-2.4,2.4):0;
    if(dt){skewV+=((target-skew)*140-skewV*13)*dt;skew+=skewV*dt;contentVel*=Math.exp(-dt*10);}
    root.style.setProperty('--mq-skew',skew.toFixed(3)+'deg');
    if(moving||animOn||Math.abs(skew)>.004||Math.abs(skewV)>.04||Math.abs(contentVel)>2)frame=requestAnimationFrame(loop);
    else{lastTime=0;skew=0;skewV=0;root.style.setProperty('--mq-skew','0deg');}
  }
  function sync(){
    if(!width)return;
    const stopped=staticMode();
    if(stopped&&moving){
      const oldPosition=position()*width;moving=false;track.style.transform='translateX(0px)';
      root.dataset.moving='false';view.scrollLeft=oldPosition;lastScroll=view.scrollLeft;
    }else if(!stopped&&!moving){
      offset=position()*width;view.scrollLeft=0;lastScroll=0;moving=true;paint();
    }
    root.dataset.moving=String(moving);
    root.dataset.offscreen=String(!visible||document.hidden);
    const animOK=!reduced.matches&&!paused&&!reference&&visible&&!document.hidden&&!globalPaused();
    root.dataset.anim=String(animOK);setBoil(animOK);
    if(visible&&!document.hidden)kick();else stopFrame();
  }
  function layout(){
    const previousPosition=position();stopFrame();
    track.querySelectorAll('[data-clone]').forEach(node=>node.remove());
    sequence.querySelectorAll('.mq-orn,.mq-tick').forEach(node=>node.remove());
    track.style.transform='translateX(0px)';view.scrollLeft=0;lastScroll=0;
    const scale=parseFloat(getComputedStyle(root).getPropertyValue('--mq-scale'));
    const u=scale/.42, VH=view.clientHeight;
    const gap=reference?48:GAP;
    let cursor=gap/2;
    const shifts=items.map(item=>{
      const left=Math.min(item.title[0],item.sprite[0])*19.83;
      const right=Math.max(item.title[0]+item.title[2],item.sprite[0]+item.sprite[2])*19.83;
      const shift=cursor-left;cursor+=right-left+gap;return shift;
    });
    const artWidth=cursor-gap/2;
    root.style.setProperty('--mq-sequence-width',artWidth*scale+'px');
    if(reference)root.style.width=artWidth+'px';
    const crop=reference?0:260-(VH-234*scale)/2/scale;
    const ornSize=Math.min(56*u,gap*scale*.84);
    items.forEach((item,i)=>{
      const li=sequence.children[i],title=li.querySelector('.mq-title'),sprite=li.querySelector('.mq-sprite'),img=sprite.firstElementChild;
      const [l,t,w,h]=metrics[i],box=item.sprite;
      const bw=box[2]*19.83,bh=box[3]*7.93,k=Math.min(bw/w,bh/h);
      const x=box[0]*19.83+shifts[i]+(bw-w*k)/2-l*k,y=box[1]*7.93+(bh-h*k)/2-t*k;
      Object.assign(sprite.style,{left:x*scale+'px',top:(y-crop)*scale+'px',width:img.naturalWidth*k*scale+'px'});
      img.style.setProperty('--image-ratio',`${img.naturalWidth}/${img.naturalHeight}`);
      sprite.style.setProperty('--float-delay',(-i*.47)+'s');
      const family=li.dataset.voice==='serif'?'Antic Didone':'Marquee Anton';
      const lines=[...title.querySelectorAll('span')].map(span=>span.textContent);
      ctx.font=`400 100px "${family}"`;
      const ink=lines.map(line=>ctx.measureText(line)),sample=ink[0];
      const inkTop=Math.min(...ink.map((m,n)=>n*90-m.actualBoundingBoxAscent));
      const inkBottom=Math.max(...ink.map((m,n)=>n*90+m.actualBoundingBoxDescent));
      const size=item.title[3]*7.93*100/(inkBottom-inkTop)*scale;
      title.style.fontSize=size+'px';title.style.transform='none';title.style.width='max-content';
      title.style.transform=`scaleX(${item.title[2]*19.83*scale/title.getBoundingClientRect().width}) skewX(var(--mq-skew,0deg))`;
      const fullAsc=sample.fontBoundingBoxAscent||100,fullDesc=sample.fontBoundingBoxDescent||25;
      const topInk=((90-fullAsc-fullDesc)/2+fullAsc+inkTop)/100*size;
      title.style.left=(item.title[0]*19.83+shifts[i])*scale+'px';
      title.style.top=(item.title[1]*7.93-crop)*scale-topInk+'px';
      const groupEnd=(Math.max(item.title[0]+item.title[2],box[0]+box[2])*19.83+shifts[i])*scale;
      li.dataset.groupStart=((Math.min(item.title[0],box[0])*19.83+shifts[i])*scale).toFixed(3);
      li.dataset.groupEnd=groupEnd.toFixed(3);
      if(!reference)li.append(ornament(li.dataset.key,groupEnd+gap*scale/2,(377-crop)*scale,ornSize));
    });
    width=sequence.getBoundingClientRect().width;
    for(let i=0;i<Math.ceil(root.clientWidth/width)+1;i++){
      const clone=sequence.cloneNode(true);clone.dataset.clone='true';clone.setAttribute('aria-hidden','true');clone.inert=true;track.append(clone);
    }
    sizeWaves();drawWaves();if(!reference)buildRules();
    offset=previousPosition*width;moving=true;paint();root.dataset.moving='true';
    root.dataset.sequenceWidth=width.toFixed(2);
    layoutWidth=root.clientWidth;layoutHeight=root.clientHeight;layoutScale=scale;
    sync();
  }

  /* 7. INTERACCIÓN Y ACCESIBILIDAD */
  function updateButton(){
    if(!button)return; // El botón de laboratorio no se importa al sitio.
    button.disabled=reduced.matches||reference||root.dataset.ready!=='true';
    button.setAttribute('aria-pressed',String(paused));
    button.textContent=reduced.matches?'Movimiento reducido':reference?'Modo de estudio':paused?'Reanudar movimiento':'Pausar movimiento';
  }
  button?.addEventListener('click',()=>{paused=!paused;updateButton();sync()});
  view.addEventListener('keydown',event=>{
    if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
    event.preventDefault();focused=true;sync();
    const max=view.scrollWidth-view.clientWidth;
    let next=view.scrollLeft+(event.key==='ArrowRight'?1:-1)*view.clientWidth*.72;
    if(event.key==='Home')next=0;else if(event.key==='End')next=max;
    else {if(next>max+2)next=0;if(next<0)next=max;}
    view.scrollTo({left:Math.max(0,Math.min(max,next)),behavior:'auto'});
  });
  view.addEventListener('scroll',()=>{
    if(moving){lastScroll=view.scrollLeft;return;}
    const now=performance.now(),d=view.scrollLeft-lastScroll;
    const dt=Math.max((now-lastScrollT)/1000,.008);
    lastScroll=view.scrollLeft;lastScrollT=now;
    if(Math.abs(d)<view.clientWidth*.5){contentVel=clamp(-d/dt,-1600,1600);travel-=d;}
    drawWaves();paintRules();kick();
  },{passive:true});
  view.addEventListener('focus',()=>{focused=view.matches(':focus-visible');sync()});
  view.addEventListener('blur',()=>{focused=false;sync()});
  root.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse'){hovered=true;kick()}});
  root.addEventListener('pointerleave',()=>{hovered=false;kick()});
  view.addEventListener('pointerdown',event=>{if(event.pointerType==='touch'){touching=true;focused=false;hovered=false;sync()}});
  const finishTouch=()=>{if(touching){touching=false;sync()}};
  window.addEventListener('pointerup',finishTouch);window.addEventListener('pointercancel',finishTouch);
  document.addEventListener('visibilitychange',sync);
  document.addEventListener('casona:motion-change',sync);
  reduced.addEventListener('change',()=>{updateButton();sync()});
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync()},{rootMargin:'60px'}).observe(root);
  window.addEventListener('resize',()=>{
    clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>{
      if(root.dataset.ready!=='true')return;
      const scale=parseFloat(getComputedStyle(root).getPropertyValue('--mq-scale'));
      if(root.clientWidth!==layoutWidth||root.clientHeight!==layoutHeight||scale!==layoutScale)layout();
      else if((window.devicePixelRatio||1)!==dpr){sizeWaves();drawWaves();}
    },120);
  });
  (async()=>{
    await Promise.all([document.fonts.load('400 100px "Antic Didone"'),document.fonts.load('400 100px "Marquee Anton"'),...[...sequence.querySelectorAll('img')].map(img=>img.decode())]);
    root.dataset.ready='true';layout();updateButton();
    root.dispatchEvent(new CustomEvent('marquee:ready'));
  })().catch(error=>{
    console.error('[MARQUEE v6]',error);root.dataset.error='true';root.dataset.moving='false';
    if(status)status.textContent='No se pudo iniciar la composición. Comprueba que fonts/ e images/ acompañan al HTML. La lista sigue disponible sin animación.';
  });
})();
