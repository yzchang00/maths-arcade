/* ============ IMMERSIVE LAYER ============
   Adds motion, depth and live feedback on top of every Maths Arcade page:
   aurora background, cursor spotlight, 3D tilting cards, button ripples,
   screen transitions, scroll reveals, game search, streak combos with
   particle bursts on correct answers and a shake on wrong ones.
   Works on its own: if a page has no sfx/#view etc. those parts just switch off.
   Respects "reduce motion". */
(()=>{
if(window.__IMM)return;window.__IMM=1;
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const FINE=matchMedia('(hover:hover) and (pointer:fine)').matches;
const css=`
#imAur{position:fixed;inset:-20vmax;z-index:-1;pointer-events:none;filter:blur(70px);opacity:.55;transition:transform .6s ease-out}
#imAur i{position:absolute;border-radius:50%;width:46vmax;height:46vmax;mix-blend-mode:normal;animation:imFloat 22s ease-in-out infinite alternate}
#imAur i:nth-child(1){background:radial-gradient(circle,#5f50ec55,transparent 65%);left:5%;top:0}
#imAur i:nth-child(2){background:radial-gradient(circle,#0b968b55,transparent 65%);right:0;top:25%;animation-duration:28s;animation-delay:-6s}
#imAur i:nth-child(3){background:radial-gradient(circle,#ffb81f44,transparent 65%);left:30%;bottom:0;animation-duration:32s;animation-delay:-12s}
#imAur i:nth-child(4){background:radial-gradient(circle,#ef524035,transparent 65%);left:-5%;bottom:10%;animation-duration:26s;animation-delay:-3s}
@keyframes imFloat{0%{transform:translate(0,0) scale(1)}50%{transform:translate(8vmax,-6vmax) scale(1.15)}100%{transform:translate(-6vmax,5vmax) scale(.9)}}
#imSpot{position:fixed;inset:0;z-index:0;pointer-events:none;background:radial-gradient(420px circle at var(--mx,-999px) var(--my,-999px),color-mix(in srgb,var(--violet,#5f50ec) 13%,transparent),transparent 70%);transition:opacity .3s}
#imBar{position:fixed;left:0;top:0;height:4px;width:100%;transform-origin:0 50%;transform:scaleX(0);z-index:9998;background:linear-gradient(90deg,#0b968b,#5f50ec,#ef5240,#ffb81f);pointer-events:none}
.app{position:relative;z-index:1}
/* 3D cards */
.gcard{position:relative;transform-style:preserve-3d;will-change:transform;overflow:hidden;
  transition:transform .25s cubic-bezier(.2,.8,.2,1),box-shadow .25s,border-color .2s!important}
.gcard::after{content:"";position:absolute;inset:0;border-radius:inherit;pointer-events:none;opacity:0;transition:opacity .25s;
  background:radial-gradient(260px circle at var(--gx,50%) var(--gy,50%),rgba(255,255,255,.35),transparent 60%)}
.gcard.imHot{border-color:var(--c,#5f50ec)!important;box-shadow:0 18px 40px -12px color-mix(in srgb,var(--c,#5f50ec) 55%,transparent),0 0 0 1px var(--c,#5f50ec)}
.gcard.imHot::after{opacity:1}
.gcard.imHot .gl{transform:translateZ(30px) scale(1.12) rotate(-6deg)}
.gcard .gl{transition:transform .3s cubic-bezier(.3,1.6,.5,1)}
.gcard.imHide{display:none!important}
.gcard mark{background:var(--sun,#ffb81f);color:#16233a;border-radius:4px;padding:0 2px}
/* ripples */
.imRip{position:absolute;border-radius:50%;transform:scale(0);background:currentColor;opacity:.28;pointer-events:none;animation:imRip .6s ease-out forwards}
@keyframes imRip{to{transform:scale(1);opacity:0}}
.btn,.levels button{position:relative;overflow:hidden;transition:transform .15s cubic-bezier(.3,1.6,.5,1),box-shadow .2s}
.btn:active:not(:disabled),.levels button:active{transform:scale(.94)!important}
/* view transitions & reveal */
.imEnter{animation:imEnter .5s cubic-bezier(.2,.9,.25,1) both}
@keyframes imEnter{from{opacity:0;transform:translateY(18px) scale(.985);filter:blur(4px)}to{opacity:1;transform:none;filter:none}}
.strand.imPre{opacity:0;transform:translateY(40px)}
.strand.imIn{opacity:1;transform:none;transition:opacity .7s ease,transform .7s cubic-bezier(.2,.9,.25,1)}
.hero .hl{display:inline-block;transition:transform .18s ease-out}
/* search */
.imSearch{display:flex;gap:10px;align-items:center;background:var(--surface);border:2px solid var(--line);border-radius:999px;padding:6px 8px 6px 16px;transition:border-color .2s,box-shadow .2s}
.imSearch:focus-within{border-color:var(--violet);box-shadow:0 0 0 5px color-mix(in srgb,var(--violet) 22%,transparent)}
.imSearch input{flex:1;min-width:0;border:0;background:transparent;color:var(--ink);font:700 16px var(--body,system-ui);outline:none!important;padding:6px 0}
.imSearch kbd{font:800 12px var(--body,system-ui);border:2px solid var(--line);border-radius:6px;padding:1px 7px;color:var(--muted)}
.imSearch .imCount{font:800 13px var(--body,system-ui);color:var(--muted);white-space:nowrap}
.imSurprise{font:800 14px var(--body,system-ui);border:0;border-radius:999px;padding:8px 14px;cursor:pointer;color:#fff;background:linear-gradient(135deg,#5f50ec,#ef5240);white-space:nowrap}
.imSurprise:hover{filter:brightness(1.1)}
.strand.imEmpty{display:none}
/* feedback */
#imFx{position:fixed;inset:0;z-index:9997;pointer-events:none}
#imVig{position:fixed;inset:0;z-index:9996;pointer-events:none;opacity:0;transition:opacity .5s}
#imVig.g{box-shadow:inset 0 0 120px 30px rgba(18,152,90,.55);opacity:1;transition:opacity .05s}
#imVig.b{box-shadow:inset 0 0 120px 30px rgba(222,63,70,.55);opacity:1;transition:opacity .05s}
.imShake{animation:imShake .45s cubic-bezier(.36,.07,.19,.97)}
@keyframes imShake{10%,90%{transform:translateX(-2px)}20%,80%{transform:translateX(4px)}30%,50%,70%{transform:translateX(-8px)}40%,60%{transform:translateX(8px)}}
#imStreak{position:fixed;left:50%;bottom:calc(18px + env(safe-area-inset-bottom,0px));transform:translate(-50%,140%);z-index:9999;pointer-events:none;
  font:700 18px var(--display,system-ui);color:#fff;background:linear-gradient(135deg,#ef5240,#ffb81f);padding:10px 20px;border-radius:999px;
  box-shadow:0 10px 30px -8px rgba(239,82,64,.7);transition:transform .45s cubic-bezier(.3,1.6,.5,1);display:flex;gap:10px;align-items:center}
#imStreak.on{transform:translate(-50%,0)}
#imStreak.pump{animation:imPump .4s cubic-bezier(.3,1.8,.5,1)}
#imStreak .m{display:inline-block;width:90px;height:8px;border-radius:9px;background:rgba(255,255,255,.35);overflow:hidden}
#imStreak .m b{display:block;height:100%;background:#fff;border-radius:9px;transition:width .35s}
@keyframes imPump{50%{transform:translate(-50%,0) scale(1.18)}}
.imFloat{position:fixed;z-index:9999;pointer-events:none;font:700 26px var(--display,system-ui);color:var(--good,#12985a);text-shadow:0 2px 0 #fff,0 0 18px rgba(18,152,90,.5);animation:imUp 1s ease-out forwards;transform:translate(-50%,-50%)}
@keyframes imUp{to{transform:translate(-50%,-140%) scale(1.3);opacity:0}}
.imBanner{position:fixed;left:50%;top:38%;z-index:9999;pointer-events:none;font:700 clamp(32px,7vw,64px) var(--display,system-ui);color:#fff;
  -webkit-text-stroke:2px #16233a;paint-order:stroke;text-shadow:0 6px 0 #16233a;animation:imBan 1.4s cubic-bezier(.2,1.4,.4,1) forwards;white-space:nowrap}
@keyframes imBan{0%{transform:translate(-50%,-50%) scale(.2) rotate(-12deg);opacity:0}25%{transform:translate(-50%,-50%) scale(1.1) rotate(3deg);opacity:1}70%{transform:translate(-50%,-50%) scale(1) rotate(0);opacity:1}100%{transform:translate(-50%,-90%) scale(.9);opacity:0}}
@media (prefers-reduced-motion:reduce){#imAur i,.imEnter,.imShake,.imBanner,.imFloat{animation:none!important}.strand.imPre{opacity:1;transform:none}}
`;
const st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
const mk=(tag,id,html)=>{const e=document.createElement(tag);if(id)e.id=id;if(html)e.innerHTML=html;document.body.appendChild(e);return e};
const aur=mk('div','imAur','<i></i><i></i><i></i><i></i>');
const spot=FINE&&!RM?mk('div','imSpot'):null;
const bar=mk('div','imBar');
const fx=mk('canvas','imFx'),fc=fx.getContext('2d');
const vig=mk('div','imVig');
const streakEl=mk('div','imStreak','<span>🔥</span><span class="t">0 in a row</span><span class="m"><b style="width:0"></b></span>');

/* pointer: spotlight + parallax + hero letters */
let PX=innerWidth/2,PY=innerHeight/2,ptrQueued=false;
addEventListener('pointermove',e=>{PX=e.clientX;PY=e.clientY;if(ptrQueued)return;ptrQueued=true;requestAnimationFrame(()=>{ptrQueued=false;
  if(spot){spot.style.setProperty('--mx',PX+'px');spot.style.setProperty('--my',PY+'px')}
  if(!RM){const dx=PX/innerWidth-.5,dy=PY/innerHeight-.5;aur.style.transform=`translate(${dx*-40}px,${dy*-40}px)`;
    const bg=document.getElementById('bgfx');if(bg)bg.style.transform=`translate(${dx*18}px,${dy*18}px)`;
    if(FINE)document.querySelectorAll('.hero .hl').forEach(l=>{const r=l.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2,d=Math.hypot(PX-cx,PY-cy),k=Math.max(0,1-d/160);
      l.style.transform=k?`translateY(${-k*14}px) rotate(${(PX-cx)/r.width*k*8}deg) scale(${1+k*.18})`:''})}
})},{passive:true});
addEventListener('pointerdown',e=>{PX=e.clientX;PY=e.clientY},{passive:true,capture:true});

/* 3D tilt on game cards */
let hot=null;
const untilt=c=>{c.classList.remove('imHot');c.style.transform=''};
if(FINE&&!RM){
  document.addEventListener('pointermove',e=>{const c=e.target.closest&&e.target.closest('.gcard');if(hot&&hot!==c){untilt(hot);hot=null}
    if(!c)return;hot=c;const r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;
    c.classList.add('imHot');c.style.setProperty('--gx',x*100+'%');c.style.setProperty('--gy',y*100+'%');
    c.style.transform=`perspective(700px) rotateX(${(.5-y)*10}deg) rotateY(${(x-.5)*12}deg) translateY(-4px) scale(1.02)`},{passive:true});
  document.addEventListener('pointerleave',()=>{if(hot){untilt(hot);hot=null}});
  /* magnetic buttons */
  document.addEventListener('pointermove',e=>{const b=e.target.closest&&e.target.closest('.btn');document.querySelectorAll('.btn.imMag').forEach(o=>{if(o!==b){o.classList.remove('imMag');o.style.translate=''}});
    if(!b||b.disabled)return;const r=b.getBoundingClientRect();b.classList.add('imMag');b.style.translate=`${(e.clientX-r.left-r.width/2)*.15}px ${(e.clientY-r.top-r.height/2)*.25}px`},{passive:true});
}
/* ripples */
document.addEventListener('pointerdown',e=>{if(RM)return;const b=e.target.closest&&e.target.closest('button,.btn,.gcard,[role=button]');if(!b||b.disabled)return;
  const cs=getComputedStyle(b);if(cs.position==='static')b.style.position='relative';if(cs.overflow==='visible')b.style.overflow='hidden';
  const r=b.getBoundingClientRect(),s=Math.max(r.width,r.height)*2.2,d=document.createElement('span');d.className='imRip';
  d.style.cssText=`width:${s}px;height:${s}px;left:${e.clientX-r.left-s/2}px;top:${e.clientY-r.top-s/2}px`;b.appendChild(d);setTimeout(()=>d.remove(),650)},{passive:true});

/* scroll progress */
const onScroll=()=>{const h=document.documentElement.scrollHeight-innerHeight;bar.style.transform=`scaleX(${h>0?scrollY/h:0})`};
addEventListener('scroll',onScroll,{passive:true});

/* particles */
let P=[],praf=null;
const size=()=>{fx.width=innerWidth*devicePixelRatio;fx.height=innerHeight*devicePixelRatio;fx.style.width=innerWidth+'px';fx.style.height=innerHeight+'px'};size();addEventListener('resize',size);
const COL=['#0b968b','#ef5240','#ffb81f','#5f50ec','#45d08a'],SYM=['+','×','=','★','✓','½','%'];
function burst(x,y,n=26,power=1){if(RM)return;for(let i=0;i<n;i++){const a=Math.random()*Math.PI*2,v=(2+Math.random()*6)*power;
  P.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-2,life:1,dec:.012+Math.random()*.02,c:COL[i%COL.length],s:6+Math.random()*10,t:Math.random()<.4?SYM[i%SYM.length]:null,r:Math.random()*6,vr:(Math.random()-.5)*.3})}
  if(!praf)praf=requestAnimationFrame(tick)}
