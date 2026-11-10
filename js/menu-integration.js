/* Native merge of the supplied demo into #menu. No iframe or separate scroll surface. */
(async () => {
  'use strict';
  const root = document.getElementById('menu');
  if (!root?.classList.contains('menu-native')) return;
  const entry = new URL(location.href);
  const qr = entry.searchParams.has('mesa') || entry.searchParams.has('k');
  const direct = qr || ['#menu', '#menu-digital'].includes(entry.hash);
  const origin = new URL('../', document.baseURI).href; // Project root, including a GitHub Pages repository prefix.
  const cssRoot = '#menu';
  const splitSelectors = text => {
    const out=[];let start=0,depth=0,quote='';
    for(let i=0;i<text.length;i++){
      const c=text[i];
      if(quote){if(c===quote&&text[i-1]!=='\\')quote='';continue;}
      if(c==='"'||c==="'"){quote=c;continue;}
      if(c==='('||c==='[')depth++;
      else if(c===')'||c===']')depth--;
      else if(c===','&&!depth){out.push(text.slice(start,i).trim());start=i+1;}
    }
    out.push(text.slice(start).trim());return out;
  };
  // Preserve all original declarations and breakpoints. Change only their target scope.
  function nativeCSS(text, source) {
    text=text.replace(/url\(\s*(['"]?)([^)'"\s]+)\1\s*\)/g,(whole,q,url)=>{
      if(url.startsWith('#')||/^(data:|blob:)/.test(url))return whole;
      return 'url("'+new URL(url,source).href+'")';
    });
    const selector = s => {
      if(/^(:root|html|body)(?=[\s.#:\[>+~]|$)/.test(s)) return s.replace(/^(:root|html|body)/,cssRoot);
      if(/^\.js(?=[\s.#:\[>+~]|$)/.test(s)) return cssRoot+s;
      return cssRoot+' '+s;
    };
    // Work on original declaration text: CSSOM serialization can drop a var()-based
    // font shorthand followed by font-variant-numeric. That would change the demo.
    function boundary(input,start,wanted){
      let quote='',comment=false,paren=0;
      for(let i=start;i<input.length;i++){
        const c=input[i],n=input[i+1];
        if(comment){if(c==='*'&&n==='/'){comment=false;i++;}continue;}
        if(quote){if(c===quote&&input[i-1]!=='\\')quote='';continue;}
        if(c==='/'&&n==='*'){comment=true;i++;continue;}
        if(c==='"'||c==="'"){quote=c;continue;}
        if(c==='('||c==='[')paren++;else if(c===')'||c===']')paren--;
        if(!paren&&wanted.includes(c))return i;
      }return input.length;
    }
    function walk(input){
      let out='',pos=0;
      while(pos<input.length){
        const open=boundary(input,pos,'{;');
        if(open===input.length){out+=input.slice(pos);break;}
        if(input[open]===';'){out+=input.slice(pos,open+1);pos=open+1;continue;}
        const rawHead=input.slice(pos,open);
        const head=rawHead.replace(/\/\*[\s\S]*?\*\//g,'').trim();
        let close=open+1,depth=1;
        while(depth&&close<input.length){const edge=boundary(input,close,'{}');if(edge===input.length){close=edge;break;}depth+=input[edge]==='{'?1:-1;close=edge+1;}
        const body=input.slice(open+1,close-1);
        if(head.startsWith('@')){
          out+=head+'{'+(/^@(media|supports|container|layer|scope)\b/i.test(head)?walk(body):body)+'}';
        }else{
          const names=splitSelectors(head).map(selector);
          const declarations=names.includes(cssRoot)?body.replace(/overflow(?:-x|-y)?\s*:\s*[^;]+;?/gi,''):body;
          out+=names.join(',')+'{'+declarations+'}';
          if(names.includes(cssRoot+'::before'))out+=cssRoot+'::before{position:absolute}';
        }
        pos=close;
      }return out;
    }
    return walk(text);
  }
  window.CasonaNativeCSS=nativeCSS;
  async function get(path){const r=await fetch(new URL(path,origin));if(!r.ok)throw Error(path+' · HTTP '+r.status);return r.text();}
  function scripts(paths){
    // Fetch together, execute in dependency order (not one network round trip per file).
    return Promise.all(paths.map(path=>new Promise((resolve,reject)=>{
      const s=document.createElement('script');s.async=false;s.src=new URL(path,origin);
      s.onload=resolve;s.onerror=()=>reject(Error('No se pudo cargar '+path));document.head.append(s);
    })));
  }
  function align(){
    const target=qr ? root.querySelector('#modeCard') || root : root;
    window.scrollTo({top:Math.max(0,window.scrollY+target.getBoundingClientRect().top-(qr?12:0)),behavior:'instant'});
  }
  // Arrival belongs to the visitor once they interact. Never pull them back on
  // delayed validation, font loading, a rerender, or the stamp becoming ready.
  let arrivalPending=direct;
  const arrivalEvents=new AbortController();
  function cancelArrival(){arrivalPending=false;arrivalEvents.abort();}
  if(direct){
    ['wheel','touchstart','pointerdown'].forEach(type=>addEventListener(type,cancelArrival,{passive:true,signal:arrivalEvents.signal}));
    addEventListener('keydown',event=>{
      if(['ArrowUp','ArrowDown','PageUp','PageDown','Home','End',' ','Tab'].includes(event.key))cancelArrival();
    },{signal:arrivalEvents.signal});
  }
  function landOnce(){
    requestAnimationFrame(()=>{
      if(!arrivalPending)return;
      cancelArrival();align();root.dataset.arrivalAligned='true';
    });
  }
  try {
    const paths=['css/menu-v2.css','css/mesa-stamp.css','css/polished-ui.css'];
    // Warm the dependency downloads while markup/styles are being fetched.
    const controllers=[
      ...(!window.supabase?['js/vendor/supabase-js-2.57.4.js']:[]),
      ...(!window.CasonaCloud?['js/cloud.js']:[]),
      'js/v2/config.js','js/v2/menu-data.js','js/v2/polished-ui.js',
      'js/v2/mesa-stamp.js','js/v2/menu-native.js','js/v2/patio-native.js'
    ];
    controllers.forEach(path=>{
      const link=document.createElement('link');link.rel='preload';link.as='script';
      link.href=new URL(path,origin);document.head.append(link);
    });
    const [html,...styles]=await Promise.all([get('web/menuV2.html'),...paths.map(get)]);
    const parsed=new DOMParser().parseFromString(html,'text/html');
    parsed.querySelectorAll('script,iframe,link').forEach(n=>n.remove());
    // Avoid duplicate page landmarks/IDs. All design markup remains the demo's markup.
    const intro=parsed.getElementById('inicio');if(intro)intro.id='menu-portada';
    const list=parsed.getElementById('menu');
    const items=parsed.createElement('div');
    for(const attr of list.attributes)items.setAttribute(attr.name,attr.value);
    items.id='menu-items';items.append(...list.childNodes);list.replaceWith(items);
    parsed.querySelectorAll('.skip').forEach(node=>node.remove());
    const base=document.createElement('style');base.dataset.nativeMenuStyle='base';
    base.textContent='#menu :where(*:not(svg, svg *)){all:revert}\n#menu :where(svg){display:revert}\n'+styles.map((text,i)=>nativeCSS(text,new URL(paths[i],origin))).join('\n');
    document.head.append(base);
    const mono=document.createElement('link');mono.rel='stylesheet';mono.href='https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap';document.head.append(mono);
    root.replaceChildren(...parsed.body.childNodes);
    root.classList.add('js');
    // No storage migration or backend reset; use the same public connection and controllers.
    await scripts(controllers);
    root.removeAttribute('aria-busy');root.dataset.nativeReady='true';
    if(entry.hash==='#menu-digital'){
      const u=new URL(location.href);u.hash='menu';history.replaceState(history.state,'',u.href);
    }
    // Render first; neither Supabase nor all document fonts gate arrival/readiness.
    if(direct)landOnce();
    addEventListener('hashchange',()=>{
      if(location.hash==='#menu-digital'){const u=new URL(location.href);u.hash='menu';history.replaceState(history.state,'',u.href);align();}
    });
    document.dispatchEvent(new CustomEvent('casona:menu-ready'));
  }catch(error){
    cancelArrival();
    console.error('[La Casona · menú nativo]',error);
    root.removeAttribute('aria-busy');root.dataset.nativeError='true';
    const p=document.createElement('p');p.className='menu-loading';p.setAttribute('role','alert');p.textContent='No se pudo cargar el menú. Revisa tu conexión y vuelve a intentarlo. ';
    const b=document.createElement('button');b.type='button';b.textContent='Reintentar';b.onclick=()=>location.reload();p.append(b);root.replaceChildren(p);
  }
})();