function tick(){const d=devicePixelRatio;fc.clearRect(0,0,fx.width,fx.height);P=P.filter(p=>p.life>0);
  P.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=.22;p.vx*=.98;p.r+=p.vr;p.life-=p.dec;fc.save();fc.globalAlpha=Math.max(0,p.life);fc.translate(p.x*d,p.y*d);fc.rotate(p.r);fc.fillStyle=p.c;
    if(p.t){fc.font=`700 ${p.s*2*d}px Fredoka,system-ui`;fc.textAlign='center';fc.fillText(p.t,0,0)}else{fc.beginPath();fc.arc(0,0,p.s*.5*d,0,7);fc.fill()}fc.restore()});
  praf=P.length?requestAnimationFrame(tick):(fc.clearRect(0,0,fx.width,fx.height),null)}
const flash=k=>{vig.className=k;setTimeout(()=>vig.className='',120)};
const floatTxt=(t,x,y,col)=>{const e=document.createElement('div');e.className='imFloat';e.textContent=t;if(col)e.style.color=col;e.style.left=x+'px';e.style.top=y+'px';document.body.appendChild(e);setTimeout(()=>e.remove(),1000)};
const banner=t=>{if(RM)return;const e=document.createElement('div');e.className='imBanner';e.textContent=t;document.body.appendChild(e);setTimeout(()=>e.remove(),1400)};

/* streaks: hook into the arcade's own sound effects for right / wrong / win */
let streak=0,best=0,hideT=null;
const PRAISE={3:'Nice!',5:'On fire!',8:'Unstoppable!',10:'Maths Legend!',15:'Genius mode!',20:'Incredible!'};
function showStreak(){const t=streakEl.querySelector('.t'),m=streakEl.querySelector('.m b');t.textContent=streak+' in a row'+(best>streak?'':' · best!');
  m.style.width=Math.min(100,(streak%5||5)*20)+'%';streakEl.classList.add('on');streakEl.classList.remove('pump');void streakEl.offsetWidth;streakEl.classList.add('pump');
  clearTimeout(hideT);hideT=setTimeout(()=>streakEl.classList.remove('on'),3500)}
function onRight(){streak++;best=Math.max(best,streak);const x=PX||innerWidth/2,y=PY||innerHeight/2;
  burst(x,y,18+Math.min(streak,10)*3,1+Math.min(streak,10)*.06);flash('g');floatTxt(streak>1?'+1  ×'+streak:'+1',x,y-10);
  if(streak>=2)showStreak();if(PRAISE[streak]){banner(PRAISE[streak]);setTimeout(()=>burst(innerWidth/2,innerHeight*.4,60,1.6),150)}}
function onWrong(){if(streak>=3)floatTxt('Streak lost',PX,PY-10,'#de3f46');streak=0;flash('b');streakEl.classList.remove('on');
  const v=document.getElementById('view')||document.querySelector('main')||document.body;if(!RM){v.classList.remove('imShake');void v.offsetWidth;v.classList.add('imShake');setTimeout(()=>v.classList.remove('imShake'),500)}}
function onWin(){for(let i=0;i<4;i++)setTimeout(()=>burst(innerWidth*(.2+.2*i),innerHeight*.35,50,1.8),i*160)}
function hook(){const S=(typeof sfx!=='undefined')?sfx:window.sfx;if(!S||S.__imm)return!!S;S.__imm=1;
  const wrap=(k,f)=>{if(typeof S[k]!=='function')return;const o=S[k];S[k]=function(){try{f()}catch(e){}return o.apply(this,arguments)}};
  wrap('ok',onRight);wrap('right',onRight);wrap('correct',onRight);wrap('no',onWrong);wrap('wrong',onWrong);wrap('win',onWin);return true}
if(!hook()){let n=0;const iv=setInterval(()=>{if(hook()||++n>40)clearInterval(iv)},250)}
window.IMM={burst,banner,floatTxt};

/* view transitions, reveals, hub search */
const view=document.getElementById('view');
const io='IntersectionObserver' in window?new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('imIn');e.target.classList.remove('imPre');io.unobserve(e.target)}}),{rootMargin:'0px 0px -8% 0px'}):null;
function enhance(){if(!view)return;const f=view.firstElementChild;if(f&&!f.__imm){f.__imm=1;if(!RM){f.classList.remove('imEnter');void f.offsetWidth;f.classList.add('imEnter')}streak=0;streakEl.classList.remove('on')}
  if(io&&!RM)view.querySelectorAll('.strand:not(.imPre):not(.imIn)').forEach((s,i)=>{if(i===0){s.classList.add('imIn');return}s.classList.add('imPre');io.observe(s)});
  const lv=view.querySelector('.levels');if(lv&&!view.querySelector('.imSearch')&&view.querySelectorAll('.gcard').length>3)addSearch(lv)}
function addSearch(lv){const w=document.createElement('div');w.className='imSearch';
  w.innerHTML='<span aria-hidden="true">🔎</span><input type="search" placeholder="Find a game: fractions, angles, time…" aria-label="Search games"><span class="imCount"></span><kbd title="Press / to search">/</kbd><button type="button" class="imSurprise" title="Open a random game">🎲 Surprise me</button>';
  lv.after(w);const inp=w.querySelector('input'),cnt=w.querySelector('.imCount');
  const cards=[...view.querySelectorAll('.gcard')];cards.forEach(c=>{const b=c.querySelector('b');if(b&&!b.dataset.t)b.dataset.t=b.textContent});
  inp.oninput=()=>{const q=inp.value.trim().toLowerCase();let n=0;
    cards.forEach(c=>{const hit=!q||c.textContent.toLowerCase().includes(q);c.classList.toggle('imHide',!hit);if(hit)n++;
      const b=c.querySelector('b');if(b){const t=b.dataset.t,i=q?t.toLowerCase().indexOf(q):-1;b.innerHTML=i<0?esc(t):esc(t.slice(0,i))+'<mark>'+esc(t.slice(i,i+q.length))+'</mark>'+esc(t.slice(i+q.length))}});
    view.querySelectorAll('.strand').forEach(s=>{s.classList.toggle('imEmpty',!s.querySelector('.gcard:not(.imHide)'));if(q){s.classList.add('imIn');s.classList.remove('imPre')}});
    cnt.textContent=q?n+' found':''};
  inp.onkeydown=e=>{if(e.key==='Enter'){const f=cards.find(c=>!c.classList.contains('imHide'));if(f)f.click()}if(e.key==='Escape'){inp.value='';inp.oninput();inp.blur()}};
  w.querySelector('.imSurprise').onclick=()=>{const vis=cards.filter(c=>!c.classList.contains('imHide'));if(!vis.length)return;let k=0;const order=[...vis].sort(()=>Math.random()-.5).slice(0,8);
    const step=()=>{order.forEach(c=>untilt(c));const c=order[k];c.classList.add('imHot');c.scrollIntoView({block:'center',behavior:RM?'auto':'smooth'});
      if(typeof sfx!=='undefined'&&sfx.tap)sfx.tap();if(++k<order.length)setTimeout(step,110+k*25);else setTimeout(()=>{const r=c.getBoundingClientRect();burst(r.left+r.width/2,r.top+r.height/2,30);setTimeout(()=>c.click(),450)},300)};step()}}
const esc=s=>s.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
addEventListener('keydown',e=>{if(e.key==='/'&&!/input|textarea|select/i.test(document.activeElement.tagName)){const i=document.querySelector('.imSearch input');if(i){e.preventDefault();i.focus()}}});
if(view){new MutationObserver(enhance).observe(view,{childList:true});enhance()}
})();
